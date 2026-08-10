"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface DevamDagilimNoktasi {
  etiket: string;
  sayi: number;
  renk: string;
}

export function DevamDurumuChart({ veri }: { veri: DevamDagilimNoktasi[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={veri}
          dataKey="sayi"
          nameKey="etiket"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          strokeWidth={0}
        >
          {veri.map((nokta) => (
            <Cell key={nokta.etiket} fill={nokta.renk} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            fontSize: "0.8rem",
            color: "var(--popover-foreground)",
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={32}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
