"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  DailyLog,
  defaultSettings,
  formatDate,
  getLastWorkoutTemplate,
  getTodayKey,
  readData,
  updateDailyLog,
  WorkoutTemplate
} from "../src/lib/storage";

const weekdayLabels = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];

const getWeekStart = (date: Date) => {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const start = new Date(date);
  start.setDate(date.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

const getWeekDates = (base: Date) => {
  const start = getWeekStart(base);
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
};

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const savedParam = searchParams.get("saved");
  const [data, setData] = useState(() => readData());
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    defaultSettings.mobilityGoalMin * 60
  );
  const [stepsInput, setStepsInput] = useState("");
  const todayKey = getTodayKey();

  useEffect(() => {
    const latest = readData();
    setData(latest);
    setSecondsLeft(latest.settings.mobilityGoalMin * 60);
  }, []);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          const updated = updateDailyLog(todayKey, {
            mobilityDone: true,
            mobilityMin: data.settings.mobilityGoalMin
          });
          setData(updated);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning, todayKey, data.settings.mobilityGoalMin]);

  const weekDates = useMemo(() => getWeekDates(new Date()), []);

  const weekStats = useMemo(() => {
    let mobilityCount = 0;
    let stepsCount = 0;
    let workoutsCount = 0;
    const dateKeys = weekDates.map((date) => formatDate(date));
    dateKeys.forEach((key) => {
      const log = data.dailyLogs[key];
      if (log?.mobilityDone) mobilityCount += 1;
      if (log?.steps && log.steps >= data.settings.stepsGoal) stepsCount += 1;
    });
    workoutsCount = data.workoutLogs.filter((log) =>
      dateKeys.includes(log.date)
    ).length;
    return { mobilityCount, stepsCount, workoutsCount };
  }, [data.dailyLogs, data.settings.stepsGoal, data.workoutLogs, weekDates]);

  const computeStreak = (predicate: (log: DailyLog | undefined) => boolean) => {
    let streak = 0;
    const cursor = new Date();
    while (true) {
      const key = formatDate(cursor);
      if (!predicate(data.dailyLogs[key])) break;
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  };

  const mobilityStreak = useMemo(
    () => computeStreak((log) => Boolean(log?.mobilityDone)),
    [data.dailyLogs]
  );

  const stepsStreak = useMemo(
    () =>
      computeStreak(
        (log) => Boolean(log?.steps && log.steps >= data.settings.stepsGoal)
      ),
    [data.dailyLogs, data.settings.stepsGoal]
  );

  const todayWorkout = useMemo(() => {
    const today = new Date().getDay();
    if (!data.settings.workoutDays.includes(today)) return null;
    return getLastWorkoutTemplate(data.workoutLogs);
  }, [data.settings.workoutDays, data.workoutLogs]);

  const quickWorkoutTarget: WorkoutTemplate = todayWorkout ?? "A";

  const handleStepsQuickSave = () => {
    const steps = Number(stepsInput || 0);
    const updated = updateDailyLog(todayKey, { steps });
    setData(updated);
    setStepsInput("");
  };

  const handleMobilityDone = () => {
    const updated = updateDailyLog(todayKey, {
      mobilityDone: true,
      mobilityMin: data.settings.mobilityGoalMin
    });
    setData(updated);
    setTimerRunning(false);
    setSecondsLeft(data.settings.mobilityGoalMin * 60);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setSecondsLeft(data.settings.mobilityGoalMin * 60);
  };

  const todayLog = data.dailyLogs[todayKey];

  return (
    <section className="space-y-6">
      {savedParam ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          Trénink {savedParam} uložen.
        </div>
      ) : null}

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-slate-400">Tento týden</p>
            <h2 className="text-lg font-semibold">Skóre</h2>
          </div>
          <div className="text-xs text-slate-500">
            {formatDate(weekDates[0])}–{formatDate(weekDates[6])}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="text-lg font-semibold">
              {weekStats.workoutsCount}/{data.settings.workoutsGoalPerWeek}
            </div>
            <div className="text-xs text-slate-500">Tréninky</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="text-lg font-semibold">{weekStats.mobilityCount}/7</div>
            <div className="text-xs text-slate-500">Mobilita</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="text-lg font-semibold">{weekStats.stepsCount}/7</div>
            <div className="text-xs text-slate-500">Kroky</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="text-xs text-slate-400">Streak</div>
          <div className="text-lg font-semibold">Mobilita</div>
          <div className="mt-2 text-2xl font-semibold">{mobilityStreak} dní</div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="text-xs text-slate-400">Streak</div>
          <div className="text-lg font-semibold">Kroky</div>
          <div className="mt-2 text-2xl font-semibold">{stepsStreak} dní</div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Dnes</h2>
          <span className="text-xs text-slate-500">
            {weekdayLabels[new Date().getDay()]}
          </span>
        </div>
        <div className="mt-3 rounded-xl border border-slate-100 p-3 text-sm">
          {todayWorkout ? (
            <span>
              Dnes je trénink <strong>{todayWorkout}</strong>
            </span>
          ) : (
            "Dnes volno"
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Rychlé akce</h2>
        <div className="mt-3 grid gap-2">
          <button
            type="button"
            onClick={handleMobilityDone}
            className="rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-700"
          >
            Mobilita hotovo ({data.settings.mobilityGoalMin} min)
          </button>
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="numeric"
              value={stepsInput}
              onChange={(event) => setStepsInput(event.target.value)}
              placeholder="Zapsat kroky"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={handleStepsQuickSave}
              className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
            >
              Uložit
            </button>
          </div>
          <button
            type="button"
            onClick={() => setTimerRunning((prev) => !prev)}
            className="rounded-xl bg-emerald-500 py-2 text-sm font-semibold text-white"
          >
            {timerRunning
              ? `Pauza ${formatTime(secondsLeft)}`
              : `Spustit mobilitu ${data.settings.mobilityGoalMin}:00`}
          </button>
          <button
            type="button"
            onClick={resetTimer}
            className="rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-700"
          >
            Reset timeru
          </button>
          <Link
            href={`/workouts/${quickWorkoutTarget.toLowerCase()}`}
            className="rounded-xl bg-slate-900 py-2 text-center text-sm font-semibold text-white"
          >
            Zalogovat trénink {quickWorkoutTarget}
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Mobilita</h2>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              todayLog?.mobilityDone
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {todayLog?.mobilityDone ? "Hotovo" : "Čeká"}
          </span>
        </div>
        <div className="text-sm text-slate-500">
          {todayLog?.mobilityMin ?? 0} / {data.settings.mobilityGoalMin} min
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Kroky</h2>
          <span className="text-xs text-slate-500">Cíl {data.settings.stepsGoal}</span>
        </div>
        <div className="text-2xl font-semibold">{todayLog?.steps ?? 0}</div>
      </div>
    </section>
  );
}
