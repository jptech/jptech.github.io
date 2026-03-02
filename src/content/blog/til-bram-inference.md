---
title: "TIL: When Vivado Won't Infer BRAM"
description: "A quick note on a common gotcha with block RAM inference in Vivado synthesis."
date: 2026-03-10
tags: ["fpga", "vivado", "bram"]
category: note
---

Today I hit a classic Vivado issue: my RAM wasn't being inferred as BRAM despite looking correct in RTL.

The culprit was an asynchronous read. Vivado requires a **registered output** to infer block RAM:

```verilog
// This won't infer BRAM — async read
assign data_out = mem[addr];

// This will — registered read
always @(posedge clk) begin
    data_out <= mem[addr];
end
```

You can verify what Vivado inferred by checking the synthesis log for `INFO: [Synth 8-3971]` messages, or by running `report_utilization -hierarchical` and looking at the BRAM column.

Small thing, but it's bitten me more than once.
