import { Cpu, DatabaseZap, GitBranch, Layers3, Route, TimerReset } from "lucide-react";
import { useState } from "react";

const sections = [
  {
    id: "rtl",
    title: "RTL basics",
    icon: Cpu,
    bullets: [
      "Separate combinational and sequential logic with always_comb and always_ff when using SystemVerilog.",
      "Use nonblocking assignments for clocked flops and blocking assignments for combinational temporary values.",
      "Assign defaults in combinational blocks to avoid unintended latches.",
      "Keep reset strategy consistent and document synchronous versus asynchronous behavior.",
      "Pipeline long datapaths by balancing logic depth and carrying valid/control signals alongside data."
    ],
  },
  {
    id: "dv",
    title: "DV basics",
    icon: DatabaseZap,
    bullets: [
      "A verification plan connects spec features to tests, assertions, scoreboards, and coverage points.",
      "Monitors observe protocol activity and publish transactions; scoreboards compare expected and actual behavior.",
      "Functional coverage measures intended scenarios, while code coverage measures implementation structures exercised.",
      "Constrained-random stimulus should be reviewed for both over-constraint and unreachable coverage bins.",
      "Reproducibility matters: preserve seed, test name, config, build, and waveform trigger context."
    ],
  },
  {
    id: "cdc",
    title: "CDC basics",
    icon: GitBranch,
    bullets: [
      "Metastability happens when a flop samples data changing near the active clock edge.",
      "Two-flop synchronizers are appropriate for independent single-bit level crossings.",
      "Use async FIFOs, handshakes, or safe encodings for multi-bit transfers.",
      "Gray-coded FIFO pointers reduce incoherent pointer sampling because one bit changes at a time.",
      "Reset deassertion must be controlled per destination clock domain to avoid reset-domain crossing issues."
    ],
  },
  {
    id: "sta",
    title: "STA basics",
    icon: TimerReset,
    bullets: [
      "Setup is a max-delay check; hold is a min-delay check.",
      "Negative slack means a path violates a timing requirement for the analyzed mode and corner.",
      "SDC quality depends on clocks, generated clocks, IO delays, clock groups, and justified exceptions.",
      "False paths and multicycle paths remove or alter analysis, so they require strong functional justification.",
      "PVT corners expose slow setup risks, fast hold risks, and mode-specific timing behavior."
    ],
  },
  {
    id: "synthesis",
    title: "Synthesis basics",
    icon: Layers3,
    bullets: [
      "Synthesis maps RTL into a technology-library netlist optimized for timing, area, and power.",
      "Technology mapping chooses real standard cells to implement generic Boolean logic.",
      "Common optimizations include gate sizing, buffering, logic restructuring, cloning, and retiming when allowed.",
      "Review timing, area, power, design-rule, unmapped-cell, and unconstrained-path reports.",
      "Run formal equivalence to prove the synthesized gate netlist preserves RTL behavior."
    ],
  },
  {
    id: "placement",
    title: "Placement basics",
    icon: Layers3,
    bullets: [
      "Placement assigns legal locations to standard cells while balancing wirelength, timing, density, and congestion.",
      "Global placement optimizes approximate locations; detailed placement legalizes and locally refines them.",
      "Macros define major routing channels and can dominate congestion and timing outcomes.",
      "High utilization saves area but reduces routability and timing flexibility.",
      "Timing-driven placement weights critical paths so physically close cells reduce delay."
    ],
  },
  {
    id: "routing",
    title: "Routing basics",
    icon: Route,
    bullets: [
      "Global routing estimates route regions and resource demand; detailed routing creates exact shapes and vias.",
      "Upper metals are commonly used for longer nets because they are lower resistance and better for global travel.",
      "Crosstalk risk increases with coupling capacitance, parallel run length, and aligned aggressor switching windows.",
      "Antenna fixes include diodes, jumpers, and routing changes that reduce fabrication charge buildup.",
      "Post-route extraction captures actual wire, via, and coupling parasitics for signoff STA."
    ],
  },
  {
    id: "pd",
    title: "Physical Design basics",
    icon: Cpu,
    bullets: [
      "Floorplanning sets die or block shape, macro locations, IO strategy, utilization, channels, and power grid.",
      "CTS distributes clocks with controlled skew, insertion delay, transition, and power.",
      "IR drop is supply loss through the power delivery network and can slow or break cells.",
      "Electromigration is current-density-driven metal wear-out and is managed with wire and via capacity.",
      "Physical signoff commonly includes STA, DRC, LVS, extraction, IR, EM, SI, and antenna checks."
    ],
  },
  {
    id: "eda",
    title: "EDA algorithms",
    icon: GitBranch,
    bullets: [
      "Partitioning often uses min-cut or clustering methods to manage hierarchy and reduce inter-block connectivity.",
      "Placement tools combine analytical optimization, density control, timing weighting, and legalization heuristics.",
      "Routing uses graph search, maze routing, negotiated congestion, and Steiner-tree approximations.",
      "Many exact formulations are NP-hard at chip scale, so practical tools use approximation and heuristics.",
      "Good EDA software balances algorithmic quality with runtime, memory, incremental updates, and debuggable reports."
    ],
  },
];

export function Cheatsheet() {
  const [activeSectionId, setActiveSectionId] = useState(sections[0].id);
  const activeSection =
    sections.find((section) => section.id === activeSectionId) ?? sections[0];
  const ActiveIcon = activeSection.icon;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="panel h-fit overflow-hidden">
        <div className="border-b border-hairline px-5 py-5">
          <h2 className="display-heading text-[28px] leading-tight">Cheatsheet</h2>
          <p className="mt-2 text-sm text-body">
            Compact interview refreshers by topic.
          </p>
        </div>
        <div className="grid gap-1 p-2" role="tablist" aria-label="Cheatsheet topics">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = section.id === activeSectionId;

            return (
              <button
                aria-selected={isActive}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-semibold transition ${
                  isActive
                    ? "bg-canvas text-primary shadow-panel"
                    : "text-body"
                }`}
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                role="tab"
                type="button"
              >
                <Icon size={17} aria-hidden="true" />
                {section.title}
              </button>
            );
          })}
        </div>
      </aside>

      <section className="product-panel overflow-hidden">
        <div className="border-b border-hairline bg-canvas px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-card text-primary">
              <ActiveIcon size={22} aria-hidden="true" />
            </div>
            <div>
              <h2 className="display-heading text-4xl leading-tight">
                {activeSection.title}
              </h2>
              <p className="mt-1 text-sm text-body">
                Interview-ready points to say out loud.
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-3 p-5">
          {activeSection.bullets.map((bullet, index) => (
            <div
              className="rounded-md border border-hairline bg-surface-soft p-4"
              key={bullet}
            >
              <div className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-canvas text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-body">{bullet}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
