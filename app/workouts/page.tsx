const workouts = {
  A: [
    {
      name: "Dřep",
      detail: "3 série × 8–10 opakování",
      tip: "Kontroluj hloubku a rovná záda."
    },
    {
      name: "Kliky",
      detail: "3 série × 8–12 opakování",
      tip: "Lokty lehce od těla, pevný střed."
    },
    {
      name: "Plank",
      detail: "3 série × 30–45 s",
      tip: "Netlač boky dolů, drž neutrální pozici."
    }
  ],
  B: [
    {
      name: "Výpady",
      detail: "3 série × 8 opakování na nohu",
      tip: "Koleno drž nad kotníkem."
    },
    {
      name: "Přítahy s gumou",
      detail: "3 série × 10–12 opakování",
      tip: "Lopatky stáhni k sobě."
    },
    {
      name: "Most",
      detail: "3 série × 12 opakování",
      tip: "Zapojuj hýždě, neprohýbej bedra."
    }
  ]
};

export default function WorkoutsPage() {
  return (
    <section className="space-y-6">
      {(["A", "B"] as const).map((type) => (
        <div key={type} className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Trénink {type}</h2>
          <div className="space-y-3">
            {workouts[type].map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-slate-100 p-3"
              >
                <div className="text-sm font-semibold">{item.name}</div>
                <div className="text-xs text-slate-500">{item.detail}</div>
                <div className="text-xs text-slate-400">{item.tip}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
