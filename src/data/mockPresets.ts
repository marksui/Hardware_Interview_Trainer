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
      "Practice-only mock based on the provided interview tips: resume discussion, scripting mindset, Verilog writing, general problem solving, SoC methodology, RTL quality checks, CDC, clocks, reset, and latency.",
    focus: [
      "Verilog writing",
      "Scripting mindset",
      "RTL quality",
      "CDC",
      "Clocks/reset",
      "Latency",
      "SoC methodology",
    ],
    questionIds: [
      "vc-001",
      "vc-002",
      "vc-005",
      "vc-008",
      "vc-009",
      "rtl-007",
      "rtl-009",
      "cdc-007",
      "cdc-010",
      "rtc-010",
      "rtc-011",
      "sta-003",
    ],
  },
];
