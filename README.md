# CodeAtlas: AI-Powered Emergency Response Platform 🚨

CodeAtlas is an intelligent, real-time emergency dispatch and incident management platform. It seamlessly bridges a **Next.js Realtime Frontend** with a **Python FastAPI Machine Learning Pipeline** to automatically ingest, classify, triage, and map emergency events as they happen.

## 🌟 Key Features

- **Real-Time Incident Mapping**: Live, interactive dashboard plotting emergencies instantly via Supabase Realtime subscriptions.
- **AI Triage & Classification**: Incoming text (from 911 transcripts, citizen apps, or IoT sensors) is pushed through an **XGBoost** model to predict incident category (FIRE, MEDICAL, POLICE) and severity (LOW to CRITICAL).
- **Keyword Extraction**: Integrates **YAKE** to extract critical action-items from unstructured emergency reports.
- **Spatio-Temporal Deduplication**: Automatically deduplicates redundant incoming reports using PostgreSQL/PostGIS spatial radius matching.
- **Live Fleet Tracking**: Real-time GPS telemetry from response units broadcasted and visualized on the map.
- **Synthetic Simulator Engine**: Built-in Node.js simulation engine to test the ML pipeline under heavy data loads.

---

## 🏗️ Architecture Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend UI** | Next.js, React, TailwindCSS | Beautiful, glassmorphic reactive interface. |
| **Backend API** | Python, FastAPI, Uvicorn | High-performance ingestion endpoint for data streams. |
| **Machine Learning** | XGBoost, scikit-learn, YAKE | Core AI models for text classification & entity extraction. |
| **Database** | Supabase (PostgreSQL) | Central source of truth. PostGIS for spatial queries. |
| **Realtime Engine** | Supabase Realtime | WebSocket streaming pushing DB updates to the UI. |

---

## 🚀 Getting Started

To run the full stack locally, you will need three terminal windows: one for the frontend, one for the backend, and one for the optional simulator.

### 1. Database Configuration
Ensure you have your Supabase project URL and Anon Key ready.

**Frontend Setup (`frontend/.env.local`)**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend Setup (`backend/.env`)**:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

### 2. Start the ML Backend
You must install the system requirements for XGBoost (e.g., `brew install libomp` on macOS) before running the python backend.

```bash
cd backend
pip install fastapi uvicorn supabase python-dotenv joblib scikit-learn xgboost pandas sentence-transformers
python -m backend.main
```
*The backend will start on `http://localhost:8000`.*

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*The web dashboard will start on `http://localhost:3000`.*

### 4. Run the Simulator (Optional)
To see the map light up with live synthetic data (incidents and fleet telemetry):

```bash
cd backend/simulator
npm install
npm start
```

---

## 🧠 How the Pipeline Works

1. **Ingestion**: The `/ingest` API receives a payload (e.g., an emergency call transcript).
2. **Evaluation**: The Python `IncidentPipeline` processes the transcript through the XGBoost classifier and YAKE keyword extractor.
3. **Deduplication**: The system queries Supabase via a fast RPC function to check if an active incident already exists within a 500m radius in the last 30 minutes. If yes, it consolidates them and escalates the severity if necessary.
4. **Recommendation**: The Resource Recommender checks the in-memory cache of live fleet telemetry to find the closest available units matching the required capability.
5. **Storage**: The finalized Incident Card and recommendations are saved to the `incidents` table in Supabase.
6. **Broadcast**: Supabase Realtime detects the database insert/update and instantly broadcasts the payload to the Next.js frontend, painting it on the map with zero polling!

---
*Built with ❤️ for rapid emergency response.*