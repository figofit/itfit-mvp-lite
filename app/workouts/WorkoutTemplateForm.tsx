"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  appendWorkoutLog,
  formatDate,
  getLastWorkoutLog,
  getTodayKey,
  readData,
  updateDailyLog,
  WorkoutTemplate
} from "../../src/lib/storage";
import { workoutTemplates } from "./data";

type ExerciseFormState = {
  weight: string;
  reps: string;
  sets: string;
  notes: string;
};

type Props = {
  template: WorkoutTemplate;
};

const toNumber = (value: string) =>
  value.trim() === "" ? undefined : Number(value);

const buildInitialState = () => ({
  weight: "",
  reps: "",
  sets: "",
  notes: ""
});

export default function WorkoutTemplateForm({ template }: Props) {
  const router = useRouter();
  const [data] = useState(() => readData());
  const lastLog = useMemo(
    () => getLastWorkoutLog(template, data.workoutLogs),
    [data.workoutLogs, template]
  );
  const [formState, setFormState] = useState<Record<string, ExerciseFormState>>(() => {
    const initial: Record<string, ExerciseFormState> = {};
    workoutTemplates[template].forEach((exercise) => {
      initial[exercise.key] = buildInitialState();
    });
    return initial;
  });


  const handleInputChange = (
    key: string,
    field: keyof ExerciseFormState,
    value: string
  ) => {
    setFormState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  const handlePrefill = (key: string, field: "reps" | "weight", add: number) => {
    const last = lastLog?.exercises.find((exercise) => exercise.exerciseKey === key);
    if (!last) return;
    const current = field === "reps" ? last.reps : last.weight;
    if (typeof current !== "number") return;
    handleInputChange(key, field, String(current + add));
  };

  const handleSubmit = () => {
    const today = getTodayKey();
    const exercises = workoutTemplates[template].map((exercise) => {
      const state = formState[exercise.key];
      return {
        exerciseKey: exercise.key,
        weight: toNumber(state.weight),
        reps: toNumber(state.reps),
        sets: toNumber(state.sets),
        notes: state.notes.trim() || undefined
      };
    });

    appendWorkoutLog({
      id: `${template}-${Date.now()}`,
      date: today,
      template,
      exercises
    });

    updateDailyLog(today, {});

    router.push(`/?saved=${template}`);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Trénink {template}</h2>
        <p className="text-xs text-slate-500">
          Poslední záznam: {lastLog ? formatDate(new Date(lastLog.date)) : "bez záznamu"}
        </p>
      </div>

      {workoutTemplates[template].map((exercise) => {
        const last = lastLog?.exercises.find((item) => item.exerciseKey === exercise.key);
        const lastText = last
          ? `${last.weight ?? "?"} kg · ${last.reps ?? "?"} reps · ${last.sets ?? "?"} sety`
          : "Zatím žádný záznam";
        const state = formState[exercise.key];

        return (
          <div key={exercise.key} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold">{exercise.name}</div>
            <div className="text-xs text-slate-500">{exercise.detail}</div>
            <div className="text-xs text-slate-400">{exercise.tip}</div>
            <div className="mt-2 rounded-xl bg-slate-50 p-2 text-xs text-slate-500">
              Posledně: {lastText}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <input
                type="number"
                inputMode="decimal"
                placeholder="kg"
                value={state.weight}
                onChange={(event) =>
                  handleInputChange(exercise.key, "weight", event.target.value)
                }
                className="rounded-xl border border-slate-200 px-2 py-2 text-sm"
              />
              <input
                type="number"
                inputMode="numeric"
                placeholder="reps"
                value={state.reps}
                onChange={(event) =>
                  handleInputChange(exercise.key, "reps", event.target.value)
                }
                className="rounded-xl border border-slate-200 px-2 py-2 text-sm"
              />
              <input
                type="number"
                inputMode="numeric"
                placeholder="sety"
                value={state.sets}
                onChange={(event) =>
                  handleInputChange(exercise.key, "sets", event.target.value)
                }
                className="rounded-xl border border-slate-200 px-2 py-2 text-sm"
              />
            </div>
            <textarea
              placeholder="Poznámka"
              value={state.notes}
              onChange={(event) =>
                handleInputChange(exercise.key, "notes", event.target.value)
              }
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => handlePrefill(exercise.key, "reps", 1)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
              >
                +1 rep
              </button>
              <button
                type="button"
                onClick={() => handlePrefill(exercise.key, "weight", 2.5)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
              >
                +2.5 kg
              </button>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white"
      >
        Uložit trénink {template}
      </button>
    </section>
  );
}
