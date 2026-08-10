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

interface KurumVerisi {
  ad: string;
  ogrenciSayisi: number;
}

const RENKLER = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function KurumKarsilastirmaChart({ veri }: { veri: KurumVerisi[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={veri} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="ad"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={50}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          width={28}
        />
        <Tooltip
          cursor={{ fill: "var(--muted)", opacity: 0.4 }}
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            fontSize: "0.8rem",
            color: "var(--popover-foreground)",
          }}
          labelStyle={{ color: "var(--muted-foreground)" }}
        />
        <Bar dataKey="ogrenciSayisi" name="Öğrenci" radius={[6, 6, 0, 0]}>
          {veri.map((_, i) => (
            <Cell key={i} fill={RENKLER[i % RENKLER.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
