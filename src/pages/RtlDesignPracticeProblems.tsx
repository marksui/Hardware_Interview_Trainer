import { CheckCircle2, Cpu, FileCode2, TestTube2 } from "lucide-react";
import { RichText } from "../components/RichText";

function rtl(source: string) {
  return `\`\`\`systemverilog
${source.trim()}
\`\`\``;
}

const practiceProblems = [
  {
    title: "Fixed Priority Arbiter: LSB Highest",
    problem:
      "RTL for a fixed priority arbiter with decreasing priority from LSB to MSB.",
    answer:
      "Request bit 0 has highest priority. Scan upward, grant the first asserted request, and keep all higher-index requests masked once a winner is found.",
    code: rtl(`
module fixed_pri_arb_lsb #(
  parameter int N = 8,
  parameter int IDX_W = (N <= 2) ? 1 : $clog2(N)
) (
  input  logic [N-1:0]     req,
  output logic [N-1:0]     gnt,
  output logic             gnt_valid,
  output logic [IDX_W-1:0] gnt_idx
);
  always_comb begin
    gnt       = '0;
    gnt_valid = 1'b0;
    gnt_idx   = '0;

    for (int i = 0; i < N; i++) begin
      if (!gnt_valid && req[i]) begin
        gnt[i]    = 1'b1;
        gnt_idx   = IDX_W'(i);
        gnt_valid = 1'b1;
      end
    end
  end
endmodule
`),
    tags: ["arbiter", "priority", "combinational"],
  },
  {
    title: "Fixed Priority Arbiter: MSB Highest",
    problem:
      "RTL for a fixed priority arbiter with decreasing priority from MSB to LSB.",
    answer:
      "The most significant request has highest priority. The logic is the same fixed-priority pattern, but the scan order runs from MSB down to LSB.",
    code: rtl(`
module fixed_pri_arb_msb #(
  parameter int N = 8,
  parameter int IDX_W = (N <= 2) ? 1 : $clog2(N)
) (
  input  logic [N-1:0]     req,
  output logic [N-1:0]     gnt,
  output logic             gnt_valid,
  output logic [IDX_W-1:0] gnt_idx
);
  always_comb begin
    gnt       = '0;
    gnt_valid = 1'b0;
    gnt_idx   = '0;

    for (int i = N - 1; i >= 0; i--) begin
      if (!gnt_valid && req[i]) begin
        gnt[i]    = 1'b1;
        gnt_idx   = IDX_W'(i);
        gnt_valid = 1'b1;
      end
    end
  end
endmodule
`),
    tags: ["arbiter", "priority", "one-hot"],
  },
  {
    title: "3-Request Round-Robin Arbiter",
    problem: "Implement a Round-Robin Arbiter with 3 input requests.",
    answer:
      "Keep a rotating pointer. Search from that pointer, wrap around, and update the pointer to the slot after the granted requester.",
    code: rtl(`
module rr_arbiter_3 (
  input  logic       clk,
  input  logic       rst_n,
  input  logic [2:0] req,
  output logic [2:0] gnt,
  output logic       gnt_valid
);
  logic [1:0] ptr_q, ptr_d;
  logic [1:0] win_idx;

  always_comb begin
    gnt       = 3'b000;
    gnt_valid = 1'b0;
    win_idx   = ptr_q;

    for (int offset = 0; offset < 3; offset++) begin
      int idx;
      idx = (ptr_q + offset) % 3;
      if (!gnt_valid && req[idx]) begin
        gnt[idx]   = 1'b1;
        win_idx    = idx[1:0];
        gnt_valid  = 1'b1;
      end
    end

    ptr_d = ptr_q;
    if (gnt_valid) begin
      ptr_d = (win_idx == 2'd2) ? 2'd0 : win_idx + 2'd1;
    end
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) ptr_q <= 2'd0;
    else        ptr_q <= ptr_d;
  end
endmodule
`),
    tags: ["arbiter", "fairness", "state"],
  },
  {
    title: "Synchronous FIFO",
    problem: "RTL design for a synchronous FIFO buffer for generic depth.",
    answer:
      "Use memory, read/write pointers, and an occupancy counter. Simultaneous read/write keeps occupancy stable when both operations are legal.",
    code: rtl(`
module sync_fifo #(
  parameter int WIDTH = 32,
  parameter int DEPTH = 16,
  parameter int ADDR_W = $clog2(DEPTH)
) (
  input  logic             clk,
  input  logic             rst_n,
  input  logic             wr_valid,
  output logic             wr_ready,
  input  logic [WIDTH-1:0] wr_data,
  input  logic             rd_ready,
  output logic             rd_valid,
  output logic [WIDTH-1:0] rd_data,
  output logic             full,
  output logic             empty
);
  logic [WIDTH-1:0] mem [DEPTH];
  logic [ADDR_W-1:0] wr_ptr_q, rd_ptr_q;
  logic [ADDR_W:0]   count_q;
  localparam logic [ADDR_W:0] DEPTH_COUNT = DEPTH;

  wire wr_fire = wr_valid && wr_ready;
  wire rd_fire = rd_valid && rd_ready;

  assign full     = (count_q == DEPTH_COUNT);
  assign empty    = (count_q == '0);
  assign wr_ready = !full || rd_fire;
  assign rd_valid = !empty;
  assign rd_data  = mem[rd_ptr_q];

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      wr_ptr_q <= '0;
      rd_ptr_q <= '0;
      count_q  <= '0;
    end else begin
      if (wr_fire) begin
        mem[wr_ptr_q] <= wr_data;
        wr_ptr_q <= (wr_ptr_q == DEPTH-1) ? '0 : wr_ptr_q + 1'b1;
      end
      if (rd_fire) begin
        rd_ptr_q <= (rd_ptr_q == DEPTH-1) ? '0 : rd_ptr_q + 1'b1;
      end

      unique case ({wr_fire, rd_fire})
        2'b10: count_q <= count_q + 1'b1;
        2'b01: count_q <= count_q - 1'b1;
        default: count_q <= count_q;
      endcase
    end
  end
endmodule
`),
    tags: ["fifo", "buffer", "pointers"],
  },
  {
    title: "High-Speed FIFO Flags",
    problem:
      "Improve FIFO for high speed with registered flags and registered read. What additional logic is needed to still write and read to the same address in consecutive cycles?",
    answer:
      "Register the output data and flags, compute next flags from next count, and add a bypass for the empty read/write collision case.",
    code: rtl(`
module fast_fifo #(
  parameter int WIDTH = 32,
  parameter int DEPTH = 16,
  parameter int ADDR_W = $clog2(DEPTH)
) (
  input  logic             clk,
  input  logic             rst_n,
  input  logic             wr_valid,
  output logic             wr_ready,
  input  logic [WIDTH-1:0] wr_data,
  input  logic             rd_ready,
  output logic             rd_valid,
  output logic [WIDTH-1:0] rd_data,
  output logic             full,
  output logic             empty
);
  logic [WIDTH-1:0] mem [DEPTH];
  logic [ADDR_W-1:0] wr_ptr_q, rd_ptr_q;
  logic [ADDR_W:0] count_q, count_d;
  logic [WIDTH-1:0] rd_data_q;
  logic rd_valid_q;
  localparam logic [ADDR_W:0] DEPTH_COUNT = DEPTH;

  wire wr_fire = wr_valid && wr_ready;
  wire rd_fire = rd_valid_q && rd_ready;
  wire bypass_empty_push = empty && wr_fire && rd_ready;

  assign wr_ready = !full || rd_fire;
  assign rd_valid = rd_valid_q;
  assign rd_data  = rd_data_q;

  always_comb begin
    count_d = count_q;
    unique case ({wr_fire, rd_fire})
      2'b10: count_d = count_q + 1'b1;
      2'b01: count_d = count_q - 1'b1;
      default: count_d = count_q;
    endcase
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      wr_ptr_q   <= '0;
      rd_ptr_q   <= '0;
      count_q    <= '0;
      full       <= 1'b0;
      empty      <= 1'b1;
      rd_valid_q <= 1'b0;
      rd_data_q  <= '0;
    end else begin
      count_q <= count_d;
      full    <= (count_d == DEPTH_COUNT);
      empty   <= (count_d == '0);

      if (wr_fire && !bypass_empty_push) begin
        mem[wr_ptr_q] <= wr_data;
        wr_ptr_q <= (wr_ptr_q == DEPTH-1) ? '0 : wr_ptr_q + 1'b1;
      end

      if (bypass_empty_push) begin
        rd_data_q  <= wr_data;
        rd_valid_q <= 1'b1;
      end else if (rd_fire) begin
        rd_ptr_q <= (rd_ptr_q == DEPTH-1) ? '0 : rd_ptr_q + 1'b1;
        if (count_d != '0) begin
          rd_data_q  <= mem[(rd_ptr_q == DEPTH-1) ? '0 : rd_ptr_q + 1'b1];
          rd_valid_q <= 1'b1;
        end else begin
          rd_valid_q <= 1'b0;
        end
      end else if (!rd_valid_q && count_q != '0) begin
        rd_data_q  <= mem[rd_ptr_q];
        rd_valid_q <= 1'b1;
      end
    end
  end
endmodule
`),
    tags: ["fifo", "timing", "bypass"],
  },
  {
    title: "Reorder Buffer",
    problem: "Micro-architect a reorder buffer (ROB) and write RTL for it.",
    answer:
      "A compact ROB is a circular queue. Allocate at tail, write back by ROB index, and commit in order from head.",
    code: rtl(`
module reorder_buffer #(
  parameter int ENTRIES = 16,
  parameter int DATA_W = 32,
  parameter int DEST_W = 5,
  parameter int IDX_W = $clog2(ENTRIES)
) (
  input  logic              clk,
  input  logic              rst_n,
  input  logic              flush,

  input  logic              alloc_valid,
  output logic              alloc_ready,
  input  logic [DEST_W-1:0] alloc_dest,
  output logic [IDX_W-1:0]  alloc_idx,

  input  logic              wb_valid,
  input  logic [IDX_W-1:0]  wb_idx,
  input  logic [DATA_W-1:0] wb_data,
  input  logic              wb_exception,

  output logic              commit_valid,
  input  logic              commit_ready,
  output logic [DEST_W-1:0] commit_dest,
  output logic [DATA_W-1:0] commit_data,
  output logic              commit_exception
);
  typedef struct packed {
    logic              valid;
    logic              done;
    logic [DEST_W-1:0] dest;
    logic [DATA_W-1:0] data;
    logic              exception;
  } rob_entry_t;

  rob_entry_t rob [ENTRIES];
  logic [IDX_W-1:0] head_q, tail_q;
  logic [$clog2(ENTRIES+1)-1:0] count_q;

  assign alloc_ready = (count_q != ENTRIES);
  assign alloc_idx   = tail_q;

  assign commit_valid     = rob[head_q].valid && rob[head_q].done;
  assign commit_dest      = rob[head_q].dest;
  assign commit_data      = rob[head_q].data;
  assign commit_exception = rob[head_q].exception;

  function automatic logic [IDX_W-1:0] inc_ptr(input logic [IDX_W-1:0] ptr);
    return (ptr == ENTRIES-1) ? '0 : ptr + 1'b1;
  endfunction

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n || flush) begin
      head_q  <= '0;
      tail_q  <= '0;
      count_q <= '0;
      for (int i = 0; i < ENTRIES; i++) rob[i] <= '0;
    end else begin
      if (alloc_valid && alloc_ready) begin
        rob[tail_q].valid     <= 1'b1;
        rob[tail_q].done      <= 1'b0;
        rob[tail_q].dest      <= alloc_dest;
        rob[tail_q].data      <= '0;
        rob[tail_q].exception <= 1'b0;
        tail_q <= inc_ptr(tail_q);
      end

      if (wb_valid && rob[wb_idx].valid) begin
        rob[wb_idx].done      <= 1'b1;
        rob[wb_idx].data      <= wb_data;
        rob[wb_idx].exception <= wb_exception;
      end

      if (commit_valid && commit_ready) begin
        rob[head_q].valid <= 1'b0;
        rob[head_q].done  <= 1'b0;
        head_q <= inc_ptr(head_q);
      end

      unique case ({alloc_valid && alloc_ready, commit_valid && commit_ready})
        2'b10: count_q <= count_q + 1'b1;
        2'b01: count_q <= count_q - 1'b1;
        default: count_q <= count_q;
      endcase
    end
  end
endmodule
`),
    tags: ["microarchitecture", "rob", "cpu"],
  },
  {
    title: "Pulse Synchronizer",
    problem: "RTL and circuit for a pulse synchronization circuit.",
    answer:
      "Convert a source-domain pulse to a toggle, synchronize the toggle, then edge-detect the synchronized toggle.",
    code: rtl(`
module pulse_sync (
  input  logic clk_src,
  input  logic rst_src_n,
  input  logic pulse_src,
  input  logic clk_dst,
  input  logic rst_dst_n,
  output logic pulse_dst
);
  logic toggle_src;
  logic [2:0] toggle_dst;

  always_ff @(posedge clk_src or negedge rst_src_n) begin
    if (!rst_src_n)      toggle_src <= 1'b0;
    else if (pulse_src)  toggle_src <= ~toggle_src;
  end

  always_ff @(posedge clk_dst or negedge rst_dst_n) begin
    if (!rst_dst_n) toggle_dst <= 3'b000;
    else            toggle_dst <= {toggle_dst[1:0], toggle_src};
  end

  assign pulse_dst = toggle_dst[2] ^ toggle_dst[1];
endmodule
`),
    tags: ["cdc", "pulse", "toggle"],
  },
  {
    title: "Divisible-by-3 or Divisible-by-5 FSM",
    problem:
      "FSM design of a divisible by 3 or 5 logic for serial input. Assume input goes to the LSB of the previously seen number.",
    answer:
      "The FSM state is the current remainder. On each new bit, next_remainder = (2 * remainder + bit) % DIVISOR.",
    code: rtl(`
module serial_divisible #(
  parameter int DIVISOR = 3,
  parameter int REM_W = $clog2(DIVISOR)
) (
  input  logic clk,
  input  logic rst_n,
  input  logic in_valid,
  input  logic bit_in,
  output logic divisible
);
  logic [REM_W-1:0] rem_q, rem_d;

  always_comb begin
    rem_d = rem_q;
    if (in_valid) begin
      rem_d = (2 * rem_q + bit_in) % DIVISOR;
    end
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) rem_q <= '0;
    else        rem_q <= rem_d;
  end

  assign divisible = (rem_q == '0);
endmodule
`),
    tags: ["fsm", "modulo", "serial"],
  },
  {
    title: "Asynchronous FIFO",
    problem: "Asynchronous FIFO implementation details.",
    answer:
      "Use binary pointers locally, Gray-coded pointers across domains, two-flop pointer synchronizers, full in write domain, and empty in read domain.",
    code: rtl(`
module async_fifo #(
  parameter int WIDTH = 32,
  parameter int DEPTH = 16,
  parameter int ADDR_W = $clog2(DEPTH)
) (
  input  logic             wr_clk,
  input  logic             wr_rst_n,
  input  logic             wr_en,
  input  logic [WIDTH-1:0] wr_data,
  output logic             full,
  input  logic             rd_clk,
  input  logic             rd_rst_n,
  input  logic             rd_en,
  output logic [WIDTH-1:0] rd_data,
  output logic             empty
);
  logic [WIDTH-1:0] mem [DEPTH];
  logic [ADDR_W:0] wr_bin, wr_gray, wr_gray_next;
  logic [ADDR_W:0] rd_bin, rd_gray, rd_gray_next;
  logic [ADDR_W:0] rd_gray_w1, rd_gray_w2;
  logic [ADDR_W:0] wr_gray_r1, wr_gray_r2;

  function automatic logic [ADDR_W:0] bin2gray(input logic [ADDR_W:0] bin);
    return bin ^ (bin >> 1);
  endfunction

  assign wr_gray_next = bin2gray(wr_bin + (wr_en && !full));
  assign rd_gray_next = bin2gray(rd_bin + (rd_en && !empty));

  assign full = (wr_gray_next == {~rd_gray_w2[ADDR_W:ADDR_W-1],
                                  rd_gray_w2[ADDR_W-2:0]});
  assign empty = (rd_gray == wr_gray_r2);

  always_ff @(posedge wr_clk or negedge wr_rst_n) begin
    if (!wr_rst_n) begin
      wr_bin <= '0;
      wr_gray <= '0;
      rd_gray_w1 <= '0;
      rd_gray_w2 <= '0;
    end else begin
      rd_gray_w1 <= rd_gray;
      rd_gray_w2 <= rd_gray_w1;
      if (wr_en && !full) begin
        mem[wr_bin[ADDR_W-1:0]] <= wr_data;
        wr_bin  <= wr_bin + 1'b1;
        wr_gray <= bin2gray(wr_bin + 1'b1);
      end
    end
  end

  always_ff @(posedge rd_clk or negedge rd_rst_n) begin
    if (!rd_rst_n) begin
      rd_bin <= '0;
      rd_gray <= '0;
      wr_gray_r1 <= '0;
      wr_gray_r2 <= '0;
      rd_data <= '0;
    end else begin
      wr_gray_r1 <= wr_gray;
      wr_gray_r2 <= wr_gray_r1;
      if (rd_en && !empty) begin
        rd_data <= mem[rd_bin[ADDR_W-1:0]];
        rd_bin  <= rd_bin + 1'b1;
        rd_gray <= bin2gray(rd_bin + 1'b1);
      end
    end
  end
endmodule
`),
    tags: ["cdc", "async-fifo", "gray-code"],
  },
  {
    title: "Binary and Gray Conversion",
    problem: "RTL for binary to gray and gray to binary logic.",
    answer:
      "Binary to Gray is an XOR with a right shift. Gray to binary is a prefix XOR from MSB down.",
    code: rtl(`
module gray_codec #(
  parameter int W = 8
) (
  input  logic [W-1:0] bin_i,
  input  logic [W-1:0] gray_i,
  output logic [W-1:0] gray_o,
  output logic [W-1:0] bin_o
);
  assign gray_o = bin_i ^ (bin_i >> 1);

  always_comb begin
    bin_o[W-1] = gray_i[W-1];
    for (int i = W - 2; i >= 0; i--) begin
      bin_o[i] = bin_o[i+1] ^ gray_i[i];
    end
  end
endmodule
`),
    tags: ["gray-code", "conversion", "cdc"],
  },
  {
    title: "Gates Using 2-to-1 Muxes",
    problem: "Implement NAND, XOR, and NOT gate using 2-to-1 MUX.",
    answer:
      "Use Shannon decomposition. Pick one input as select and wire d0/d1 to constants or the other signal.",
    code: rtl(`
module mux_gates (
  input  logic a,
  input  logic b,
  output logic y_not,
  output logic y_xor,
  output logic y_nand
);
  function automatic logic mux2(input logic sel, input logic d0, input logic d1);
    return sel ? d1 : d0;
  endfunction

  assign y_not  = mux2(a, 1'b1, 1'b0);
  assign y_xor  = mux2(a, b, ~b);
  assign y_nand = mux2(a, 1'b1, ~b);
endmodule
`),
    tags: ["mux", "boolean", "shannon"],
  },
  {
    title: "4-to-1 Mux From 2-to-1 Muxes",
    problem: "Implement 4-to-1 MUX using 2-to-1 MUXs.",
    answer:
      "Build a two-level mux tree. sel[0] chooses inside each pair, and sel[1] chooses between pairs.",
    code: rtl(`
module mux4_from_mux2 #(
  parameter int W = 8
) (
  input  logic [W-1:0] d0,
  input  logic [W-1:0] d1,
  input  logic [W-1:0] d2,
  input  logic [W-1:0] d3,
  input  logic [1:0]   sel,
  output logic [W-1:0] y
);
  logic [W-1:0] lo, hi;

  assign lo = sel[0] ? d1 : d0;
  assign hi = sel[0] ? d3 : d2;
  assign y  = sel[1] ? hi : lo;
endmodule
`),
    tags: ["mux", "hierarchy", "combinational"],
  },
  {
    title: "4-Way Cache LRU",
    problem:
      "RTL design for an LRU cache replacement policy, consider a 4-way cache.",
    answer:
      "This uses an age matrix. age[i][j]=1 means way i is older than way j. Victim is the way older than all others, unless an invalid way exists.",
    code: rtl(`
module lru_4way (
  input  logic       clk,
  input  logic       rst_n,
  input  logic       access_valid,
  input  logic [1:0] access_way,
  input  logic [3:0] way_valid,
  output logic [1:0] victim_way
);
  logic [3:0][3:0] older_q;

  always_comb begin
    victim_way = 2'd0;
    if (!way_valid[0]) victim_way = 2'd0;
    else if (!way_valid[1]) victim_way = 2'd1;
    else if (!way_valid[2]) victim_way = 2'd2;
    else if (!way_valid[3]) victim_way = 2'd3;
    else begin
      for (int i = 0; i < 4; i++) begin
        if ((older_q[i] | (4'b0001 << i)) == 4'b1111) begin
          victim_way = i[1:0];
        end
      end
    end
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      older_q <= '0;
    end else if (access_valid) begin
      for (int i = 0; i < 4; i++) begin
        older_q[access_way][i] <= 1'b0;
        older_q[i][access_way] <= (i[1:0] != access_way);
      end
      older_q[access_way][access_way] <= 1'b0;
    end
  end
endmodule
`),
    tags: ["cache", "lru", "replacement"],
  },
  {
    title: "3-Input Sorting Logic",
    problem: "RTL for a 3-input sorting logic.",
    answer:
      "Use a three-compare sorting network. The outputs are minimum, middle, and maximum.",
    code: rtl(`
module sort3 #(
  parameter int W = 8
) (
  input  logic [W-1:0] a,
  input  logic [W-1:0] b,
  input  logic [W-1:0] c,
  output logic [W-1:0] min_o,
  output logic [W-1:0] mid_o,
  output logic [W-1:0] max_o
);
  logic [W-1:0] x0, x1, x2;
  logic [W-1:0] y0, y1, y2;

  always_comb begin
    if (a <= b) begin x0 = a; x1 = b; end
    else        begin x0 = b; x1 = a; end
    x2 = c;

    if (x1 <= x2) begin y1 = x1; y2 = x2; end
    else          begin y1 = x2; y2 = x1; end

    if (x0 <= y1) begin y0 = x0; mid_o = y1; end
    else          begin y0 = y1; mid_o = x0; end

    min_o = y0;
    max_o = y2;
  end
endmodule
`),
    tags: ["sorting", "compare-swap", "datapath"],
  },
  {
    title: "Three-Input Median",
    problem: "RTL for three input median circuit.",
    answer:
      "For vectors, sort three values and return the middle. For one-bit values, the median is majority logic.",
    code: rtl(`
module median3 #(
  parameter int W = 8
) (
  input  logic [W-1:0] a,
  input  logic [W-1:0] b,
  input  logic [W-1:0] c,
  output logic [W-1:0] median
);
  logic [W-1:0] min_unused, max_unused;

  sort3 #(.W(W)) u_sort3 (
    .a(a),
    .b(b),
    .c(c),
    .min_o(min_unused),
    .mid_o(median),
    .max_o(max_unused)
  );
endmodule

module majority3 (
  input  logic a,
  input  logic b,
  input  logic c,
  output logic y
);
  assign y = (a & b) | (a & c) | (b & c);
endmodule
`),
    tags: ["median", "majority", "datapath"],
  },
  {
    title: "Fibonacci and Factorial",
    problem: "RTL for Fibonacci and Factorial algorithm.",
    answer:
      "Both are small iterative datapaths wrapped by an FSM with start, busy, done, and result registers.",
    code: rtl(`
module fibonacci_iter #(
  parameter int N_W = 6,
  parameter int OUT_W = 32
) (
  input  logic clk,
  input  logic rst_n,
  input  logic start,
  input  logic [N_W-1:0] n,
  output logic busy,
  output logic done,
  output logic [OUT_W-1:0] result
);
  logic [N_W-1:0] count_q;
  logic [OUT_W-1:0] a_q, b_q;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      busy <= 1'b0; done <= 1'b0; result <= '0;
      count_q <= '0; a_q <= '0; b_q <= '0;
    end else begin
      done <= 1'b0;
      if (start && !busy) begin
        busy <= 1'b1;
        count_q <= n;
        a_q <= '0;
        b_q <= 1;
      end else if (busy) begin
        if (count_q == 0) begin
          result <= a_q;
          busy <= 1'b0;
          done <= 1'b1;
        end else begin
          a_q <= b_q;
          b_q <= a_q + b_q;
          count_q <= count_q - 1'b1;
        end
      end
    end
  end
endmodule

module factorial_iter #(
  parameter int N_W = 6,
  parameter int OUT_W = 32
) (
  input  logic clk,
  input  logic rst_n,
  input  logic start,
  input  logic [N_W-1:0] n,
  output logic busy,
  output logic done,
  output logic [OUT_W-1:0] result
);
  logic [N_W-1:0] i_q;
  logic [OUT_W-1:0] acc_q;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      busy <= 1'b0; done <= 1'b0; result <= '0;
      i_q <= '0; acc_q <= '0;
    end else begin
      done <= 1'b0;
      if (start && !busy) begin
        busy <= 1'b1;
        i_q <= n;
        acc_q <= 1;
      end else if (busy) begin
        if (i_q <= 1) begin
          result <= acc_q;
          busy <= 1'b0;
          done <= 1'b1;
        end else begin
          acc_q <= acc_q * i_q;
          i_q <= i_q - 1'b1;
        end
      end
    end
  end
endmodule
`),
    tags: ["fsm", "algorithm", "datapath"],
  },
  {
    title: "Clock Dividers 2, 3, 4, and 5",
    problem: "Design clock divider logic for divide by 2, 3, 4, 5.",
    answer:
      "A generic integer divider can count modulo DIVIDE and make the output high for HIGH_COUNT cycles. Odd divides are not 50 percent duty unless both edges are used.",
    code: rtl(`
module clock_divider #(
  parameter int DIVIDE = 4,
  parameter int HIGH_COUNT = DIVIDE / 2,
  parameter int CNT_W = $clog2(DIVIDE)
) (
  input  logic clk,
  input  logic rst_n,
  output logic clk_div
);
  logic [CNT_W-1:0] count_q;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      count_q <= '0;
      clk_div <= 1'b0;
    end else begin
      count_q <= (count_q == DIVIDE-1) ? '0 : count_q + 1'b1;
      clk_div <= (count_q < HIGH_COUNT);
    end
  end
endmodule

// Examples:
// divide by 2: clock_divider #(.DIVIDE(2), .HIGH_COUNT(1))
// divide by 3: clock_divider #(.DIVIDE(3), .HIGH_COUNT(1))
// divide by 4: clock_divider #(.DIVIDE(4), .HIGH_COUNT(2))
// divide by 5: clock_divider #(.DIVIDE(5), .HIGH_COUNT(2))
`),
    tags: ["clocking", "divider", "timing"],
  },
  {
    title: "Ready-Valid Downsizer",
    problem:
      "RTL ready-valid downsizer. A 16-bit input with ready/valid is sent at output 1 byte at a time. Both input and output use ready/valid.",
    answer:
      "Store each accepted 16-bit word, emit low byte then high byte, and hold output stable until out_ready.",
    code: rtl(`
module rv_downsizer_16_to_8 (
  input  logic        clk,
  input  logic        rst_n,
  input  logic        in_valid,
  output logic        in_ready,
  input  logic [15:0] in_data,
  output logic        out_valid,
  input  logic        out_ready,
  output logic [7:0]  out_data
);
  logic [15:0] data_q;
  logic        busy_q;
  logic        high_byte_q;

  assign in_ready  = !busy_q;
  assign out_valid = busy_q;
  assign out_data  = high_byte_q ? data_q[15:8] : data_q[7:0];

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      data_q <= '0;
      busy_q <= 1'b0;
      high_byte_q <= 1'b0;
    end else begin
      if (in_valid && in_ready) begin
        data_q <= in_data;
        busy_q <= 1'b1;
        high_byte_q <= 1'b0;
      end else if (out_valid && out_ready) begin
        if (!high_byte_q) begin
          high_byte_q <= 1'b1;
        end else begin
          busy_q <= 1'b0;
          high_byte_q <= 1'b0;
        end
      end
    end
  end
endmodule
`),
    tags: ["ready-valid", "downsizer", "protocol"],
  },
  {
    title: "CPU Pipeline Datapath",
    problem: "Datapath components for a typical 4/5 stage CPU pipeline.",
    answer:
      "This is a minimal five-stage skeleton showing PC, pipeline registers, ALU path, memory path, writeback, valid bits, stall, and flush hooks.",
    code: rtl(`
module simple_5stage_datapath #(
  parameter int XLEN = 32
) (
  input  logic clk,
  input  logic rst_n,
  input  logic stall,
  input  logic flush,
  output logic [XLEN-1:0] imem_addr,
  input  logic [31:0]     imem_rdata,
  output logic [XLEN-1:0] dmem_addr,
  output logic [XLEN-1:0] dmem_wdata,
  input  logic [XLEN-1:0] dmem_rdata
);
  typedef struct packed {
    logic valid;
    logic [XLEN-1:0] pc;
    logic [31:0] inst;
  } if_id_t;

  typedef struct packed {
    logic valid;
    logic [XLEN-1:0] pc;
    logic [XLEN-1:0] rs1;
    logic [XLEN-1:0] rs2;
    logic [XLEN-1:0] imm;
    logic [4:0] rd;
  } id_ex_t;

  typedef struct packed {
    logic valid;
    logic [XLEN-1:0] alu;
    logic [XLEN-1:0] store_data;
    logic [4:0] rd;
  } ex_mem_t;

  typedef struct packed {
    logic valid;
    logic [XLEN-1:0] wb_data;
    logic [4:0] rd;
  } mem_wb_t;

  logic [XLEN-1:0] pc_q;
  if_id_t if_id_q;
  id_ex_t id_ex_q;
  ex_mem_t ex_mem_q;
  mem_wb_t mem_wb_q;

  assign imem_addr = pc_q;
  assign dmem_addr = ex_mem_q.alu;
  assign dmem_wdata = ex_mem_q.store_data;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      pc_q <= '0;
      if_id_q <= '0;
      id_ex_q <= '0;
      ex_mem_q <= '0;
      mem_wb_q <= '0;
    end else if (!stall) begin
      if (flush) begin
        if_id_q.valid <= 1'b0;
        id_ex_q.valid <= 1'b0;
      end else begin
        pc_q <= pc_q + 4;
        if_id_q <= '{valid: 1'b1, pc: pc_q, inst: imem_rdata};

        // Decode/register-file/immediate logic would drive these fields.
        id_ex_q.valid <= if_id_q.valid;
        id_ex_q.pc    <= if_id_q.pc;
        id_ex_q.rs1   <= '0;
        id_ex_q.rs2   <= '0;
        id_ex_q.imm   <= '0;
        id_ex_q.rd    <= if_id_q.inst[11:7];

        ex_mem_q.valid      <= id_ex_q.valid;
        ex_mem_q.alu        <= id_ex_q.rs1 + id_ex_q.imm;
        ex_mem_q.store_data <= id_ex_q.rs2;
        ex_mem_q.rd         <= id_ex_q.rd;

        mem_wb_q.valid   <= ex_mem_q.valid;
        mem_wb_q.wb_data <= dmem_rdata;
        mem_wb_q.rd      <= ex_mem_q.rd;
      end
    end
  end
endmodule
`),
    tags: ["cpu", "pipeline", "datapath"],
  },
  {
    title: "11011 Sequence Detector",
    problem: "11011 sequence detector FSM.",
    answer:
      "States track the longest matched prefix. This version supports overlapping matches.",
    code: rtl(`
module seq_detect_11011 (
  input  logic clk,
  input  logic rst_n,
  input  logic bit_valid,
  input  logic bit_in,
  output logic match
);
  typedef enum logic [2:0] {
    S0, S1, S11, S110, S1101
  } state_t;

  state_t state_q, state_d;

  always_comb begin
    state_d = state_q;
    match = 1'b0;
    if (bit_valid) begin
      unique case (state_q)
        S0:    state_d = bit_in ? S1 : S0;
        S1:    state_d = bit_in ? S11 : S0;
        S11:   state_d = bit_in ? S11 : S110;
        S110:  state_d = bit_in ? S1101 : S0;
        S1101: begin
          if (bit_in) begin
            match = 1'b1;
            state_d = S11; // suffix "11" can start next match
          end else begin
            state_d = S0;
          end
        end
        default: state_d = S0;
      endcase
    end
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) state_q <= S0;
    else        state_q <= state_d;
  end
endmodule
`),
    tags: ["fsm", "sequence-detector", "overlap"],
  },
  {
    title: "First Set Bit and Popcount",
    problem:
      "RTL for a) the index of the first set bit in 32-bit input. b) Number of 1's in 32-bit input signal.",
    answer:
      "The first-set index is a priority encoder. Popcount is a balanced-ish sum tree over bits.",
    code: rtl(`
module bit_scan_popcount32 (
  input  logic [31:0] data_i,
  output logic        first_valid,
  output logic [4:0]  first_idx,
  output logic [5:0]  popcount
);
  always_comb begin
    first_valid = 1'b0;
    first_idx = '0;
    for (int i = 0; i < 32; i++) begin
      if (!first_valid && data_i[i]) begin
        first_valid = 1'b1;
        first_idx = i[4:0];
      end
    end
  end

  always_comb begin
    popcount = '0;
    for (int i = 0; i < 32; i++) begin
      popcount = popcount + data_i[i];
    end
  end
endmodule
`),
    tags: ["priority-encoder", "popcount", "adder-tree"],
  },
  {
    title: "Grayscale Average Without Division",
    problem:
      "Grayscale average conversion circuit without using division hardware. Inputs are 8-bit wide for the three channels.",
    answer:
      "Approximate divide by 3 with a constant multiply. (r+g+b)*85 >> 8 is small and close; widen the intermediate.",
    code: rtl(`
module grayscale_avg (
  input  logic [7:0] r,
  input  logic [7:0] g,
  input  logic [7:0] b,
  output logic [7:0] gray
);
  logic [9:0] sum;
  logic [17:0] scaled;

  assign sum = r + g + b;
  assign scaled = sum * 8'd85;
  assign gray = scaled[15:8];
endmodule
`),
    tags: ["image", "constant-multiply", "datapath"],
  },
  {
    title: "Divide-by-10 Clock, 40 Percent Duty",
    problem: "Clock divide by 10 with a duty cycle of 40 percent.",
    answer:
      "Count modulo 10. Drive output high for four counts and low for six counts.",
    code: rtl(`
module clk_div10_duty40 (
  input  logic clk,
  input  logic rst_n,
  output logic clk_div10
);
  logic [3:0] count_q;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      count_q <= 4'd0;
      clk_div10 <= 1'b0;
    end else begin
      count_q <= (count_q == 4'd9) ? 4'd0 : count_q + 4'd1;
      clk_div10 <= (count_q < 4'd4);
    end
  end
endmodule
`),
    tags: ["clock-divider", "duty-cycle", "counter"],
  },
  {
    title: "Synchronous FIFO SVAs",
    problem: "SVAs for synchronous FIFO - as many as possible.",
    answer:
      "Bind this checker to a FIFO with count, fires, flags, and reset visible. Add data-order scoreboard checks in the testbench.",
    code: rtl(`
module sync_fifo_sva #(
  parameter int DEPTH = 16,
  parameter int COUNT_W = $clog2(DEPTH + 1)
) (
  input logic clk,
  input logic rst_n,
  input logic wr_valid,
  input logic wr_ready,
  input logic rd_valid,
  input logic rd_ready,
  input logic full,
  input logic empty,
  input logic [COUNT_W-1:0] count
);
  wire wr_fire = wr_valid && wr_ready;
  wire rd_fire = rd_valid && rd_ready;

  assert property (@(posedge clk) disable iff (!rst_n)
    count <= DEPTH);

  assert property (@(posedge clk) disable iff (!rst_n)
    empty == (count == 0));

  assert property (@(posedge clk) disable iff (!rst_n)
    full == (count == DEPTH));

  assert property (@(posedge clk) disable iff (!rst_n)
    empty |-> !rd_valid);

  assert property (@(posedge clk) disable iff (!rst_n)
    full && !rd_fire |-> !wr_ready);

  assert property (@(posedge clk) disable iff (!rst_n)
    wr_fire && !rd_fire |=> count == $past(count) + 1);

  assert property (@(posedge clk) disable iff (!rst_n)
    rd_fire && !wr_fire |=> count == $past(count) - 1);

  assert property (@(posedge clk) disable iff (!rst_n)
    rd_fire && wr_fire |=> count == $past(count));
endmodule
`),
    tags: ["sva", "fifo", "verification"],
  },
  {
    title: "UART TX Interface",
    problem: "Using UART timing diagram, implement RTL for TX interface.",
    answer:
      "Baud tick drives an FSM: idle high, start bit, 8 data bits LSB first, stop bit. Input uses ready/valid.",
    code: rtl(`
module uart_tx #(
  parameter int CLKS_PER_BIT = 868
) (
  input  logic       clk,
  input  logic       rst_n,
  input  logic       in_valid,
  output logic       in_ready,
  input  logic [7:0] in_data,
  output logic       tx,
  output logic       busy
);
  typedef enum logic [1:0] {IDLE, START, DATA, STOP} state_t;
  state_t state_q;
  logic [$clog2(CLKS_PER_BIT)-1:0] baud_cnt_q;
  logic [2:0] bit_cnt_q;
  logic [7:0] shreg_q;

  wire baud_done = (baud_cnt_q == CLKS_PER_BIT-1);
  assign in_ready = (state_q == IDLE);
  assign busy = (state_q != IDLE);

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      state_q <= IDLE;
      baud_cnt_q <= '0;
      bit_cnt_q <= '0;
      shreg_q <= '0;
      tx <= 1'b1;
    end else begin
      if (state_q != IDLE) begin
        baud_cnt_q <= baud_done ? '0 : baud_cnt_q + 1'b1;
      end else begin
        baud_cnt_q <= '0;
      end

      unique case (state_q)
        IDLE: begin
          tx <= 1'b1;
          if (in_valid) begin
            shreg_q <= in_data;
            bit_cnt_q <= '0;
            state_q <= START;
            tx <= 1'b0;
          end
        end
        START: if (baud_done) begin
          state_q <= DATA;
          tx <= shreg_q[0];
        end
        DATA: if (baud_done) begin
          shreg_q <= {1'b0, shreg_q[7:1]};
          if (bit_cnt_q == 3'd7) begin
            state_q <= STOP;
            tx <= 1'b1;
          end else begin
            bit_cnt_q <= bit_cnt_q + 1'b1;
            tx <= shreg_q[1];
          end
        end
        STOP: if (baud_done) begin
          state_q <= IDLE;
          tx <= 1'b1;
        end
        default: state_q <= IDLE;
      endcase
    end
  end
endmodule
`),
    tags: ["uart", "serial", "fsm"],
  },
  {
    title: "NVIDIA Phone Screen: SRAM Memory Controller",
    problem:
      "You have to design a memory controller block for an SRAM. What interfaces would you use, how would you arbitrate requests, how many memory ports exist, and what other blocks should the controller contain?",
    answer:
      "A reasonable interview design uses multiple client request ports, a fairness arbiter, one SRAM command port, response routing, optional skid/FIFO buffering, error/status logic, and performance counters.",
    code: rtl(`
module sram_mem_controller #(
  parameter int ADDR_W = 12,
  parameter int DATA_W = 32,
  parameter int N_CLIENTS = 2,
  parameter int ID_W = $clog2(N_CLIENTS)
) (
  input  logic clk,
  input  logic rst_n,

  input  logic [N_CLIENTS-1:0]              req_valid,
  output logic [N_CLIENTS-1:0]              req_ready,
  input  logic [N_CLIENTS-1:0]              req_write,
  input  logic [N_CLIENTS-1:0][ADDR_W-1:0]  req_addr,
  input  logic [N_CLIENTS-1:0][DATA_W-1:0]  req_wdata,
  input  logic [N_CLIENTS-1:0][DATA_W/8-1:0] req_wstrb,

  output logic [N_CLIENTS-1:0]              rsp_valid,
  input  logic [N_CLIENTS-1:0]              rsp_ready,
  output logic [N_CLIENTS-1:0][DATA_W-1:0]  rsp_rdata,

  output logic                              sram_ce,
  output logic                              sram_we,
  output logic [ADDR_W-1:0]                 sram_addr,
  output logic [DATA_W-1:0]                 sram_wdata,
  output logic [DATA_W/8-1:0]               sram_wstrb,
  input  logic [DATA_W-1:0]                 sram_rdata
);
  logic [ID_W-1:0] rr_ptr_q, grant_id;
  logic grant_valid;
  logic read_pending_q;
  logic [ID_W-1:0] read_id_q;

  always_comb begin
    grant_valid = 1'b0;
    grant_id = rr_ptr_q;
    for (int off = 0; off < N_CLIENTS; off++) begin
      int idx;
      idx = (rr_ptr_q + off) % N_CLIENTS;
      if (!grant_valid && req_valid[idx]) begin
        grant_valid = 1'b1;
        grant_id = ID_W'(idx);
      end
    end
  end

  always_comb begin
    req_ready = '0;
    sram_ce = 1'b0;
    sram_we = 1'b0;
    sram_addr = '0;
    sram_wdata = '0;
    sram_wstrb = '0;

    if (grant_valid && !read_pending_q) begin
      req_ready[grant_id] = 1'b1;
      sram_ce = 1'b1;
      sram_we = req_write[grant_id];
      sram_addr = req_addr[grant_id];
      sram_wdata = req_wdata[grant_id];
      sram_wstrb = req_wstrb[grant_id];
    end
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      rr_ptr_q <= '0;
      read_pending_q <= 1'b0;
      read_id_q <= '0;
      rsp_valid <= '0;
      rsp_rdata <= '0;
    end else begin
      for (int i = 0; i < N_CLIENTS; i++) begin
        if (rsp_valid[i] && rsp_ready[i]) rsp_valid[i] <= 1'b0;
      end

      if (grant_valid && req_ready[grant_id]) begin
        rr_ptr_q <= (grant_id == N_CLIENTS-1) ? '0 : grant_id + 1'b1;
        if (!req_write[grant_id]) begin
          read_pending_q <= 1'b1;
          read_id_q <= grant_id;
        end
      end

      // Assumes synchronous 1-cycle SRAM read latency.
      if (read_pending_q) begin
        rsp_valid[read_id_q] <= 1'b1;
        rsp_rdata[read_id_q] <= sram_rdata;
        read_pending_q <= 1'b0;
      end
    end
  end
endmodule
`),
    tags: ["nvidia", "memory-controller", "sram"],
  },
];

