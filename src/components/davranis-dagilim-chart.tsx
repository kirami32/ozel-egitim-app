"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

interface DagilimNoktasi {
  etiket: string;
  sayi: number;
  renk: string;
}

export function DavranisDagilimChart({ veri }: { veri: DagilimNoktasi[] }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(220, veri.length * 42)}>
      <BarChart
        data={veri}
        layout="vertical"
        margin={{ top: 4, right: 20, left: 0, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
        <XAxis
          type="number"
          allowDecimals={false}
          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="etiket"
          width={150}
          tick={{ fontSize: 12, fill: "var(--foreground)" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            fontSize: "0.8rem",
            color: "var(--popover-foreground)",
          }}
        />
        <Bar dataKey="sayi" radius={[0, 6, 6, 0]} barSize={18}>
          {veri.map((nokta) => (
            <Cell key={nokta.etiket} fill={nokta.renk} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
