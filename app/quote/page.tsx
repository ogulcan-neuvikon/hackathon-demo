"use client";

import { useMemo, useState } from "react";

type Coverage = "essential" | "standard" | "premier";

const COVERAGE: Record<Coverage, { label: string; blurb: string; factor: number; limit: string }> = {
  essential: { label: "Essential", blurb: "Liability only, state minimums", factor: 0.72, limit: "$50k / $100k" },
  standard: { label: "Standard", blurb: "Collision + comprehensive", factor: 1, limit: "$250k / $500k" },
  premier: { label: "Premier", blurb: "Full cover, $0 glass, rental car", factor: 1.38, limit: "$1M / $1M" },
};

const VEHICLES = ["Sedan", "SUV / Crossover", "Pickup truck", "Electric vehicle", "Sports / performance"];
const USE_FACTOR: Record<string, number> = {
  Sedan: 1,
  "SUV / Crossover": 1.08,
  "Pickup truck": 1.12,
  "Electric vehicle": 1.15,
  "Sports / performance": 1.44,
};

const ADDONS = [
  { id: "roadside", label: "24/7 roadside assistance", price: 7 },
  { id: "gap", label: "Loan / lease gap cover", price: 12 },
  { id: "injury", label: "Personal injury protection", price: 18 },
  { id: "tech", label: "ADAS sensor & calibration cover", price: 9 },
];

