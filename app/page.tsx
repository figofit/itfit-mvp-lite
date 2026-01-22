"use client";

import { useEffect, useMemo, useState } from "react";
import {
  defaultSettings,
  getEntryForDate,
  getTodayKey,
  LogEntry,
  readSettings,
  saveSettings,
  upsertLogEntry
} from "./lib/storage";

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function DashboardPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [entry, setEntry] = useState<LogEntry>(() =>
    getEntryForDate(getTodayKey())
  );
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    defaultSettings.mobilityMinutes * 60
  );

  useEffect(() => {
    const storedSettings = readSettings();
    const todayKey = getTodayKey();
    const todayEntry = getEntryForDate(todayKey);
    setSettings(storedSettings);
    setEntry(todayEntry);
    setSecondsLeft(storedSettings.mobilityMinutes * 60);
  }, []);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          const updated = { ...entry, mobilityDone: true };
          setEntry(updated);
          upsertLogEntry(updated);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning, entry]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    upsertLogEntry(entry);
  }, [entry]);

  const progress = useMemo(() => {
    return Math.min(100, Math.round((entry.steps / settings.stepsGoal) * 100));
  }, [entry.steps, settings.stepsGoal]);

  const resetTimer = () => {
    setTimerRunning(false);
    setSecondsLeft(settings.mobilityMinutes * 60);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Mobilita {settings.mobilityMinutes} min</h2>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              entry.mobilityDone
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {entry.mobilityDone ? "Hotovo" : "Čeká"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-semibold">{formatTime(secondsLeft)}</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTimerRunning((prev) => !prev)}
              className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
            >
              {timerRunning ? "Pauza" : "Start"}
            </button>
            <button
              type="button"
              onClick={resetTimer}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
            >
              Reset
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            setEntry((prev) => ({ ...prev, mobilityDone: !prev.mobilityDone }))
          }
          className="mt-3 w-full rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-700"
        >
          {entry.mobilityDone ? "Vrátit" : "Hotovo"}
        </button>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Kroky</h2>
          <span className="text-xs text-slate-500">Cíl {settings.stepsGoal}</span>
        </div>
        <div className="mb-3 flex items-center gap-3">
          <input
            type="number"
            inputMode="numeric"
            value={entry.steps}
            onChange={(event) =>
              setEntry((prev) => ({
                ...prev,
                steps: Number(event.target.value || 0)
              }))
            }
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-lg font-semibold"
          />
          <span className="text-sm text-slate-500">/{settings.stepsGoal}</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-emerald-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Trénink dnes</h2>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              entry.workoutDone
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {entry.workoutDone ? "Hotovo" : "Čeká"}
          </span>
        </div>
        <div className="flex gap-2">
          {["A", "B"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                setEntry((prev) => ({
                  ...prev,
                  workoutType: option as "A" | "B"
                }))
              }
              className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold ${
                entry.workoutType === option
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              Trénink {option}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            setEntry((prev) => ({ ...prev, workoutDone: !prev.workoutDone }))
          }
          className="mt-3 w-full rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-700"
        >
          {entry.workoutDone ? "Vrátit" : "Hotovo"}
        </button>
      </div>
    </section>
  );
}
