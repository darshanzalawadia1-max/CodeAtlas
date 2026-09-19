"use client";

import React, { useState } from "react";
import { X, Flame, MapPin, Send } from "lucide-react";
import { Incident, IncidentType, SeverityLevel } from "@/lib/types";
import { ShinyButton } from "@/components/ui/shiny-button";

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateIncident: (newIncident: Incident) => void;
}

export const CreateIncidentModal: React.FC<CreateIncidentModalProps> = ({
  isOpen,
  onClose,
  onCreateIncident,
}) => {
  const [type, setType] = useState<IncidentType>("Structure Fire");
  const [severity, setSeverity] = useState<SeverityLevel>("High");
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState(23.0338);
  const [lon, setLon] = useState(72.562);
  const [callerReport, setCallerReport] = useState("");
  const [commander, setCommander] = useState("Capt. M. Vance");
  const [initialUnits, setInitialUnits] = useState("Engine 1, Medic 2");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !callerReport.trim()) return;

    const now = new Date();
    const timeReceived = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newId = `INC-${Math.floor(4800 + Math.random() * 200)}`;

    const incident: Incident = {
      id: newId,
      type,
      severity,
      location,
      coordinates: { lat, lon },
      timeReceived,
      timeAgo: "Just now",
      assignedUnits: initialUnits
        ? initialUnits.split(",").map((u) => u.trim()).filter(Boolean)
        : [],
      status: "Dispatched",
      incidentCommander: commander,
      hydrantStatus: "Adequate (950 GPM)",
      evacuationRadiusMeters: severity === "Critical" ? 200 : 50,
      callerReport,
      aiRecommendation: `Immediate response initialized for ${type}. Staging perimeter established at ${location}. Maintain tactical channel 4.`,
      duplicateReportsCount: 1,
      timeline: [
        {
          time: timeReceived,
          description: `Incident logged and dispatched by CAD Supervisor`,
          actor: "Supervisor Miller",
        },
      ],
    };

    onCreateIncident(incident);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-incident-title"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 border border-rose-200 text-rose-600">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <h2 id="create-incident-title" className="font-bold text-slate-900 text-base">
                Create & Dispatch Incident
              </h2>
              <p className="text-xs text-slate-500">
                Log priority call and alert District 01 response units
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Incident Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as IncidentType)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
              >
                <option value="Structure Fire">Structure Fire</option>
                <option value="Vehicle Collision">Vehicle Collision</option>
                <option value="Medical Emergency">Medical Emergency</option>
                <option value="Gas Leak">Gas Leak</option>
                <option value="Infrastructure / Flood">Infrastructure / Flood</option>
                <option value="Hazardous Materials">Hazardous Materials</option>
                <option value="Power Grid Surge">Power Grid Surge</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none font-semibold"
              >
                <option value="Critical">Critical (Immediate Hazard)</option>
                <option value="High">High (Major Incident)</option>
                <option value="Medium">Medium (Standard Dispatch)</option>
                <option value="Low">Low (Routine Priority)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Incident Location / Street Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. 520 University Highway, West District"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={lon}
                onChange={(e) => setLon(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Caller Notes / Dispatch Description
            </label>
            <textarea
              required
              rows={3}
              value={callerReport}
              onChange={(e) => setCallerReport(e.target.value)}
              placeholder="Describe caller observations, reported hazards, entrapment, smoke color..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Initial Units to Alert</label>
              <input
                type="text"
                value={initialUnits}
                onChange={(e) => setInitialUnits(e.target.value)}
                placeholder="e.g. Engine 1, Medic 2"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Incident Commander</label>
              <input
                type="text"
                value={commander}
                onChange={(e) => setCommander(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
            >
              Cancel
            </button>

            {/* Primary Action Button via ShinyButton */}
            <ShinyButton
              type="submit"
              fillColor="#0f172a"
              labelColor="#ffffff"
              accentColor="#ff6b4a"
              accentSoftColor="#ffb199"
              className="py-2 px-5 text-xs shadow-md"
            >
              <Send className="h-4 w-4" />
              <span>Dispatch Incident</span>
            </ShinyButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIncidentModal;
