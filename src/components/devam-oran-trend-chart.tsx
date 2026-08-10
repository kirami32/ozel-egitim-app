"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface TrendNoktasi {
  tarih: string;
  oran: number;
}

export function DevamOranTrendChart({ veri }: { veri: TrendNoktasi[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={veri} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="devamOranGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="tarih"
          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          width={40}
        />
        <Tooltip
          formatter={(deger) => [`${deger}%`, "Devam Oranı"] as [string, string]}
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            fontSize: "0.8rem",
            color: "var(--popover-foreground)",
          }}
          labelStyle={{ color: "var(--muted-foreground)" }}
        />
        <Area
          type="monotone"
          dataKey="oran"
          stroke="var(--chart-4)"
          strokeWidth={2.5}
          fill="url(#devamOranGradient)"
          dot={{ r: 3, fill: "var(--chart-4)" }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
