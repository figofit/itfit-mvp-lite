"use client";

import { useEffect, useState } from "react";
import { LogEntry, readLog } from "../lib/storage";

export default function LogPage() {
  const [log, setLog] = useState<LogEntry[]>([]);

  useEffect(() => {
    setLog(readLog());
  }, []);

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Historie</h2>
        <p className="text-xs text-slate-500">Uložené dny z LocalStorage</p>
      </div>
      {log.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
          Zatím žádná data.
        </div>
      ) : (
        <div className="space-y-3">
          {log.map((item) => (
            <div
              key={item.date}
              className="rounded-2xl bg-white p-4 text-sm shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">{item.date}</div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    item.workoutDone && item.mobilityDone
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.workoutDone && item.mobilityDone
                    ? "Splněno"
                    : "Rozdělané"}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                <span>Mobilita: {item.mobilityDone ? "Ano" : "Ne"}</span>
                <span>Trénink {item.workoutType}</span>
                <span>Kroky: {item.steps}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
