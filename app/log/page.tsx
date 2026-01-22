"use client";

import { useMemo, useState } from "react";
import { formatDate, readData } from "../../src/lib/storage";

const ranges = [
  { label: "7 dní", value: 7 },
  { label: "30 dní", value: 30 }
];

export default function LogPage() {
  const [range, setRange] = useState(7);
  const [workoutsOnly, setWorkoutsOnly] = useState(false);
  const data = readData();

  const filteredDates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: range }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() - index);
      return formatDate(day);
    });
  }, [range]);

  const rows = filteredDates
    .map((date) => {
      const daily = data.dailyLogs[date];
      const workout = data.workoutLogs.find((log) => log.date === date);
      return {
        date,
        steps: daily?.steps ?? 0,
        mobilityDone: daily?.mobilityDone ?? false,
        mobilityMin: daily?.mobilityMin ?? 0,
        workoutTemplate: workout?.template
      };
    })
    .filter((row) => (workoutsOnly ? Boolean(row.workoutTemplate) : true));

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Historie</h2>
        <p className="text-xs text-slate-500">Přehled po dnech</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ranges.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setRange(item.value)}
              className={`rounded-xl border px-3 py-1 text-xs font-semibold ${
                range === item.value
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setWorkoutsOnly((prev) => !prev)}
            className={`rounded-xl border px-3 py-1 text-xs font-semibold ${
              workoutsOnly
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-slate-200 text-slate-600"
            }`}
          >
            Pouze tréninky
          </button>
        </div>
      </div>
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
          Zatím žádná data.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.date}
              className="rounded-2xl bg-white p-4 text-sm shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">{row.date}</div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    row.mobilityDone && row.steps
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {row.mobilityDone ? "Mobilita" : "Bez mobility"}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                <span>Kroky: {row.steps}</span>
                <span>Mobilita: {row.mobilityMin} min</span>
                <span>
                  Trénink: {row.workoutTemplate ? row.workoutTemplate : "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
