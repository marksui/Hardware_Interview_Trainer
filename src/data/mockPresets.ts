export interface MockPreset {
  id: string;
  company: string;
  role: string;
  requisition: string;
  name: string;
  description: string;
  focus: string[];
  questionIds: string[];
}

export const mockPresets: MockPreset[] = [
  {
    id: "nvidia-jr20011787-asic-hardware-design-engineer",
    company: "NVIDIA",
    role: "ASIC Hardware Design Engineer",
    requisition: "JR20011787",
    name: "NVIDIA ASIC Hardware Design Engineer",
    description:
      "Practice-only mock based on the provided interview tips: Verilog writing, performance counters, latency monitors, CDC building blocks, FIFOs, arbiters, datapaths, and timing-aware RTL tradeoffs.",
    focus: [
      "Verilog writing",
      "Performance counters",
      "Latency monitors",
      "CDC",
      "FIFOs",
      "Arbiters",
      "Adder trees",
      "MAC datapaths",
    ],
    questionIds: [
      "nvc-001",
      "nvc-002",
      "nvc-003",
      "nvc-004",
      "nvc-005",
      "nvc-006",
      "nvc-007",
      "nvc-008",
      "nvc-009",
      "nvc-010",
      "nvc-011",
      "nvc-012",
      "nvc-013",
      "nvc-014",
      "nvc-015",
      "nvc-016",
      "nvc-017",
      "nvc-018",
    ],
  },
];
