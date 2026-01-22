export const workoutTemplates = {
  A: [
    {
      key: "squat",
      name: "Dřep",
      detail: "3 série × 8–10 opakování",
      tip: "Kontroluj hloubku a rovná záda."
    },
    {
      key: "pushup",
      name: "Kliky",
      detail: "3 série × 8–12 opakování",
      tip: "Lokty lehce od těla, pevný střed."
    },
    {
      key: "plank",
      name: "Plank",
      detail: "3 série × 30–45 s",
      tip: "Netlač boky dolů, drž neutrální pozici."
    }
  ],
  B: [
    {
      key: "lunge",
      name: "Výpady",
      detail: "3 série × 8 opakování na nohu",
      tip: "Koleno drž nad kotníkem."
    },
    {
      key: "row",
      name: "Přítahy s gumou",
      detail: "3 série × 10–12 opakování",
      tip: "Lopatky stáhni k sobě."
    },
    {
      key: "bridge",
      name: "Most",
      detail: "3 série × 12 opakování",
      tip: "Zapojuj hýždě, neprohýbej bedra."
    }
  ]
};

export type WorkoutTemplateKey = keyof typeof workoutTemplates;