const summaryCards = [
  {
    icon: FileCode2,
    label: "Problems",
    value: "26",
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
              Presenting my collection of RTL design problems that I used to
              practice and improve my RTL skills. These are what I review,
              especially during interview preparation.
            </p>
            <p>
              Each problem now includes a concrete SystemVerilog reference
              implementation. For interview practice, read the code at the clock
              cycle level, then write your own version and testbench.
            </p>
            <p>
              The snippets favor readable interview RTL over production
              integration detail. For real projects, add reset strategy,
              assertions, lint cleanup, memory macro wrappers, and full
              verification.
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
                Problem, checklist, and reference RTL
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
              Use each implementation as a reference answer. Then write your own
              RTL, testbench, and assertions from scratch.
            </p>
          </div>
          <span className="badge-pill bg-surface-soft text-primary">
            Reference RTL included
          </span>
        </div>
      </section>

      <section className="grid gap-4">
        {practiceProblems.map((item, index) => (
          <article className="product-panel p-5" key={item.title}>
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

            <div className="mt-4 rounded-md border border-hairline bg-surface-soft p-4">
              <h4 className="text-sm font-semibold text-primary">
                Answer / design checklist
              </h4>
              <p className="mt-2 text-sm leading-6 text-body">{item.answer}</p>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 text-sm font-semibold text-primary">
                Reference RTL / code
              </h4>
              <RichText text={item.code} />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
