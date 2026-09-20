/**
 * API Service Layer — Connects the Next.js frontend to the FastAPI ML Pipeline backend.
 *
 * The backend runs at NEXT_PUBLIC_API_URL (default: http://localhost:8000).
 * It exposes a single POST /ingest endpoint that accepts emergency payloads,
 * runs XGBoost classification, YAKE keyword extraction, spatio-temporal deduplication,
 * and AI resource recommendations — then writes the result to Supabase.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface IngestResponse {
  status: string;
  incident?: {
    id: string;
    incident_type: string;
    severity: string;
    status: string;
    location: { lat: number; lng: number };
    source_events: string[];
    ai_recommendation?: string;
    recommended_units?: string[];
    created_at?: string;
    updated_at?: string;
    description?: string;
  };
}

/**
 * Send an emergency call transcript through the ML pipeline.
 * The backend will:
 *  1. Extract keywords with YAKE
 *  2. Classify category + severity with XGBoost
 *  3. Deduplicate against nearby active incidents (PostGIS)
 *  4. Generate AI resource recommendations
 *  5. Write the incident to Supabase (triggers Realtime → frontend)
 */
export async function ingestEmergencyCall(payload: {
  transcript: string;
  lat: number;
  lng: number;
  caller_id?: string;
}): Promise<IngestResponse> {
  const body = {
    stream_type: "EMERGENCY_CALL",
    timestamp: new Date().toISOString(),
    caller_id: payload.caller_id || `web-${Date.now()}`,
    location: {
      lat: payload.lat,
      lng: payload.lng,
    },
    transcript: payload.transcript,
  };

  const res = await fetch(`${API_BASE}/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Backend returned ${res.status}`);
  }

  return res.json();
}

/**
 * Send a citizen app report through the ML pipeline.
 */
export async function ingestCitizenReport(payload: {
  description: string;
  incident_category: string;
  lat: number;
  lng: number;
  user_id?: string;
}): Promise<IngestResponse> {
  const body = {
    stream_type: "CITIZEN_APP",
    timestamp: new Date().toISOString(),
    user_id: payload.user_id || `citizen-${Date.now()}`,
    location: {
      lat: payload.lat,
      lng: payload.lng,
    },
    incident_category: payload.incident_category,
    description: payload.description,
  };

  const res = await fetch(`${API_BASE}/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Backend returned ${res.status}`);
  }

  return res.json();
}
