"use client";

import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { aggregateByDate } from "@/lib/stats";
import { type RunRecord } from "@/lib/csv";

function formatDateLabel(d: string) {
  return d;
}

export function RunLineChart({ records, color = "#0ea5e9" }: { records: RunRecord[]; color?: string }) {
  const data = aggregateByDate(records);
  return (
    <div className="w-full h-64 sm:h-72 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatDateLabel} />
          <YAxis />
          <Tooltip labelFormatter={(v) => `Date: ${v}`} formatter={(v: any) => [`${v} mi`, "Miles"]} />
          <Line type="monotone" dataKey="miles" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
