"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  defaultSettings,
  exportData,
  getStorageKey,
  importData,
  readData,
  resetAllData,
  resetDailyLogs,
  resetWorkoutLogs,
  writeData
} from "../../src/lib/storage";

const days = [
  { label: "Po", value: 1 },
  { label: "Út", value: 2 },
  { label: "St", value: 3 },
  { label: "Čt", value: 4 },
  { label: "Pá", value: 5 },
  { label: "So", value: 6 },
  { label: "Ne", value: 0 }
];

const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const stored = readData();
    setSettings(stored.settings);
  }, []);

  const handleSave = (nextSettings: typeof settings) => {
    const data = readData();
    writeData({ ...data, settings: nextSettings });
    setSettings(nextSettings);
  };

  const toggleWorkoutDay = (value: number) => {
    const exists = settings.workoutDays.includes(value);
    const updated = exists
      ? settings.workoutDays.filter((day) => day !== value)
      : [...settings.workoutDays, value];
    handleSave({ ...settings, workoutDays: updated });
  };

  const handleExportJson = () => {
    downloadFile(exportData(), "itfit-backup.json", "application/json");
  };

  const handleExportCsv = () => {
    const data = readData();
    const dailyRows = [
      "date,steps,mobilityDone,mobilityMin",
      ...Object.entries(data.dailyLogs).map(
        ([date, log]) =>
          `${date},${log.steps},${log.mobilityDone},${log.mobilityMin}`
      )
    ].join("\n");
    downloadFile(dailyRows, "itfit-daily-logs.csv", "text/csv");

    const workoutRows = [
      "date,template,exerciseKey,weight,reps,sets",
      ...data.workoutLogs.flatMap((log) =>
        log.exercises.map(
          (exercise) =>
            `${log.date},${log.template},${exercise.exerciseKey},${exercise.weight ?? ""},${exercise.reps ?? ""},${exercise.sets ?? ""}`
        )
      )
    ].join("\n");
    downloadFile(workoutRows, "itfit-workout-logs.csv", "text/csv");
  };

  const handleImportJson = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed?.settings || !parsed?.dailyLogs || !parsed?.workoutLogs) {
          setStatus("Neplatný soubor.");
          return;
        }
        const confirmed = window.confirm("Přepsat současná data?");
        if (!confirmed) return;
        const imported = importData(parsed);
        if (!imported) {
          setStatus("Neplatná struktura dat.");
          return;
        }
        setSettings(imported.settings);
        setStatus("Import hotový.");
      } catch {
        setStatus("Neplatný JSON.");
      }
    };
    reader.readAsText(file);
  };

  const handleResetDaily = () => {
    if (!window.confirm("Resetovat denní logy?")) return;
    resetDailyLogs();
    setStatus("Denní logy resetovány.");
  };

  const handleResetWorkouts = () => {
    if (!window.confirm("Resetovat tréninky?")) return;
    resetWorkoutLogs();
    setStatus("Tréninky resetovány.");
  };

  const handleResetAll = () => {
    if (!window.confirm("Resetovat všechna data?")) return;
    resetAllData();
    setSettings(defaultSettings);
    setStatus("Vše resetováno.");
  };

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
                  onClick={() => handleSave({ ...settings, stepsGoal: goal })}
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
          <div>
            <label className="text-xs font-semibold text-slate-500">Mobilita</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[10, 15].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => handleSave({ ...settings, mobilityGoalMin: goal })}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                    settings.mobilityGoalMin === goal
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  {goal} min
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <div className="text-xs font-semibold text-slate-500">Tréninky týdně</div>
            <div className="mt-1 text-lg font-semibold text-slate-800">
              {settings.workoutsGoalPerWeek}
            </div>
            <div className="text-xs text-slate-400">Doporučení: 3 týdně</div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Tréninkové dny</label>
            <div className="mt-2 grid grid-cols-7 gap-2">
              {days.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleWorkoutDay(day.value)}
                  className={`rounded-xl border px-2 py-2 text-xs font-semibold ${
                    settings.workoutDays.includes(day.value)
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Uloženo jako Po=1, Út=2, …, Ne=0.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Zálohy</h2>
        <p className="text-xs text-slate-500">LocalStorage klíč: {getStorageKey()}</p>
        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={handleExportJson}
            className="w-full rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-700"
          >
            Stáhnout zálohu (JSON)
          </button>
          <label className="flex w-full cursor-pointer items-center justify-center rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-700">
            Import JSON
            <input type="file" accept="application/json" onChange={handleImportJson} className="hidden" />
          </label>
          <button
            type="button"
            onClick={handleExportCsv}
            className="w-full rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-700"
          >
            Export CSV
          </button>
        </div>
        {status ? <p className="mt-2 text-xs text-slate-500">{status}</p> : null}
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Reset</h2>
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleResetDaily}
            className="w-full rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-700"
          >
            Reset denních logů
          </button>
          <button
            type="button"
            onClick={handleResetWorkouts}
            className="w-full rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-700"
          >
            Reset tréninků
          </button>
          <button
            type="button"
            onClick={handleResetAll}
            className="w-full rounded-xl border border-red-200 py-2 text-sm font-semibold text-red-600"
          >
            Reset všeho
          </button>
        </div>
      </div>
    </section>
  );
}
