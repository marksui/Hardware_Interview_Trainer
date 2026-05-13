import { Binary, Database, ExternalLink, Gauge, Layers3 } from "lucide-react";

const prepChallenges = [
  {
    title: "The scope is wide",
    description:
      "A single interview loop can move from blocking assignments to UVM scoreboards, CDC synchronizers, SDC exceptions, routing congestion, and EDA graph algorithms.",
  },
  {
    title: "Answers must be spoken",
    description:
      "Hardware candidates are often evaluated on whether they can explain tradeoffs out loud, not just recognize a multiple-choice answer.",
  },
  {
    title: "Weak spots hide late",
    description:
      "Students may over-practice familiar RTL topics while under-training timing, physical design, or implementation flow questions.",
  },
];

const helpAreas = [
  {
    icon: Binary,
    title: "RTL and CDC",
    description:
      "Practice questions reinforce synthesizable coding style, reset intent, pipelines, handshakes, metastability, async FIFOs, and reconvergence risks.",
  },
  {
    icon: Gauge,
    title: "DV and STA",
    description:
      "The bank covers scoreboards, assertions, constrained-random debug, coverage closure, setup/hold analysis, SDC exceptions, and corner reasoning.",
  },
  {
    icon: Layers3,
    title: "PD and EDA",
    description:
      "Placement, routing, signoff, power integrity, and EDA algorithms are represented so implementation and software-facing hardware roles are not afterthoughts.",
  },
];

export function About() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="panel p-8">
          <span className="badge-pill bg-surface-soft text-primary">
            Portfolio project
          </span>
          <h2 className="display-heading mt-5 text-4xl leading-tight">
            Built for hardware interview preparation that feels closer to the
            real loop.
          </h2>
          <p className="mt-4 text-base leading-7 text-body">
            Hardware Interview Trainer is a static, local-first study tool for
            ECE and computer engineering students preparing for RTL design,
            verification, timing, physical design, SoC, and EDA software roles.
          </p>
        </div>

        <div className="product-panel p-6">
          <div className="flex items-center justify-between border-b border-hairline pb-4">
            <div>
              <p className="text-sm font-semibold text-primary">
                Interview readiness map
              </p>
              <p className="text-sm text-muted">Topic breadth without a backend</p>
            </div>
            <span className="badge-pill bg-emerald-100 text-ink-950">
              Local only
            </span>
          </div>
          <div className="mt-5 grid gap-3">
            {["RTL", "DV", "CDC", "STA", "Synthesis", "Placement", "Routing", "EDA"].map(
              (topic, index) => (
                <div
                  className="flex items-center justify-between rounded-md bg-surface-soft px-4 py-3"
                  key={topic}
                >
                  <span className="text-sm font-semibold text-primary">{topic}</span>
                  <span className="h-2 w-28 overflow-hidden rounded-full bg-surface-strong">
                    <span
                      className="block h-full rounded-full bg-action"
                      style={{ width: `${88 - index * 5}%` }}
                    />
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="panel p-6">
        <h2 className="display-heading text-[28px] leading-tight">
          Why hardware interview prep is hard
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {prepChallenges.map((item) => (
            <div className="product-panel p-5" key={item.title}>
              <h3 className="text-base font-semibold text-primary">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-body">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {helpAreas.map((item) => {
          const Icon = item.icon;

          return (
            <div className="panel p-6" key={item.title}>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-canvas text-primary">
                <Icon size={22} aria-hidden="true" />
              </div>
              <h3 className="display-heading mt-4 text-[22px]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-body">{item.description}</p>
            </div>
          );
        })}
      </section>

      <section className="product-panel p-6">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-card text-primary">
              <Binary size={22} aria-hidden="true" />
            </div>
            <h2 className="display-heading mt-4 text-[28px] leading-tight">
              Related portfolio project
            </h2>
            <p className="mt-3 text-sm leading-6 text-body">
              Pair interview practice with a hands-on educational EDA mini-tool
              for Boolean logic and static CMOS design.
            </p>
          </div>

          <div className="rounded-lg border border-hairline bg-surface-soft p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="badge-pill bg-surface-card text-primary">
                  EDA companion
                </span>
                <h3 className="display-heading mt-4 text-[24px] leading-tight">
                  Logic & CMOS Studio
                </h3>
                <p className="mt-3 text-sm leading-6 text-body">
                  A browser-based teaching tool that turns Boolean logic into
                  truth tables, Karnaugh maps, simplified equations, Verilog,
                  and static CMOS pull-up / pull-down schematics.
                </p>
              </div>
              <a
                className="button-secondary shrink-0"
                href="https://marksui.github.io/logic-cmos-studio/"
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink size={17} aria-hidden="true" />
                Open Studio
              </a>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "Truth tables",
                "K-maps",
                "Verilog export",
                "CMOS networks",
                "EDA education",
              ].map((item) => (
                <span className="badge-pill bg-surface-card text-primary" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="product-panel p-6">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-card text-primary">
              <Database size={22} aria-hidden="true" />
            </div>
            <h2 className="display-heading mt-4 text-[28px] leading-tight">
              Why JSON and LocalStorage?
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md bg-surface-soft p-4">
              <h3 className="text-sm font-semibold text-primary">
                Simple deployment
              </h3>
              <p className="mt-2 text-sm leading-6 text-body">
                JSON keeps the question bank inspectable and versionable in Git.
                Vite builds everything into static assets that work on GitHub
                Pages.
              </p>
            </div>
            <div className="rounded-md bg-surface-soft p-4">
              <h3 className="text-sm font-semibold text-primary">
                Private progress
              </h3>
              <p className="mt-2 text-sm leading-6 text-body">
                LocalStorage stores wrong questions, accuracy aggregates, and
                theme preference in the browser. There is no account system,
                backend API, analytics service, or user tracking.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