export default function QuotePage() {
  const [zip, setZip] = useState("94107");
  const [age, setAge] = useState(34);
  const [vehicle, setVehicle] = useState(VEHICLES[1]);
  const [year, setYear] = useState(2022);
  const [mileage, setMileage] = useState(12000);
  const [deductible, setDeductible] = useState(500);
  const [coverage, setCoverage] = useState<Coverage>("standard");
  const [addons, setAddons] = useState<string[]>(["roadside"]);
  const [clean, setClean] = useState(true);

  const quote = useMemo(() => {
    const base = 96;
    const ageFactor = age < 25 ? 1.55 : age < 30 ? 1.2 : age > 65 ? 1.1 : 1;
    const mileageFactor = 0.9 + Math.min(mileage, 40000) / 100000;
    const yearFactor = 1 + (year - 2015) * 0.012;
    const deductibleFactor = deductible === 250 ? 1.12 : deductible === 1000 ? 0.86 : 1;
    const recordFactor = clean ? 0.88 : 1.32;
    const addonTotal = ADDONS.filter((a) => addons.includes(a.id)).reduce((s, a) => s + a.price, 0);

    const monthly =
      base *
        ageFactor *
        mileageFactor *
        yearFactor *
        deductibleFactor *
        recordFactor *
        COVERAGE[coverage].factor *
        USE_FACTOR[vehicle] +
      addonTotal;

    const discount = (clean ? 0.08 : 0) + (mileage < 8000 ? 0.05 : 0) + (addons.length >= 3 ? 0.04 : 0);
    const final = monthly * (1 - discount);
    return { monthly: final, annual: final * 11.4, discount, addonTotal };
  }, [age, mileage, year, deductible, clean, coverage, vehicle, addons]);

  const money = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const toggleAddon = (id: string) =>
    setAddons((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <main className="min-h-screen bg-[#f6f5f2] text-[#15201c] antialiased">
      <header className="border-b border-[#15201c]/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#15201c] text-sm font-bold text-[#f6f5f2]">
              N
            </div>
            <span className="text-[15px] font-semibold tracking-tight">Northvale Auto</span>
          </div>
          <nav className="hidden gap-7 text-sm text-[#15201c]/60 sm:flex">
            <span>Coverage</span>
            <span>Claims</span>
            <span>Support</span>
          </nav>
          <span className="rounded-full border border-[#15201c]/15 px-3 py-1.5 text-xs font-medium">
            Demo environment
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2f7d5d]">Step 2 of 3</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-[2.75rem]">Build your auto quote</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#15201c]/65">
            Update any detail below to see your premium change in real time. There's no credit check and no commitment.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="space-y-6">
            <Card title="Driver">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="ZIP code">
                  <input
                    value={zip}
                    onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    inputMode="numeric"
                    className="w-full rounded-xl border border-[#15201c]/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#2f7d5d] focus:ring-2 focus:ring-[#2f7d5d]/20"
                  />
                </Field>
                <Field label={`Age · ${age}`}>
                  <input
                    type="range"
                    min={18}
                    max={80}
                    value={age}
                    onChange={(e) => setAge(+e.target.value)}
                    className="mt-3 w-full accent-[#2f7d5d]"
                  />
                </Field>
              </div>
              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-[#15201c]/10 bg-white p-3.5">
                <input
                  type="checkbox"
                  checked={clean}
                  onChange={(e) => setClean(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#2f7d5d]"
                />
                <span className="text-sm">
                  Clean driving record
                  <span className="block text-[13px] text-[#15201c]/55">
                    No at-fault accidents or violations in 5 years
                  </span>
                </span>
              </label>
            </Card>

            <Card title="Vehicle">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Type">
                  <select
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full rounded-xl border border-[#15201c]/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#2f7d5d]"
                  >
                    {VEHICLES.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Model year">
                  <select
                    value={year}
                    onChange={(e) => setYear(+e.target.value)}
                    className="w-full rounded-xl border border-[#15201c]/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#2f7d5d]"
                  >
                    {Array.from({ length: 16 }, (_, i) => 2026 - i).map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </Field>
                <Field label={`Annual mileage · ${mileage.toLocaleString()} mi`}>
                  <input
                    type="range"
                    min={2000}
                    max={40000}
                    step={1000}
                    value={mileage}
                    onChange={(e) => setMileage(+e.target.value)}
                    className="mt-3 w-full accent-[#2f7d5d]"
                  />
                </Field>
                <Field label="Deductible">
                  <div className="flex gap-2">
                    {[250, 500, 1000].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDeductible(d)}
                        className={`flex-1 rounded-xl border px-2 py-2.5 text-sm transition ${
                          deductible === d
                            ? "border-[#15201c] bg-[#15201c] text-[#f6f5f2]"
                            : "border-[#15201c]/15 bg-white hover:border-[#15201c]/40"
                        }`}
                      >
                        ${d}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </Card>

            <Card title="Coverage level">
              <div className="grid gap-3 sm:grid-cols-3">
                {(Object.keys(COVERAGE) as Coverage[]).map((k) => {
                  const c = COVERAGE[k];
                  const active = coverage === k;
                  return (
                    <button
                      key={k}
                      onClick={() => setCoverage(k)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-[#2f7d5d] bg-[#2f7d5d]/[0.06] ring-2 ring-[#2f7d5d]/20"
                          : "border-[#15201c]/12 bg-white hover:border-[#15201c]/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{c.label}</span>
                        {active && <span className="text-[#2f7d5d]">✓</span>}
                      </div>
                      <p className="mt-1.5 text-[13px] leading-snug text-[#15201c]/60">{c.blurb}</p>
                      <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-[#15201c]/45">
                        Limit {c.limit}
                      </p>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card title="Add-ons">
              <div className="grid gap-2.5 sm:grid-cols-2">
                {ADDONS.map((a) => {
                  const on = addons.includes(a.id);
                  return (
                    <label
                      key={a.id}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 text-sm transition ${
                        on ? "border-[#2f7d5d] bg-[#2f7d5d]/[0.05]" : "border-[#15201c]/12 bg-white"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => toggleAddon(a.id)}
                          className="h-4 w-4 accent-[#2f7d5d]"
                        />
                        {a.label}
                      </span>
                      <span className="shrink-0 text-[13px] text-[#15201c]/55">+${a.price}</span>
                    </label>
                  );
                })}
              </div>
            </Card>
          </div>

          <aside className="lg:sticky lg:top-8">
            <div className="rounded-3xl bg-[#15201c] p-6 text-[#f6f5f2] shadow-xl shadow-[#15201c]/10">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#f6f5f2]/55">Your estimate</p>
              <div className="mt-4 flex items-end gap-1.5">
                <span className="text-5xl font-semibold tracking-tight tabular-nums text-red-500">{money(quote.monthly)}</span>
                <span className="pb-1.5 text-sm text-[#f6f5f2]/60">/mo</span>
              </div>
              <p className="mt-1.5 text-[13px] text-[#f6f5f2]/60">
                or {money(quote.annual)} paid annually · save 5%
              </p>

              {quote.discount > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#7dd3a8]/15 px-3 py-1.5 text-[13px] text-[#7dd3a8]">
                  {Math.round(quote.discount * 100)}% in discounts applied
                </div>
              )}

              <dl className="mt-6 space-y-2.5 border-t border-white/10 pt-5 text-[13px]">
                <Row k="Coverage" v={COVERAGE[coverage].label} />
                <Row k="Liability limit" v={COVERAGE[coverage].limit} />
                <Row k="Deductible" v={`$${deductible}`} />
                <Row k="Vehicle" v={`${year} ${vehicle}`} />
                <Row k="Add-ons" v={addons.length ? `${addons.length} · +$${quote.addonTotal}/mo` : "None"} />
                <Row k="Rated ZIP" v={zip || "—"} />
              </dl>

              <button className="mt-6 w-full rounded-xl bg-[#f6f5f2] py-3.5 text-sm font-semibold text-[#15201c] transition hover:bg-white">
                Continue to checkout
              </button>
              <p className="mt-3 text-center text-[11px] leading-relaxed text-[#f6f5f2]/45">
                Illustrative pricing for demo purposes only. Not a binding offer of insurance.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[
                ["A+", "AM Best"],
                ["4.8", "App rating"],
                ["12h", "Avg. claim"],
              ].map(([a, b]) => (
                <div key={b} className="rounded-2xl border border-[#15201c]/10 bg-white px-2 py-3.5">
                  <div className="text-lg font-semibold tracking-tight">{a}</div>
                  <div className="text-[11px] text-[#15201c]/50">{b}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-[#15201c]/10 bg-[#fcfbf9] p-6">
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#15201c]/50">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-medium text-[#15201c]/70">{label}</span>
      {children}
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-[#f6f5f2]/55">{k}</dt>
      <dd className="text-right font-medium text-red-500">{v}</dd>
    </div>
  );
}
