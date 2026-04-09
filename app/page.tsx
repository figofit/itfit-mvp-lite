const achievements = [
  {
    year: "2012",
    title: "Postup do krajského přeboru",
    detail:
      "Historicky první postup z okresního přeboru po sérii 11 výher v řadě."
  },
  {
    year: "2018",
    title: "Vítěz okresního poháru",
    detail:
      "Finále před domácím publikem, výhra 3:1 a první velká trofej novodobé éry klubu."
  },
  {
    year: "2023",
    title: "Nejlepší obrana soutěže",
    detail:
      "Pouze 18 inkasovaných gólů za celou sezonu a nejdelší série bez obdržené branky."
  }
];

const leagueHistory = [
  {
    season: "2023/24",
    league: "Krajský přebor",
    position: "5.",
    record: "14V / 6R / 10P",
    points: 48
  },
  {
    season: "2022/23",
    league: "Krajský přebor",
    position: "7.",
    record: "12V / 8R / 10P",
    points: 44
  },
  {
    season: "2021/22",
    league: "I.A třída",
    position: "2.",
    record: "19V / 5R / 2P",
    points: 62
  }
];

const squad = {
  goalkeepers: ["Lukáš Novák", "Matěj Sláma"],
  defenders: ["Ondřej Beneš", "Milan Růžička", "Tomáš Bartoš", "Petr Havel"],
  midfielders: ["Jakub Kolář", "David Pospíšil", "Adam Špaček", "Daniel Maršík"],
  attackers: ["Filip Šimek", "Martin Krajčík", "Štěpán Vondra"]
};

const gallery = [
  {
    src: "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=900&q=80",
    alt: "Týmová fotka před zápasem"
  },
  {
    src: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=900&q=80",
    alt: "Domácí stadion během zápasu"
  },
  {
    src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=80",
    alt: "Oslava gólu s fanoušky"
  }
];

export default function TeamMiniWebPage() {
  return (
    <section className="space-y-6 pb-6">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-900 p-6 text-white shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">Oficiální klubový web</p>
        <h2 className="mt-2 text-3xl font-bold">TJ Sokol Dolní Lhota</h2>
        <p className="mt-3 text-sm text-emerald-100">
          Mini web máme postavený jako <strong>jednu přehlednou stránku</strong> s možností
          budoucího větvení na podstránky (historie, hráči, galerie, kontakt).
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <a href="#uspechy" className="rounded-full bg-white/15 px-3 py-1">
            Úspěchy
          </a>
          <a href="#historie" className="rounded-full bg-white/15 px-3 py-1">
            Ligová historie
          </a>
          <a href="#kadr" className="rounded-full bg-white/15 px-3 py-1">
            Kádr
          </a>
          <a href="#galerie" className="rounded-full bg-white/15 px-3 py-1">
            Fotky
          </a>
        </div>
      </div>

      <div id="uspechy" className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold">Největší úspěchy</h3>
        <div className="mt-3 grid gap-3">
          {achievements.map((item) => (
            <article key={item.year} className="rounded-xl border border-slate-200 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                {item.year}
              </div>
              <h4 className="mt-1 font-semibold">{item.title}</h4>
              <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>

      <div id="historie" className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold">Ligová historie (accordion)</h3>
        <p className="mt-1 text-sm text-slate-500">
          Připravené stejně jako na původním webu – každá sezona je samostatně rozbalitelná.
        </p>
        <div className="mt-3 space-y-2">
          {leagueHistory.map((season) => (
            <details key={season.season} className="group rounded-xl border border-slate-200 p-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <span className="font-medium">{season.season}</span>
                <span className="text-xs text-slate-500 group-open:hidden">Zobrazit</span>
                <span className="hidden text-xs text-slate-500 group-open:inline">Skrýt</span>
              </summary>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-700">
                <div>
                  <span className="text-slate-500">Soutěž:</span> {season.league}
                </div>
                <div>
                  <span className="text-slate-500">Umístění:</span> {season.position}
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Bilance:</span> {season.record}
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Body:</span> {season.points}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>

      <div id="kadr" className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold">Soupiska</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-3">
            <h4 className="font-semibold">Brankáři</h4>
            <p className="mt-1 text-slate-600">{squad.goalkeepers.join(", ")}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <h4 className="font-semibold">Obránci</h4>
            <p className="mt-1 text-slate-600">{squad.defenders.join(", ")}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <h4 className="font-semibold">Záložníci</h4>
            <p className="mt-1 text-slate-600">{squad.midfielders.join(", ")}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <h4 className="font-semibold">Útočníci</h4>
            <p className="mt-1 text-slate-600">{squad.attackers.join(", ")}</p>
          </div>
        </div>
      </div>

      <div id="galerie" className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold">Fotogalerie</h3>
        <div className="mt-3 grid grid-cols-1 gap-3">
          {gallery.map((item) => (
            <figure key={item.src} className="overflow-hidden rounded-xl bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} className="h-40 w-full object-cover" />
              <figcaption className="p-2 text-xs text-slate-600">{item.alt}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
