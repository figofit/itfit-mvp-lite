export type WorkoutTemplate = "A" | "B";

export type Settings = {
  stepsGoal: number;
  mobilityGoalMin: number;
  workoutsGoalPerWeek: number;
  /**
   * Workout days in JS getDay format, but stored as:
   * Po=1, Út=2, St=3, Čt=4, Pá=5, So=6, Ne=0.
   */
  workoutDays: number[];
};

export type DailyLog = {
  steps: number;
  mobilityDone: boolean;
  mobilityMin: number;
  notes?: string;
};

export type ExerciseLog = {
  exerciseKey: string;
  weight?: number;
  reps?: number;
  sets?: number;
  rpe?: number;
  notes?: string;
};

export type WorkoutLog = {
  id: string;
  date: string;
  template: WorkoutTemplate;
  durationMin?: number;
  notes?: string;
  exercises: ExerciseLog[];
};

export type StoredData = {
  settings: Settings;
  dailyLogs: Record<string, DailyLog>;
  workoutLogs: WorkoutLog[];
  meta: {
    version: number;
    updatedAt: string;
  };
};

const STORAGE_KEY = "itfit:v1";
const LEGACY_SETTINGS_KEY = "itfit_settings";
const LEGACY_LOG_KEY = "itfit_log";

export const defaultSettings: Settings = {
  stepsGoal: 10000,
  mobilityGoalMin: 10,
  workoutsGoalPerWeek: 3,
  workoutDays: [1, 3, 5]
};

const defaultData: StoredData = {
  settings: defaultSettings,
  dailyLogs: {},
  workoutLogs: [],
  meta: {
    version: 1,
    updatedAt: new Date().toISOString()
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseDateFromLegacy = (date: string): string => {
  if (date.includes(".")) {
    const parts = date.split(".").map((part) => part.trim());
    if (parts.length >= 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }
  return date;
};

export const formatDate = (value: Date): string =>
  value.toLocaleDateString("sv-SE");

export const getTodayKey = () => formatDate(new Date());

const buildMeta = (): StoredData["meta"] => ({
  version: 1,
  updatedAt: new Date().toISOString()
});

const normalizeData = (data: StoredData): StoredData => ({
  settings: { ...defaultSettings, ...data.settings },
  dailyLogs: data.dailyLogs ?? {},
  workoutLogs: data.workoutLogs ?? [],
  meta: data.meta ?? buildMeta()
});

const isValidStoredData = (data: unknown): data is StoredData => {
  if (!isRecord(data)) return false;
  if (!isRecord(data.settings)) return false;
  if (!isRecord(data.dailyLogs)) return false;
  if (!Array.isArray(data.workoutLogs)) return false;
  return true;
};

const migrateLegacyData = (): StoredData | null => {
  if (typeof window === "undefined") return null;
  const legacySettingsRaw = window.localStorage.getItem(LEGACY_SETTINGS_KEY);
  const legacyLogRaw = window.localStorage.getItem(LEGACY_LOG_KEY);
  if (!legacySettingsRaw && !legacyLogRaw) return null;

  let legacySettings: Partial<Settings> = {};
  if (legacySettingsRaw) {
    try {
      const parsed = JSON.parse(legacySettingsRaw) as {
        stepsGoal?: number;
        workoutWeeklyGoal?: number;
        mobilityMinutes?: number;
      };
      legacySettings = {
        stepsGoal: parsed.stepsGoal ?? defaultSettings.stepsGoal,
        workoutsGoalPerWeek:
          parsed.workoutWeeklyGoal ?? defaultSettings.workoutsGoalPerWeek,
        mobilityGoalMin: parsed.mobilityMinutes ?? defaultSettings.mobilityGoalMin,
        workoutDays: defaultSettings.workoutDays
      };
    } catch {
      legacySettings = {};
    }
  }

  const dailyLogs: Record<string, DailyLog> = {};
  const workoutLogs: WorkoutLog[] = [];

  if (legacyLogRaw) {
    try {
      const parsed = JSON.parse(legacyLogRaw) as Array<{
        date: string;
        mobilityDone: boolean;
        workoutDone: boolean;
        workoutType: WorkoutTemplate;
        steps: number;
      }>;
      parsed.forEach((entry) => {
        const date = parseDateFromLegacy(entry.date);
        dailyLogs[date] = {
          steps: entry.steps ?? 0,
          mobilityDone: entry.mobilityDone ?? false,
          mobilityMin: entry.mobilityDone
            ? legacySettings.mobilityGoalMin ?? defaultSettings.mobilityGoalMin
            : 0
        };
        if (entry.workoutDone) {
          workoutLogs.push({
            id: `legacy-${date}-${entry.workoutType}`,
            date,
            template: entry.workoutType ?? "A",
            exercises: []
          });
        }
      });
    } catch {
      return null;
    }
  }

  const migrated: StoredData = normalizeData({
    settings: { ...defaultSettings, ...legacySettings },
    dailyLogs,
    workoutLogs,
    meta: buildMeta()
  });

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
  window.localStorage.removeItem(LEGACY_SETTINGS_KEY);
  window.localStorage.removeItem(LEGACY_LOG_KEY);
  return migrated;
};

export const readData = (): StoredData => {
  if (typeof window === "undefined") return defaultData;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const migrated = migrateLegacyData();
    return migrated ?? defaultData;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!isValidStoredData(parsed)) return defaultData;
    return normalizeData(parsed as StoredData);
  } catch {
    return defaultData;
  }
};

export const writeData = (data: StoredData) => {
  if (typeof window === "undefined") return;
  const payload = { ...data, meta: buildMeta() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const updateData = (updater: (data: StoredData) => StoredData) => {
  const current = readData();
  const updated = updater(current);
  writeData(updated);
  return updated;
};

export const updateDailyLog = (date: string, update: Partial<DailyLog>) =>
  updateData((data) => {
    const existing = data.dailyLogs[date] ?? {
      steps: 0,
      mobilityDone: false,
      mobilityMin: 0
    };
    return {
      ...data,
      dailyLogs: {
        ...data.dailyLogs,
        [date]: {
          ...existing,
          ...update
        }
      }
    };
  });

export const appendWorkoutLog = (log: WorkoutLog) =>
  updateData((data) => ({
    ...data,
    workoutLogs: [log, ...data.workoutLogs]
  }));

export const getLastWorkoutLog = (
  template: WorkoutTemplate,
  logs: WorkoutLog[]
): WorkoutLog | undefined => logs.find((log) => log.template === template);

export const getLastWorkoutTemplate = (logs: WorkoutLog[]): WorkoutTemplate => {
  if (logs.length === 0) return "A";
  return logs[0].template === "A" ? "B" : "A";
};

export const resetDailyLogs = () =>
  updateData((data) => ({
    ...data,
    dailyLogs: {}
  }));

export const resetWorkoutLogs = () =>
  updateData((data) => ({
    ...data,
    workoutLogs: []
  }));

export const resetAllData = () => writeData(defaultData);

export const exportData = (): string => JSON.stringify(readData(), null, 2);

export const importData = (payload: unknown): StoredData | null => {
  if (!isValidStoredData(payload)) return null;
  const normalized = normalizeData(payload as StoredData);
  writeData(normalized);
  return normalized;
};

export const getStorageKey = () => STORAGE_KEY;
