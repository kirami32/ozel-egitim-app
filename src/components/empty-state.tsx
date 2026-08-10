import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  baslik: string;
  aciklama: string;
  aksiyon?: React.ReactNode;
}

export function EmptyState({ icon: Icon, baslik, aciklama, aksiyon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-base font-semibold">{baslik}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{aciklama}</p>
      {aksiyon && <div className="mt-5">{aksiyon}</div>}
    </div>
  );
}
