import { CalendarDays, X } from "lucide-react";

export default function TripSelectModal({
  isOpen,
  trips,
  onClose,
  onSelect,
  onCreateTrip,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-end
        justify-center
        bg-black/40
        px-5
        pb-[calc(20px+env(safe-area-inset-bottom))]
      "
      onClick={onClose}
    >
      <div
        className="
          w-full
          max-w-[350px]
          rounded-2xl
          border
          border-[#D9D9D9]
          bg-white
          p-[20px]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* ====================
            Header
        ==================== */}

        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold leading-[28px] tracking-[-0.02em]">
            여행 선택
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="click-scale-sm flex h-[32px] w-[32px] items-center justify-center"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <p className="mt-[8px] text-[14px] leading-[20px] text-[#555555]">
          관심 장소를 추가할 여행을 선택해주세요.
        </p>

        {/* ====================
            Trip List
        ==================== */}

        {trips.length > 0 ? (
          <div className="mt-[20px] flex max-h-[300px] flex-col gap-[10px] overflow-y-auto">
            {trips.map((trip) => (
              <button
                key={trip.id}
                type="button"
                onClick={() => onSelect(trip.id)}
                className="
                  click-scale
                  w-full
                  rounded-xl
                  border
                  border-[#D9D9D9]
                  p-[12px]
                  text-left
                "
              >
                <p className="text-[16px] font-semibold leading-[24px]">
                  {trip.title}
                </p>

                <p className="mt-[2px] text-[13px] leading-[18px] text-[#555555]">
                  {trip.city ? `${trip.country} · ${trip.city}` : trip.country}
                </p>

                <div className="mt-[8px] flex items-center gap-[6px] text-[12px] leading-[18px] text-[#888888]">
                  <CalendarDays size={14} strokeWidth={1.5} />

                  <span>
                    {trip.startDate} ~ {trip.endDate}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* ====================
              여행 없음
          ==================== */

          <div className="mt-[28px]">
            <p className="text-center text-[14px] leading-[20px] text-[#888888]">
              아직 등록된 여행이 없어요.
            </p>

            <button
              type="button"
              onClick={onCreateTrip}
              className="
                click-scale
                mt-[20px]
                flex
                h-[48px]
                w-full
                items-center
                justify-center
                rounded-xl
                bg-[#3478F6]
                text-[15px]
                font-semibold
                text-white
              "
            >
              여행 계획 만들기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
