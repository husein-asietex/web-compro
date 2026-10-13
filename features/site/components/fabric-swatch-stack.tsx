/**
 * Archived hero study for a future fabric-led campaign.
 *
 * This component is intentionally not rendered on the current homepage. Keep it
 * available as a self-contained visual experiment until approved photography is
 * ready or the concept is revisited.
 */
export function FabricSwatchStack() {
  return (
    /* Fabric swatch stack */
    <div
      className="relative isolate h-[430px] overflow-visible sm:h-[500px]"
      aria-label="Asietex fabric swatch study"
    >
      {/* Swatch background layers */}
      <div
        aria-hidden="true"
        className="absolute left-[3%] top-[74px] h-[330px] w-[58%] rotate-[-8deg] rounded-[18px] bg-[repeating-linear-gradient(135deg,var(--surface-subtle)_0,var(--surface-subtle)_1px,var(--secondary)_1px,var(--secondary)_10px)] shadow-[0_20px_40px_-24px_var(--shadow-soft)] sm:h-[380px]"
      />
      <div
        aria-hidden="true"
        className="absolute left-[25%] top-[22px] h-[350px] w-[58%] rotate-[3deg] rounded-[18px] bg-[repeating-linear-gradient(45deg,var(--surface-warm)_0,var(--surface-warm)_1px,var(--secondary)_1px,var(--secondary)_8px)] shadow-[0_20px_40px_-24px_var(--shadow-soft)] sm:h-[400px]"
      />

      {/* Featured fabric swatch */}
      <article className="absolute left-[35%] top-[52px] flex h-[355px] w-[64%] rotate-[8deg] flex-col overflow-hidden rounded-[18px] bg-card shadow-[0_30px_60px_-28px_var(--shadow-soft)] sm:h-[420px]">
        <div className="flex flex-1 items-end bg-[repeating-linear-gradient(90deg,var(--surface-subtle)_0,var(--surface-subtle)_1px,var(--secondary)_1px,var(--secondary)_6px)] p-4 font-mono text-[10px] leading-none text-text-soft">
          [ fabric swatch photo ]
        </div>
        <div className="flex items-center justify-between bg-card px-5 py-5">
          <div>
            <p className="font-mono text-[11px] font-medium leading-none text-text-accent">
              ASIETEX · No. 05
            </p>
            <p className="mt-2 text-[19px] font-medium leading-none text-foreground">
              Dyeing
            </p>
          </div>
          <span
            aria-hidden="true"
            className="size-4 rounded-full border-2 border-border-strong"
          />
        </div>
      </article>
    </div>
  );
}
