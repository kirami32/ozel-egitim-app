export const GUN_SIRASI = [1, 2, 3, 4, 5] as const;

export const GUN_ADLARI: Record<number, string> = {
  1: "Pazartesi",
  2: "Salı",
  3: "Çarşamba",
  4: "Perşembe",
  5: "Cuma",
};

export const GUN_RENKLERI: Record<number, string> = {
  1: "var(--chart-1)",
  2: "var(--chart-2)",
  3: "var(--chart-3)",
  4: "var(--chart-4)",
  5: "var(--chart-5)",
};

/** "HH:MM" biçimini doğrular. */
export const SAAT_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
