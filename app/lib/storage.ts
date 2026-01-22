export type WorkoutType = "A" | "B";

export type Settings = {
  stepsGoal: number;
  workoutWeeklyGoal: number;
  mobilityMinutes: number;
};

export type LogEntry = {
  date: string;
  mobilityDone: boolean;
  workoutDone: boolean;
  workoutType: WorkoutType;
  steps: number;
};

const SETTINGS_KEY = "itfit_settings";
const LOG_KEY = "itfit_log";

export const defaultSettings: Settings = {
  stepsGoal: 10000,
  workoutWeeklyGoal: 3,
  mobilityMinutes: 10
};

export const getTodayKey = () =>
  new Date().toLocaleDateString("cs-CZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

export const readSettings = (): Settings => {
  if (typeof window === "undefined") return defaultSettings;
  const raw = window.localStorage.getItem(SETTINGS_KEY);
  if (!raw) return defaultSettings;
  try {
    return { ...defaultSettings, ...JSON.parse(raw) } as Settings;
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = (settings: Settings) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const readLog = (): LogEntry[] => {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(LOG_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as LogEntry[];
  } catch {
    return [];
  }
};

export const saveLog = (log: LogEntry[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOG_KEY, JSON.stringify(log));
};

export const upsertLogEntry = (entry: LogEntry) => {
  const log = readLog();
  const updated = log.filter((item) => item.date !== entry.date);
  updated.unshift(entry);
  saveLog(updated);
};

export const getEntryForDate = (date: string): LogEntry => {
  const log = readLog();
  const existing = log.find((item) => item.date === date);
  if (existing) return existing;
  return {
    date,
    mobilityDone: false,
    workoutDone: false,
    workoutType: "A",
    steps: 0
  };
};
