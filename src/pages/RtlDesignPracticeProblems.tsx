import { CheckCircle2, Cpu, FileCode2, TestTube2 } from "lucide-react";

const practiceProblems = [
  {
    title: "Fixed Priority Arbiter: LSB Highest",
    problem:
      "RTL for a fixed priority arbiter with decreasing priority from LSB to MSB.",
    answer:
      "Treat request bit 0 as highest priority and scan upward until the first asserted request is found. The output is usually a one-hot grant plus a valid bit. Default grant to zero, then set only the first matching request. Verify no two grant bits are high and that every lower-index active request masks higher-index requests.",
    tags: ["arbiter", "priority", "combinational"],
  },
  {
    title: "Fixed Priority Arbiter: MSB Highest",
    problem:
      "RTL for a fixed priority arbiter with decreasing priority from MSB to LSB.",
    answer:
      "Treat the most significant request bit as highest priority and scan downward. The implementation mirrors the LSB-high arbiter but reverses the search order. Assertions should check one-hot grant, grant implies request, and no lower-priority request wins when a higher-priority request is active.",
    tags: ["arbiter", "priority", "one-hot"],
  },
  {
    title: "3-Request Round-Robin Arbiter",
    problem: "Implement a Round-Robin Arbiter with 3 input requests.",
    answer:
      "Keep a pointer that records the next requester to try first. Build combinational grant logic that scans req[pointer], then wraps around the remaining requesters. After a successful grant, update the pointer to the slot after the winner. Test fairness by holding all requests high and checking the grant pattern rotates 0, 1, 2.",
    tags: ["arbiter", "fairness", "state"],
  },
  {
    title: "Synchronous FIFO",
    problem: "RTL design for a synchronous FIFO buffer for generic depth.",
    answer:
      "Use a memory array, write pointer, read pointer, and either an occupancy counter or extra pointer bit. Empty means occupancy is zero, and full means occupancy equals depth. Simultaneous read and write should preserve occupancy when the FIFO is neither empty nor full. Test wraparound, full, empty, and back-to-back read/write cases.",
    tags: ["fifo", "buffer", "pointers"],
  },
  {
    title: "High-Speed FIFO Flags",
    problem:
      "Improve FIFO for high speed with registered flags and registered read. What additional logic is needed to still write and read to the same address in consecutive cycles?",
    answer:
      "Move full and empty to registered look-ahead flags computed from next occupancy or next pointers. A registered read adds one cycle of latency, so add an output-valid register and define first-word fall-through versus standard read behavior. If read and write target the same address in adjacent cycles, add bypass or forwarding logic, or guarantee memory write-first/read-first semantics with clear timing assumptions.",
    tags: ["fifo", "timing", "bypass"],
  },
  {
    title: "Reorder Buffer",
    problem: "Micro-architect a reorder buffer (ROB) and write RTL for it.",
    answer:
      "Model the ROB as a circular queue of entries with valid, busy/done, destination register, value or pointer, exception status, and sequence metadata. Allocate at tail, mark complete from execution writeback, and commit in order from head only when the head entry is done and safe. Verify in-order commit, full/empty behavior, flush recovery, and no overwrite of live entries.",
    tags: ["microarchitecture", "rob", "cpu"],
  },
  {
    title: "Pulse Synchronizer",
    problem: "RTL and circuit for a pulse synchronization circuit.",
    answer:
      "Do not send a one-cycle pulse directly through a two-flop synchronizer. Convert the source pulse into a toggle, synchronize the toggle into the destination clock domain, then XOR the synchronized value with a delayed copy to regenerate a one-cycle destination pulse. Verify no duplicate pulses and no missed pulses under reasonable event spacing.",
    tags: ["cdc", "pulse", "toggle"],
  },
  {
    title: "Divisible-by-3 or Divisible-by-5 FSM",
    problem:
      "FSM design of a divisible by 3 or 5 logic for serial input. Assume input goes to the LSB of the previously seen number.",
    answer:
      "Use the current remainder as the FSM state. For divisor K, states are 0 through K-1, and each input bit updates the state with next_remainder = (2 * current_remainder + bit) % K. Assert divisible when the state is 0 after consuming the bit. This scales cleanly to 3, 5, or any small constant.",
    tags: ["fsm", "modulo", "serial"],
  },
  {
    title: "Asynchronous FIFO",
    problem: "Asynchronous FIFO implementation details.",
    answer:
      "Keep binary and Gray-coded pointers in both clock domains. Synchronize only Gray-coded pointers across domains, not multi-bit data. The write side generates full by comparing the next write Gray pointer to the synchronized read Gray pointer with inverted top bits. The read side generates empty when synchronized write Gray equals current read Gray.",
    tags: ["cdc", "async-fifo", "gray-code"],
  },
  {
    title: "Binary and Gray Conversion",
    problem: "RTL for binary to gray and gray to binary logic.",
    answer:
      "Binary to Gray is gray = binary ^ (binary >> 1). Gray to binary is a prefix XOR from MSB to LSB: bin[MSB] = gray[MSB], then bin[i] = bin[i+1] ^ gray[i]. Test every value for the chosen width and confirm Gray increments change only one bit when driven by a binary counter.",
    tags: ["gray-code", "conversion", "cdc"],
  },
  {
    title: "Gates Using 2-to-1 Muxes",
    problem: "Implement NAND, XOR, and NOT gate using 2-to-1 MUX.",
    answer:
      "Assume mux(sel, d0, d1) returns sel ? d1 : d0. NOT A can be mux(A, 1, 0). XOR A,B can be mux(A, B, ~B). NAND A,B can be mux(A, 1, ~B). The key interview point is Shannon decomposition: choose one input as select and express the output for select=0 and select=1.",
    tags: ["mux", "boolean", "shannon"],
  },
  {
    title: "4-to-1 Mux From 2-to-1 Muxes",
    problem: "Implement 4-to-1 MUX using 2-to-1 MUXs.",
    answer:
      "Build a two-level tree. First select between d0/d1 and d2/d3 using sel[0]. Then select between those two intermediate results using sel[1]. Verify all four select encodings, and be explicit about bit order so sel=2'b00 maps to d0 and sel=2'b11 maps to d3.",
    tags: ["mux", "hierarchy", "combinational"],
  },
  {
    title: "4-Way Cache LRU",
    problem:
      "RTL design for an LRU cache replacement policy, consider a 4-way cache.",
    answer:
      "A practical 4-way LRU can use a 4x4 age matrix or 2-bit recency counters per way. On access, mark the accessed way as most recent and age the others consistently. Victim selection chooses the least-recent way. Verify reset state, repeated hits to one way, alternating hits, and that invalid ways are chosen before valid LRU victims.",
    tags: ["cache", "lru", "replacement"],
  },
  {
    title: "3-Input Sorting Logic",
    problem: "RTL for a 3-input sorting logic.",
    answer:
      "Use a small compare-swap network: compare/swap a and b, then compare/swap the larger result with c, then compare/swap the lower two again. The outputs are min, mid, and max. Test all orderings, equal inputs, signed versus unsigned interpretation, and parameterized width.",
    tags: ["sorting", "compare-swap", "datapath"],
  },
  {
    title: "Three-Input Median",
    problem: "RTL for three input median circuit.",
    answer:
      "For N-bit values, the median is the middle value after sorting three inputs, so reuse the 3-input sorting network and output mid. For single-bit inputs, the median is the majority function: (a & b) | (a & c) | (b & c). Clarify which form the interviewer wants.",
    tags: ["median", "majority", "datapath"],
  },
  {
    title: "Fibonacci and Factorial",
    problem: "RTL for Fibonacci and Factorial algorithm.",
    answer:
      "Use an FSM with input capture, running state, loop counter, accumulator registers, done, and valid output. Fibonacci keeps two rolling values and updates them each iteration. Factorial keeps an accumulator and multiplies by the loop counter. Test n=0, n=1, maximum supported n, overflow behavior, and start while busy.",
    tags: ["fsm", "algorithm", "datapath"],
  },
  {
    title: "Clock Dividers 2, 3, 4, and 5",
    problem: "Design clock divider logic for divide by 2, 3, 4, 5.",
    answer:
      "Even dividers can use counters or toggle flops for clean 50 percent duty cycle. Odd dividers need a counter with non-50 duty cycle, or both-edge logic if a near-50 duty cycle is required and the clocking methodology allows it. Always clarify whether generated clocks are acceptable or whether clock-enable pulses are preferred.",
    tags: ["clocking", "divider", "timing"],
  },
  {
    title: "Ready-Valid Downsizer",
    problem:
      "RTL ready-valid downsizer. A 16-bit input with ready/valid is sent at output 1 byte at a time. Both input and output use ready/valid.",
    answer:
      "Accept a 16-bit word only when internal storage is free or the second byte is being consumed. Store the word, track which byte is currently presented, and hold output valid until output ready accepts each byte. Define byte order clearly. Assertions should ensure each accepted input produces exactly two accepted output bytes in order.",
    tags: ["ready-valid", "downsizer", "protocol"],
  },
  {
    title: "CPU Pipeline Datapath",
    problem: "Datapath components for a typical 4/5 stage CPU pipeline.",
    answer:
      "A classic five-stage pipeline has PC and fetch logic, instruction memory, IF/ID register, decoder, register file, immediate generation, ID/EX register, ALU, branch compare, EX/MEM register, data memory, MEM/WB register, and writeback mux. Add forwarding, hazard detection, stalls, flushes, and valid bits to make it behave cycle-accurately.",
    tags: ["cpu", "pipeline", "datapath"],
  },
  {
    title: "11011 Sequence Detector",
    problem: "11011 sequence detector FSM.",
    answer:
      "Use states that represent the longest matched prefix of 11011: none, 1, 11, 110, 1101, and detect on 11011. For overlapping detection, transition after a match to the state representing the longest suffix that is also a prefix. Verify streams with overlap, such as 11011011.",
    tags: ["fsm", "sequence-detector", "overlap"],
  },
  {
    title: "First Set Bit and Popcount",
    problem:
      "RTL for a) the index of the first set bit in 32-bit input. b) Number of 1's in 32-bit input signal.",
    answer:
      "First-set-bit index is a priority encoder; define whether bit 0 or bit 31 is first. Popcount can be implemented as a balanced adder tree over individual bits to reduce depth compared with a long serial sum. Test zero input, one-hot inputs, all ones, and mixed patterns.",
    tags: ["priority-encoder", "popcount", "adder-tree"],
  },
  {
    title: "Grayscale Average Without Division",
    problem:
      "Grayscale average conversion circuit without using division hardware. Inputs are 8-bit wide for the three channels.",
    answer:
      "Compute sum = r + g + b, then replace division by 3 with a constant multiply or shift-add approximation. A common approximation is gray = (sum * 85) >> 8; exact rounding may need a wider constant multiply and correction. State the error tolerance and verify all corner values from 0 to 255.",
    tags: ["image", "constant-multiply", "datapath"],
  },
  {
    title: "Divide-by-10 Clock, 40 Percent Duty",
    problem: "Clock divide by 10 with a duty cycle of 40 percent.",
    answer:
      "Use a modulo-10 counter. Drive the divided output high for four counts and low for six counts, such as high when count is 0,1,2,3. This creates period 10 input cycles and 40 percent duty cycle. Verify reset alignment and exact high/low durations.",
    tags: ["clock-divider", "duty-cycle", "counter"],
  },
  {
    title: "Synchronous FIFO SVAs",
    problem: "SVAs for synchronous FIFO - as many as possible.",
    answer:
      "Useful assertions include no write when full unless a read also makes space, no read when empty unless a write-through policy is defined, occupancy never exceeds depth, empty matches count zero, full matches count depth, pointers change only on accepted operations, data order is preserved, reset clears state, and simultaneous read/write keeps count stable.",
    tags: ["sva", "fifo", "verification"],
  },
  {
    title: "UART TX Interface",
    problem: "Using UART timing diagram, implement RTL for TX interface.",
    answer:
      "Build a baud-rate tick generator, TX FSM, bit counter, shift register, busy flag, and ready/valid input handshake. A frame usually sends start bit 0, 8 data bits LSB first, optional parity, and stop bit 1. Verify baud spacing, bit order, back-to-back bytes, reset idle-high behavior, and that new data is accepted only when ready.",
    tags: ["uart", "serial", "fsm"],
  },
];

