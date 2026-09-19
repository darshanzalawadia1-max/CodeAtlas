"use client";

import React from "react";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { RESOURCE_AVAILABILITY_STATS } from "@/lib/mock-data";

interface ResourceAvailabilityCardProps {
  onViewAllResources?: () => void;
}

export const ResourceAvailabilityCard: React.FC<ResourceAvailabilityCardProps> = ({
  onViewAllResources,
}) => {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white/85 backdrop-blur-md p-4 shadow-xs text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Resource Fleet Availability</h3>
          <p className="text-xs text-slate-500">Live operational capacity across District 01</p>
        </div>
        {onViewAllResources && (
          <button
            onClick={onViewAllResources}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
          >
            <span>Manage Fleet</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-3.5">
        {RESOURCE_AVAILABILITY_STATS.map((stat, idx) => {
          const pct = Math.round((stat.available / stat.total) * 100);

          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <span>{stat.category}</span>
                  {stat.warning && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      <AlertTriangle className="h-3 w-3" />
                      Constrained
                    </span>
                  )}
                </div>
                <div className="font-mono text-xs">
                  <span className="font-bold text-slate-900">{stat.available}</span>
                  <span className="text-slate-400"> / {stat.total} available</span>
                  <span className="ml-2 font-semibold text-indigo-600">({pct}%)</span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    stat.warning ? "bg-amber-500" : stat.color
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-500">{stat.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceAvailabilityCard;
