import TripMemo from "./TripMemo";
import FavoritePlaces from "./FavoritePlaces";

export default function TripPrepare({ trip, containerRef, onScroll }) {
  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className="
        hide-scrollbar
        h-full
        w-full
        overflow-x-hidden
        overflow-y-auto
        overscroll-y-contain
        pb-[calc(120px+env(safe-area-inset-bottom))]
      "
    >
      {/* ====================
          Hero + Tabs 자리 확보

          Hero 320px
          Tabs 48px

          실제 Hero와 Tabs는
          TripDetail에서 별도로 렌더링된다.
      ==================== */}

      <div className="h-[368px]" />

      {/* ====================
          여행 준비 내용
      ==================== */}

      <section className="flex min-h-dvh flex-col gap-[28px] px-5 pt-[28px]">
        <TripMemo trip={trip} />

        <FavoritePlaces tripId={trip.id} />
      </section>
    </div>
  );
}
