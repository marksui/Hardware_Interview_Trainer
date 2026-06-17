export interface HdlbitsProblem {
  title: string;
  url: string;
}

export interface HdlbitsReviewSection {
  id: string;
  area: string;
  group: string;
  title: string;
  summary: string;
  focus: string[];
  pitfalls: string[];
  problems: HdlbitsProblem[];
}

export interface HdlbitsReviewSource {
  sourceTitle: string;
  sourceUrl: string;
  problemSetUrl: string;
  retrievedAt: string;
  usageNote: string;
  sections: HdlbitsReviewSection[];
}

export const hdlbitsReviewSource = {
  "sourceTitle": "HDLBits - Verilog Practice",
  "sourceUrl": "https://hdlbits.01xz.net/wiki/Main_Page",
  "problemSetUrl": "https://hdlbits.01xz.net/wiki/Problem_sets",
  "retrievedAt": "2026-06-16",
  "usageNote": "Problem titles and links are indexed from HDLBits. Review summaries, focus points, and pitfalls are original study notes for this app; full exercise statements remain on HDLBits.",
  "sections": [
    {
      "id": "getting-started-getting-started",
      "area": "Getting Started",
      "group": "",
      "title": "Getting Started",
      "summary": "Use this section to learn the HDLBits workflow, module wrapper expectations, and the fastest submit-simulate-debug loop.",
      "focus": [
        "Read the provided module declaration before coding",
        "Keep ports and widths exactly as specified",
        "Use the simulator feedback to isolate syntax versus logic mistakes"
      ],
      "pitfalls": [
        "Changing the module interface",
        "Treating HDLBits as software-style unit tests instead of hardware simulation"
      ],
      "problems": [
        {
          "title": "Getting Started",
          "url": "https://hdlbits.01xz.net/wiki/step_one"
        },
        {
          "title": "Output Zero",
          "url": "https://hdlbits.01xz.net/wiki/zero"
        }
      ]
    },
    {
      "id": "verilog-language-basics-basics",
      "area": "Verilog Language",
      "group": "Basics",
      "title": "Basics",
      "summary": "Review continuous assignments, simple wires, gate expressions, and how Verilog expressions map to combinational logic.",
      "focus": [
        "assign statements",
        "wire declarations",
        "bitwise versus logical operators",
        "basic boolean algebra"
      ],
      "pitfalls": [
        "Forgetting declared wires",
        "Using procedural assignment where continuous assignment is expected"
      ],
      "problems": [
        {
          "title": "Simple wire",
          "url": "https://hdlbits.01xz.net/wiki/wire"
        },
        {
          "title": "Four wires",
          "url": "https://hdlbits.01xz.net/wiki/wire4"
        },
        {
          "title": "Inverter",
          "url": "https://hdlbits.01xz.net/wiki/notgate"
        },
        {
          "title": "AND gate",
          "url": "https://hdlbits.01xz.net/wiki/andgate"
        },
        {
          "title": "NOR gate",
          "url": "https://hdlbits.01xz.net/wiki/norgate"
        },
        {
          "title": "XNOR gate",
          "url": "https://hdlbits.01xz.net/wiki/xnorgate"
        },
        {
          "title": "Declaring wires",
          "url": "https://hdlbits.01xz.net/wiki/wire_decl"
        },
        {
          "title": "7458 chip",
          "url": "https://hdlbits.01xz.net/wiki/7458"
        }
      ]
    },
    {
      "id": "verilog-language-vectors-vectors",
      "area": "Verilog Language",
      "group": "Vectors",
      "title": "Vectors",
      "summary": "Practice bit indexing, part-selects, concatenation, replication, and vector-wide operations.",
      "focus": [
        "Packed vector ranges",
        "part-select direction",
        "concatenation braces",
        "replication counts",
        "bitwise gates across buses"
      ],
      "pitfalls": [
        "Off-by-one bit ranges",
        "Mixing up bit order during reversal or slicing"
      ],
      "problems": [
        {
          "title": "Vectors",
          "url": "https://hdlbits.01xz.net/wiki/vector0"
        },
        {
          "title": "Vectors in more detail",
          "url": "https://hdlbits.01xz.net/wiki/vector1"
        },
        {
          "title": "Vector part select",
          "url": "https://hdlbits.01xz.net/wiki/vector2"
        },
        {
          "title": "Bitwise operators",
          "url": "https://hdlbits.01xz.net/wiki/vectorgates"
        },
        {
          "title": "Four-input gates",
          "url": "https://hdlbits.01xz.net/wiki/gates4"
        },
        {
          "title": "Vector concatenation operator",
          "url": "https://hdlbits.01xz.net/wiki/vector3"
        },
        {
          "title": "Vector reversal 1",
          "url": "https://hdlbits.01xz.net/wiki/vectorr"
        },
        {
          "title": "Replication operator",
          "url": "https://hdlbits.01xz.net/wiki/vector4"
        },
        {
          "title": "More replication",
          "url": "https://hdlbits.01xz.net/wiki/vector5"
        }
      ]
    },
    {
      "id": "verilog-language-modules-hierarchy-modules-hierarchy",
      "area": "Verilog Language",
      "group": "Modules: Hierarchy",
      "title": "Modules: Hierarchy",
      "summary": "Review instantiation, port mapping, hierarchy, and how small modules compose into larger datapaths.",
      "focus": [
        "Named versus positional port connections",
        "module instance syntax",
        "multi-instance wiring",
        "adder composition"
      ],
      "pitfalls": [
        "Port order mistakes with positional mapping",
        "Width mismatch when connecting child modules"
      ],
      "problems": [
        {
          "title": "Modules",
          "url": "https://hdlbits.01xz.net/wiki/module"
        },
        {
          "title": "Connecting ports by position",
          "url": "https://hdlbits.01xz.net/wiki/module_pos"
        },
        {
          "title": "Connecting ports by name",
          "url": "https://hdlbits.01xz.net/wiki/module_name"
        },
        {
          "title": "Three modules",
          "url": "https://hdlbits.01xz.net/wiki/module_shift"
        },
        {
          "title": "Modules and vectors",
          "url": "https://hdlbits.01xz.net/wiki/module_shift8"
        },
        {
          "title": "Adder 1",
          "url": "https://hdlbits.01xz.net/wiki/module_add"
        },
        {
          "title": "Adder 2",
          "url": "https://hdlbits.01xz.net/wiki/module_fadd"
        },
        {
          "title": "Carry-select adder",
          "url": "https://hdlbits.01xz.net/wiki/module_cseladd"
        },
        {
          "title": "Adder-subtractor",
          "url": "https://hdlbits.01xz.net/wiki/module_addsub"
        }
      ]
    },
    {
      "id": "verilog-language-procedures-procedures",
      "area": "Verilog Language",
      "group": "Procedures",
      "title": "Procedures",
      "summary": "Review always blocks, if/case statements, and the distinction between combinational and clocked procedural logic.",
      "focus": [
        "always @(*) / always_comb style",
        "posedge clocked blocks",
        "blocking vs nonblocking assignment intent",
        "case defaults",
        "latch avoidance"
      ],
      "pitfalls": [
        "Incomplete assignments inferring latches",
        "Using blocking and nonblocking without a clear model"
      ],
      "problems": [
        {
          "title": "Always blocks (combinational)",
          "url": "https://hdlbits.01xz.net/wiki/alwaysblock1"
        },
        {
          "title": "Always blocks (clocked)",
          "url": "https://hdlbits.01xz.net/wiki/alwaysblock2"
        },
        {
          "title": "If statement",
          "url": "https://hdlbits.01xz.net/wiki/always_if"
        },
        {
          "title": "If statement latches",
          "url": "https://hdlbits.01xz.net/wiki/always_if2"
        },
        {
          "title": "Case statement",
          "url": "https://hdlbits.01xz.net/wiki/always_case"
        },
        {
          "title": "Priority encoder",
          "url": "https://hdlbits.01xz.net/wiki/always_case2"
        },
        {
          "title": "Priority encoder with casez",
          "url": "https://hdlbits.01xz.net/wiki/always_casez"
        },
        {
          "title": "Avoiding latches",
          "url": "https://hdlbits.01xz.net/wiki/always_nolatches"
        }
      ]
    },
    {
      "id": "verilog-language-more-verilog-features-more-verilog-features",
      "area": "Verilog Language",
      "group": "More Verilog Features",
      "title": "More Verilog Features",
      "summary": "Review compact Verilog patterns such as ternary operators, reductions, loops, generate blocks, and large adders.",
      "focus": [
        "reduction operators",
        "conditional operator",
        "for loops in combinational logic",
        "generate loops",
        "wide arithmetic structure"
      ],
      "pitfalls": [
        "Confusing procedural for loops with generate-time replication",
        "Forgetting loop bounds and output defaults"
      ],
      "problems": [
        {
          "title": "Conditional ternary operator",
          "url": "https://hdlbits.01xz.net/wiki/conditional"
        },
        {
          "title": "Reduction operators",
          "url": "https://hdlbits.01xz.net/wiki/reduction"
        },
        {
          "title": "Reduction: Even wider gates",
          "url": "https://hdlbits.01xz.net/wiki/gates100"
        },
        {
          "title": "Combinational for-loop: Vector reversal 2",
          "url": "https://hdlbits.01xz.net/wiki/vector100r"
        },
        {
          "title": "Combinational for-loop: 255-bit population count",
          "url": "https://hdlbits.01xz.net/wiki/popcount255"
        },
        {
          "title": "Generate for-loop: 100-bit binary adder 2",
          "url": "https://hdlbits.01xz.net/wiki/adder100i"
        },
        {
          "title": "Generate for-loop: 100-digit BCD adder",
          "url": "https://hdlbits.01xz.net/wiki/bcdadd100"
        }
      ]
    },
    {
      "id": "circuits-combinational-logic-basic-gates",
      "area": "Circuits",
      "group": "Combinational Logic",
      "title": "Basic Gates",
      "summary": "Review direct truth-table-to-logic translation and small combinational gate networks.",
      "focus": [
        "boolean expressions",
        "truth-table minimization",
        "vectorized gates",
        "simple datapath composition"
      ],
      "pitfalls": [
        "Using logical operators where bitwise operators are required",
        "Missing inversion or precedence in expressions"
      ],
      "problems": [
        {
          "title": "Wire",
          "url": "https://hdlbits.01xz.net/wiki/exams/m2014_q4h"
        },
        {
          "title": "GND",
          "url": "https://hdlbits.01xz.net/wiki/exams/m2014_q4i"
        },
        {
          "title": "NOR",
          "url": "https://hdlbits.01xz.net/wiki/exams/m2014_q4e"
        },
        {
          "title": "Another gate",
          "url": "https://hdlbits.01xz.net/wiki/exams/m2014_q4f"
        },
        {
          "title": "Two gates",
          "url": "https://hdlbits.01xz.net/wiki/exams/m2014_q4g"
        },
        {
          "title": "More logic gates",
          "url": "https://hdlbits.01xz.net/wiki/gates"
        },
        {
          "title": "7420 chip",
          "url": "https://hdlbits.01xz.net/wiki/7420"
        },
        {
          "title": "Truth tables",
          "url": "https://hdlbits.01xz.net/wiki/truthtable1"
        },
        {
          "title": "Two-bit equality",
          "url": "https://hdlbits.01xz.net/wiki/mt2015_eq2"
        },
        {
          "title": "Simple circuit A",
          "url": "https://hdlbits.01xz.net/wiki/mt2015_q4a"
        },
        {
          "title": "Simple circuit B",
          "url": "https://hdlbits.01xz.net/wiki/mt2015_q4b"
        },
        {
          "title": "Combine circuits A and B",
          "url": "https://hdlbits.01xz.net/wiki/mt2015_q4"
        },
        {
          "title": "Ring or vibrate?",
          "url": "https://hdlbits.01xz.net/wiki/ringer"
        },
        {
          "title": "Thermostat",
          "url": "https://hdlbits.01xz.net/wiki/thermostat"
        },
        {
          "title": "3-bit population count",
          "url": "https://hdlbits.01xz.net/wiki/popcount3"
        },
        {
          "title": "Gates and vectors",
          "url": "https://hdlbits.01xz.net/wiki/gatesv"
        },
        {
          "title": "Even longer vectors",
          "url": "https://hdlbits.01xz.net/wiki/gatesv100"
        }
      ]
    },
    {
      "id": "circuits-combinational-logic-multiplexers",
      "area": "Circuits",
      "group": "Combinational Logic",
      "title": "Multiplexers",
      "summary": "Review mux construction from ternary operators, case statements, and bit slicing across wide buses.",
      "focus": [
        "2:1 mux idioms",
        "case-based muxes",
        "bus selection",
        "default paths"
      ],
      "pitfalls": [
        "Width mismatch on selected slices",
        "Missing default value for illegal select encodings"
      ],
      "problems": [
        {
          "title": "2-to-1 multiplexer",
          "url": "https://hdlbits.01xz.net/wiki/mux2to1"
        },
        {
          "title": "2-to-1 bus multiplexer",
          "url": "https://hdlbits.01xz.net/wiki/mux2to1v"
        },
        {
          "title": "9-to-1 multiplexer",
          "url": "https://hdlbits.01xz.net/wiki/mux9to1v"
        },
        {
          "title": "256-to-1 multiplexer",
          "url": "https://hdlbits.01xz.net/wiki/mux256to1"
        },
        {
          "title": "256-to-1 4-bit multiplexer",
          "url": "https://hdlbits.01xz.net/wiki/mux256to1v"
        }
      ]
    },
    {
      "id": "circuits-combinational-logic-arithmetic-circuits",
      "area": "Circuits",
      "group": "Combinational Logic",
      "title": "Arithmetic Circuits",
      "summary": "Review adders, carry chains, overflow reasoning, and BCD arithmetic composition.",
      "focus": [
        "half/full adder logic",
        "carry propagation",
        "signed overflow detection",
        "wide adder composition",
        "BCD digit correction"
      ],
      "pitfalls": [
        "Confusing carry-out with signed overflow",
        "Dropping carry between composed adder stages"
      ],
      "problems": [
        {
          "title": "Half adder",
          "url": "https://hdlbits.01xz.net/wiki/hadd"
        },
        {
          "title": "Full adder",
          "url": "https://hdlbits.01xz.net/wiki/fadd"
        },
        {
          "title": "3-bit binary adder",
          "url": "https://hdlbits.01xz.net/wiki/adder3"
        },
        {
          "title": "Adder",
          "url": "https://hdlbits.01xz.net/wiki/exams/m2014_q4j"
        },
        {
          "title": "Signed addition overflow",
          "url": "https://hdlbits.01xz.net/wiki/exams/ece241_2014_q1c"
        },
        {
          "title": "100-bit binary adder",
          "url": "https://hdlbits.01xz.net/wiki/adder100"
        },
        {
          "title": "4-digit BCD adder",
          "url": "https://hdlbits.01xz.net/wiki/bcdadd4"
        }
      ]
    },
    {
      "id": "circuits-combinational-logic-karnaugh-map-to-circuit",
      "area": "Circuits",
      "group": "Combinational Logic",
      "title": "Karnaugh Map to Circuit",
      "summary": "Review deriving minimal SOP/POS forms and implementing simplified logic from K-map groupings.",
      "focus": [
        "minterms and maxterms",
        "SOP vs POS",
        "don't-care use",
        "mux-based implementation of boolean functions"
      ],
      "pitfalls": [
        "Grouping non-adjacent cells",
        "Ignoring don't-cares that simplify the circuit"
      ],
      "problems": [
        {
          "title": "3-variable",
          "url": "https://hdlbits.01xz.net/wiki/kmap1"
        },
        {
          "title": "4-variable",
          "url": "https://hdlbits.01xz.net/wiki/kmap2"
        },
        {
          "title": "4-variable",
          "url": "https://hdlbits.01xz.net/wiki/kmap3"
        },
        {
          "title": "4-variable",
          "url": "https://hdlbits.01xz.net/wiki/kmap4"
        },
        {
          "title": "Minimum SOP and POS",
          "url": "https://hdlbits.01xz.net/wiki/exams/ece241_2013_q2"
        },
        {
          "title": "Karnaugh map",
          "url": "https://hdlbits.01xz.net/wiki/exams/m2014_q3"
        },
        {
          "title": "Karnaugh map",
          "url": "https://hdlbits.01xz.net/wiki/exams/2012_q1g"
        },
        {
          "title": "K-map implemented with a multiplexer",
          "url": "https://hdlbits.01xz.net/wiki/exams/ece241_2014_q3"
        }
      ]
    },
    {
      "id": "circuits-sequential-logic-latches-and-flip-flops",
      "area": "Circuits",
      "group": "Sequential Logic",
      "title": "Latches and Flip-Flops",
      "summary": "Review sequential storage primitives, reset styles, enables, edge detection, and register composition.",
      "focus": [
        "DFF templates",
        "sync vs async reset",
        "reset values",
        "clock enable",
        "edge detection",
        "byte enable"
      ],
      "pitfalls": [
        "Incorrect sensitivity list for async reset",
        "Forgetting previous-state register for edge detection"
      ],
      "problems": [
        {
          "title": "D flip-flop",
          "url": "https://hdlbits.01xz.net/wiki/dff"
        },
        {
          "title": "D flip-flops",
          "url": "https://hdlbits.01xz.net/wiki/dff8"
        },
        {
          "title": "DFF with reset",
          "url": "https://hdlbits.01xz.net/wiki/dff8r"
        },
        {
          "title": "DFF with reset value",
          "url": "https://hdlbits.01xz.net/wiki/dff8p"
        },
        {
          "title": "DFF with asynchronous reset",
          "url": "https://hdlbits.01xz.net/wiki/dff8ar"
        },
        {
          "title": "DFF with byte enable",
          "url": "https://hdlbits.01xz.net/wiki/dff16e"
        },
        {
          "title": "D Latch",
          "url": "https://hdlbits.01xz.net/wiki/exams/m2014_q4a"
        },
        {
          "title": "DFF",
          "url": "https://hdlbits.01xz.net/wiki/exams/m2014_q4b"
        },
        {
          "title": "DFF",
          "url": "https://hdlbits.01xz.net/wiki/exams/m2014_q4c"
        },
        {
          "title": "DFF+gate",
          "url": "https://hdlbits.01xz.net/wiki/exams/m2014_q4d"
        },
        {
          "title": "Mux and DFF",
          "url": "https://hdlbits.01xz.net/wiki/mt2015_muxdff"
        },
        {
          "title": "Mux and DFF",
          "url": "https://hdlbits.01xz.net/wiki/exams/2014_q4a"
        },
        {
          "title": "DFFs and gates",
          "url": "https://hdlbits.01xz.net/wiki/exams/ece241_2014_q4"
        },
        {
          "title": "Create circuit from truth table",
          "url": "https://hdlbits.01xz.net/wiki/exams/ece241_2013_q7"
        },
        {
          "title": "Detect an edge",
          "url": "https://hdlbits.01xz.net/wiki/edgedetect"
        },
        {
          "title": "Detect both edges",
          "url": "https://hdlbits.01xz.net/wiki/edgedetect2"
        },
        {
          "title": "Edge capture register",
          "url": "https://hdlbits.01xz.net/wiki/edgecapture"
        },
        {
          "title": "Dual-edge triggered flip-flop",
          "url": "https://hdlbits.01xz.net/wiki/dualedge"
        }
      ]
    },
    {
      "id": "circuits-sequential-logic-counters",
      "area": "Circuits",
      "group": "Sequential Logic",
      "title": "Counters",
      "summary": "Review counter enable/reset/load behavior, terminal counts, decimal counters, and timekeeping-style control.",
      "focus": [
        "mod-N counters",
        "enable gating",
        "terminal rollover",
        "BCD counters",
        "multi-digit carry enables"
      ],
      "pitfalls": [
        "Rollover off by one",
        "Reset priority not matching the spec"
      ],
      "problems": [
        {
          "title": "Four-bit binary counter",
          "url": "https://hdlbits.01xz.net/wiki/count15"
        },
        {
          "title": "Decade counter",
          "url": "https://hdlbits.01xz.net/wiki/count10"
        },
        {
          "title": "Decade counter again",
          "url": "https://hdlbits.01xz.net/wiki/count1to10"
        },
        {
          "title": "Slow decade counter",
          "url": "https://hdlbits.01xz.net/wiki/countslow"
        },
        {
          "title": "Counter 1-12",
          "url": "https://hdlbits.01xz.net/wiki/exams/ece241_2014_q7a"
        },
        {
          "title": "Counter 1000",
          "url": "https://hdlbits.01xz.net/wiki/exams/ece241_2014_q7b"
        },
        {
          "title": "4-digit decimal counter",
          "url": "https://hdlbits.01xz.net/wiki/countbcd"
        },
        {
          "title": "12-hour clock",
          "url": "https://hdlbits.01xz.net/wiki/count_clock"
        }
      ]
    },
    {
      "id": "circuits-sequential-logic-shift-registers",
      "area": "Circuits",
      "group": "Sequential Logic",
      "title": "Shift Registers",
      "summary": "Review serial/parallel shifting, rotation, arithmetic shift behavior, LFSRs, and small lookup structures.",
      "focus": [
        "left/right shift",
        "rotate vs shift",
        "arithmetic sign fill",
        "LFSR feedback taps",
        "parallel load"
      ],
      "pitfalls": [
        "Losing sign bit on arithmetic shift",
        "Wrong feedback polynomial or bit order in LFSR"
      ],
      "problems": [
        {
          "title": "4-bit shift register",
          "url": "https://hdlbits.01xz.net/wiki/shift4"
        },
        {
          "title": "Left/right rotator",
          "url": "https://hdlbits.01xz.net/wiki/rotate100"
        },
        {
          "title": "Left/right arithmetic shift by 1 or 8",
          "url": "https://hdlbits.01xz.net/wiki/shift18"
        },
        {
          "title": "5-bit LFSR",
          "url": "https://hdlbits.01xz.net/wiki/lfsr5"
        },
        {
          "title": "3-bit LFSR",
          "url": "https://hdlbits.01xz.net/wiki/mt2015_lfsr"
        },
        {
          "title": "32-bit LFSR",
          "url": "https://hdlbits.01xz.net/wiki/lfsr32"
        },
        {
          "title": "Shift register",
          "url": "https://hdlbits.01xz.net/wiki/exams/m2014_q4k"
        },
        {
          "title": "Shift register",
          "url": "https://hdlbits.01xz.net/wiki/exams/2014_q4b"
        },
        {
          "title": "3-input LUT",
          "url": "https://hdlbits.01xz.net/wiki/exams/ece241_2013_q12"
        }
      ]
    },
    {
      "id": "circuits-sequential-logic-more-circuits",
      "area": "Circuits",
      "group": "Sequential Logic",
      "title": "More Circuits",
      "summary": "Review rule-based sequential updates and state encoded by vectors, including cellular automata style circuits.",
      "focus": [
        "neighbor-dependent next state",
        "wide register updates",
        "boundary handling"
      ],
      "pitfalls": [
        "Updating cells in-place instead of from the previous generation",
        "Boundary cells using the wrong neighbor convention"
      ],
      "problems": [
        {
          "title": "Rule 90",
          "url": "https://hdlbits.01xz.net/wiki/rule90"
        },
        {
          "title": "Rule 110",
          "url": "https://hdlbits.01xz.net/wiki/rule110"
        },
        {
          "title": "Conway's Game of Life 16x16",
          "url": "https://hdlbits.01xz.net/wiki/conwaylife"
        }
      ]
    },
    {
      "id": "circuits-sequential-logic-finite-state-machines",
      "area": "Circuits",
      "group": "Sequential Logic",
      "title": "Finite State Machines",
      "summary": "Review FSM partitioning, state encoding, output timing, Moore/Mealy differences, and datapath integration.",
      "focus": [
        "state register and next-state logic separation",
        "Moore vs Mealy outputs",
        "one-hot equations",
        "sequence detectors",
        "serial receivers",
        "FSM plus datapath"
      ],
      "pitfalls": [
        "Missing default next state",
        "Output asserted in the wrong state or cycle",
        "Reset state not specified cleanly"
      ],
      "problems": [
        {
          "title": "Simple FSM 1 (asynchronous reset)",
          "url": "https://hdlbits.01xz.net/wiki/fsm1"
        },
        {
          "title": "Simple FSM 1 (synchronous reset)",
          "url": "https://hdlbits.01xz.net/wiki/fsm1s"
        },
        {
          "title": "Simple FSM 2 (asynchronous reset)",
          "url": "https://hdlbits.01xz.net/wiki/fsm2"
        },
        {
          "title": "Simple FSM 2 (synchronous reset)",
          "url": "https://hdlbits.01xz.net/wiki/fsm2s"
        },
        {
          "title": "Simple state transitions 3",
          "url": "https://hdlbits.01xz.net/wiki/fsm3comb"
        },
        {
          "title": "Simple one-hot state transitions 3",
          "url": "https://hdlbits.01xz.net/wiki/fsm3onehot"
        },
        {
          "title": "Simple FSM 3 (asynchronous reset)",
          "url": "https://hdlbits.01xz.net/wiki/fsm3"
        },
        {
          "title": "Simple FSM 3 (synchronous reset)",
          "url": "https://hdlbits.01xz.net/wiki/fsm3s"
        },
        {
          "title": "Design a Moore FSM",
          "url": "https://hdlbits.01xz.net/wiki/exams/ece241_2013_q4"
        },
        {
          "title": "Lemmings 1",
          "url": "https://hdlbits.01xz.net/wiki/lemmings1"
        },
        {
          "title": "Lemmings 2",
          "url": "https://hdlbits.01xz.net/wiki/lemmings2"
        },
        {
          "title": "Lemmings 3",
          "url": "https://hdlbits.01xz.net/wiki/lemmings3"
        },
        {
          "title": "Lemmings 4",
          "url": "https://hdlbits.01xz.net/wiki/lemmings4"
        },
        {
          "title": "One-hot FSM",
          "url": "https://hdlbits.01xz.net/wiki/fsm_onehot"
        },
        {
          "title": "PS/2 packet parser",
          "url": "https://hdlbits.01xz.net/wiki/fsm_ps2"
        },
        {
          "title": "PS/2 packet parser and datapath",
          "url": "https://hdlbits.01xz.net/wiki/fsm_ps2data"
        },
        {
          "title": "Serial receiver",
          "url": "https://hdlbits.01xz.net/wiki/fsm_serial"
        },
        {
          "title": "Serial receiver and datapath",
          "url": "https://hdlbits.01xz.net/wiki/fsm_serialdata"
        },
        {
          "title": "Serial receiver with parity checking",
          "url": "https://hdlbits.01xz.net/wiki/fsm_serialdp"
        },
        {
          "title": "Sequence recognition",
          "url": "https://hdlbits.01xz.net/wiki/fsm_hdlc"
        },
        {
          "title": "Q8: Design a Mealy FSM",
          "url": "https://hdlbits.01xz.net/wiki/exams/ece241_2013_q8"
        },
        {
          "title": "Q5a: Serial two's complementer (Moore FSM)",
          "url": "https://hdlbits.01xz.net/wiki/exams/ece241_2014_q5a"
        },
        {
          "title": "Q5b: Serial two's complementer (Mealy FSM)",
          "url": "https://hdlbits.01xz.net/wiki/exams/ece241_2014_q5b"
        },
        {
          "title": "Q3a: FSM",
          "url": "https://hdlbits.01xz.net/wiki/exams/2014_q3fsm"
        },
        {
          "title": "Q3b: FSM",
          "url": "https://hdlbits.01xz.net/wiki/exams/2014_q3bfsm"
        },
        {
          "title": "Q3c: FSM logic",
          "url": "https://hdlbits.01xz.net/wiki/exams/2014_q3c"
        },
        {
          "title": "Q6b: FSM next-state logic",
          "url": "https://hdlbits.01xz.net/wiki/exams/m2014_q6b"
        },
        {
          "title": "Q6c: FSM one-hot next-state logic",
          "url": "https://hdlbits.01xz.net/wiki/exams/m2014_q6c"
        },
        {
          "title": "Q6: FSM",
          "url": "https://hdlbits.01xz.net/wiki/exams/m2014_q6"
        },
        {
          "title": "Q2a: FSM",
          "url": "https://hdlbits.01xz.net/wiki/exams/2012_q2fsm"
        },
        {
          "title": "Q2b: One-hot FSM equations",
          "url": "https://hdlbits.01xz.net/wiki/exams/2012_q2b"
        },
        {
          "title": "Q2a: FSM",
          "url": "https://hdlbits.01xz.net/wiki/exams/2013_q2afsm"
        },
        {
          "title": "Q2b: Another FSM",
          "url": "https://hdlbits.01xz.net/wiki/exams/2013_q2bfsm"
        }
      ]
    },
    {
      "id": "circuits-building-larger-circuits-building-larger-circuits",
      "area": "Circuits",
      "group": "Building Larger Circuits",
      "title": "Building Larger Circuits",
      "summary": "Review combining counters, shift registers, FSM controllers, and datapaths into complete multi-cycle designs.",
      "focus": [
        "controller/datapath split",
        "multi-cycle sequencing",
        "timer control",
        "one-hot control equations"
      ],
      "pitfalls": [
        "Control and datapath becoming misaligned",
        "Not defining done/valid timing precisely"
      ],
      "problems": [
        {
          "title": "Counter with period 1000",
          "url": "https://hdlbits.01xz.net/wiki/exams/review2015_count1k"
        },
        {
          "title": "4-bit shift register and down counter",
          "url": "https://hdlbits.01xz.net/wiki/exams/review2015_shiftcount"
        },
        {
          "title": "FSM: Sequence 1101 recognizer",
          "url": "https://hdlbits.01xz.net/wiki/exams/review2015_fsmseq"
        },
        {
          "title": "FSM: Enable shift register",
          "url": "https://hdlbits.01xz.net/wiki/exams/review2015_fsmshift"
        },
        {
          "title": "FSM: The complete FSM",
          "url": "https://hdlbits.01xz.net/wiki/exams/review2015_fsm"
        },
        {
          "title": "The complete timer",
          "url": "https://hdlbits.01xz.net/wiki/exams/review2015_fancytimer"
        },
        {
          "title": "FSM: One-hot logic equations",
          "url": "https://hdlbits.01xz.net/wiki/exams/review2015_fsmonehot"
        }
      ]
    },
    {
      "id": "verification-reading-simulations-finding-bugs-in-code-finding-bugs-in-code",
      "area": "Verification: Reading Simulations",
      "group": "Finding bugs in code",
      "title": "Finding bugs in code",
      "summary": "Review simulation-driven debugging by comparing intent, waveforms, and broken Verilog snippets.",
      "focus": [
        "read failing behavior from code",
        "spot mux/case/adder bugs",
        "fix missing defaults and wrong operators"
      ],
      "pitfalls": [
        "Changing the interface while fixing logic",
        "Fixing symptoms instead of the broken invariant"
      ],
      "problems": [
        {
          "title": "Mux",
          "url": "https://hdlbits.01xz.net/wiki/bugs_mux2"
        },
        {
          "title": "NAND",
          "url": "https://hdlbits.01xz.net/wiki/bugs_nand3"
        },
        {
          "title": "Mux",
          "url": "https://hdlbits.01xz.net/wiki/bugs_mux4"
        },
        {
          "title": "Add/sub",
          "url": "https://hdlbits.01xz.net/wiki/bugs_addsubz"
        },
        {
          "title": "Case statement",
          "url": "https://hdlbits.01xz.net/wiki/bugs_case"
        }
      ]
    },
    {
      "id": "verification-reading-simulations-build-a-circuit-from-a-simulation-waveform-build-a-circuit-from-a-simulation-waveform",
      "area": "Verification: Reading Simulations",
      "group": "Build a circuit from a simulation waveform",
      "title": "Build a circuit from a simulation waveform",
      "summary": "Review deriving combinational or sequential behavior from observed waveforms.",
      "focus": [
        "infer input-output relationship",
        "detect registered behavior",
        "identify edge-triggered updates",
        "translate waveform timing into RTL"
      ],
      "pitfalls": [
        "Assuming combinational behavior when output is registered",
        "Ignoring reset or initial state in the waveform"
      ],
      "problems": [
        {
          "title": "Combinational circuit 1",
          "url": "https://hdlbits.01xz.net/wiki/sim/circuit1"
        },
        {
          "title": "Combinational circuit 2",
          "url": "https://hdlbits.01xz.net/wiki/sim/circuit2"
        },
        {
          "title": "Combinational circuit 3",
          "url": "https://hdlbits.01xz.net/wiki/sim/circuit3"
        },
        {
          "title": "Combinational circuit 4",
          "url": "https://hdlbits.01xz.net/wiki/sim/circuit4"
        },
        {
          "title": "Combinational circuit 5",
          "url": "https://hdlbits.01xz.net/wiki/sim/circuit5"
        },
        {
          "title": "Combinational circuit 6",
          "url": "https://hdlbits.01xz.net/wiki/sim/circuit6"
        },
        {
          "title": "Sequential circuit 7",
          "url": "https://hdlbits.01xz.net/wiki/sim/circuit7"
        },
        {
          "title": "Sequential circuit 8",
          "url": "https://hdlbits.01xz.net/wiki/sim/circuit8"
        },
        {
          "title": "Sequential circuit 9",
          "url": "https://hdlbits.01xz.net/wiki/sim/circuit9"
        },
        {
          "title": "Sequential circuit 10",
          "url": "https://hdlbits.01xz.net/wiki/sim/circuit10"
        }
      ]
    },
    {
      "id": "verification-writing-testbenches-verification-writing-testbenches",
      "area": "Verification: Writing Testbenches",
      "group": "",
      "title": "Verification: Writing Testbenches",
      "summary": "Review non-synthesizable testbench structure for clocks, stimulus, expected behavior, and simple checkers.",
      "focus": [
        "initial blocks",
        "clock generation",
        "stimulus timing",
        "self-checking assertions or if checks"
      ],
      "pitfalls": [
        "Driving DUT inputs on the same edge being sampled",
        "No expected-value check beyond waveform inspection"
      ],
      "problems": [
        {
          "title": "Clock",
          "url": "https://hdlbits.01xz.net/wiki/tb/clock"
        },
        {
          "title": "Testbench1",
          "url": "https://hdlbits.01xz.net/wiki/tb/tb1"
        },
        {
          "title": "AND gate",
          "url": "https://hdlbits.01xz.net/wiki/tb/and"
        },
        {
          "title": "Testbench2",
          "url": "https://hdlbits.01xz.net/wiki/tb/tb2"
        },
        {
          "title": "T flip-flop",
          "url": "https://hdlbits.01xz.net/wiki/tb/tff"
        }
      ]
    },
    {
      "id": "cs450-cs450",
      "area": "CS450",
      "group": "",
      "title": "CS450",
      "summary": "Review larger course-style designs that combine datapath state, counters, memories, and prediction/history structures.",
      "focus": [
        "multi-module decomposition",
        "state/history tracking",
        "counter updates",
        "larger sequential design reasoning"
      ],
      "pitfalls": [
        "Unclear update priority",
        "Missing reset or history initialization"
      ],
      "problems": [
        {
          "title": "CS450 timer",
          "url": "https://hdlbits.01xz.net/wiki/cs450/timer"
        },
        {
          "title": "CS450 2-bit counter",
          "url": "https://hdlbits.01xz.net/wiki/cs450/counter_2bc"
        },
        {
          "title": "CS450 history shift register",
          "url": "https://hdlbits.01xz.net/wiki/cs450/history_shift"
        },
        {
          "title": "CS450 gshare branch predictor",
          "url": "https://hdlbits.01xz.net/wiki/cs450/gshare"
        }
      ]
    }
  ]
} satisfies HdlbitsReviewSource;