const summaryCards = [
  {
    icon: FileCode2,
    label: "Problems",
    value: "25",
  },
  {
    icon: Cpu,
    label: "Focus",
    value: "RTL",
  },
  {
    icon: TestTube2,
    label: "Practice style",
    value: "RTL + TB + SVA",
  },
];

export function RtlDesignPracticeProblems() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="panel p-8">
          <span className="badge-pill bg-surface-soft text-primary">
            RTL design drills
          </span>
          <h2 className="display-heading mt-5 text-4xl leading-tight">
            RTL Design Practice Problems
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-6 text-body">
            <p>
              Presenting my collection of 25 RTL design problems that I used to
              practice and improve my RTL skills. These are what I review,
              especially during my interview preparation process. They cover the
              fundamentals required to design complex systems.
            </p>
            <p>
              For a good grasp of digital implementation, one should understand
              these designs at the clock-cycle level. These problems assume a
              good understanding of timing, synthesis, and SystemVerilog.
            </p>
            <p>
              Write the RTL and a testbench to ensure the specifications are
              met. Feel free to assume additional signals as part of the design,
              and use SystemVerilog Assertions in testbenches to stress-test the
              designs.
            </p>
          </div>
        </div>

        <div className="product-panel p-6">
          <div className="flex items-center justify-between border-b border-hairline pb-4">
            <div>
              <p className="text-sm font-semibold text-primary">
                Practice format
              </p>
              <p className="text-sm text-muted">
                Problem statement plus design checklist answer
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-card text-primary">
              <CheckCircle2 size={22} aria-hidden="true" />
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {summaryCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  className="flex items-center justify-between rounded-md bg-surface-soft p-4"
                  key={item.label}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} aria-hidden="true" />
                    <span className="text-sm font-semibold text-primary">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-muted">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="panel p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="display-heading text-[28px] leading-tight">
              Problem Set
            </h2>
            <p className="mt-2 text-sm leading-6 text-body">
              Use each answer as a design target and review checklist, then
              write your own RTL, testbench, and assertions.
            </p>
          </div>
          <span className="badge-pill bg-surface-soft text-primary">
            No backend · portfolio ready
          </span>
        </div>
      </section>

      <section className="grid gap-4">
        {practiceProblems.map((item, index) => (
          <article className="product-panel p-5" key={item.title}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-pill bg-surface-card text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      className="badge-pill bg-surface-soft text-primary"
                      key={tag}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-7 text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-body">
                  <span className="font-semibold text-primary">Problem: </span>
                  {item.problem}
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-md border border-hairline bg-surface-soft p-4">
              <h4 className="text-sm font-semibold text-primary">
                Answer / design checklist
              </h4>
              <p className="mt-2 text-sm leading-6 text-body">{item.answer}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
