export default function TripSchedule({ containerRef }) {
  return (
    <div
      ref={containerRef}
      className="
        hide-scrollbar
        h-full
        w-full
        overflow-x-hidden
        overflow-y-auto
        overscroll-y-contain
        pb-[calc(120px+env(safe-area-inset-bottom))]
        pt-[calc(108px+env(safe-area-inset-top))]
      "
    >
      <section className="min-h-[calc(100dvh+600px)] px-5 pt-[28px]">
        <p className="text-[16px] font-semibold leading-[24px]">일정</p>
      </section>
    </div>
  );
}
