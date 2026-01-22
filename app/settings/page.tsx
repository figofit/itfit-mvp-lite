"use client";

import { useEffect, useState } from "react";
import { defaultSettings, readSettings, saveSettings, Settings } from "../lib/storage";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    setSettings(readSettings());
  }, []);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Cíle</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500">Kroky</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[10000, 15000].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setSettings((prev) => ({ ...prev, stepsGoal: goal }))}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                    settings.stepsGoal === goal
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  {goal.toLocaleString("cs-CZ")}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <div className="text-xs font-semibold text-slate-500">Tréninky týdně</div>
            <div className="mt-1 text-lg font-semibold text-slate-800">
              {settings.workoutWeeklyGoal}
            </div>
            <div className="text-xs text-slate-400">Doporučení: 3 týdně</div>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <div className="text-xs font-semibold text-slate-500">Mobilita</div>
            <div className="mt-1 text-lg font-semibold text-slate-800">
              {settings.mobilityMinutes} min
            </div>
            <div className="text-xs text-slate-400">Doporučení: 10 min</div>
          </div>
        </div>
      </div>
    </section>
  );
}
