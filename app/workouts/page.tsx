import Link from "next/link";

const cards = [
  {
    type: "A",
    title: "Trénink A",
    desc: "Základní síla + core"
  },
  {
    type: "B",
    title: "Trénink B",
    desc: "Stabilita + tahové cviky"
  }
];

export default function WorkoutsPage() {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Tréninky</h2>
        <p className="text-xs text-slate-500">Vyber šablonu a zaloguj trénink.</p>
      </div>
      {cards.map((card) => (
        <Link
          key={card.type}
          href={`/workouts/${card.type.toLowerCase()}`}
          className="block rounded-2xl bg-white p-4 shadow-sm"
        >
          <div className="text-sm text-slate-400">Šablona</div>
          <div className="text-lg font-semibold">{card.title}</div>
          <div className="text-xs text-slate-500">{card.desc}</div>
        </Link>
      ))}
    </section>
  );
}
