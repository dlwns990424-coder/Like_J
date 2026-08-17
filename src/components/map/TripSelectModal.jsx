import { CalendarDays, X } from "lucide-react";

import { createPortal } from "react-dom";

export default function TripSelectModal({ isOpen, trips, onClose, onSelect }) {
  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[99999]
        flex
        items-end
        justify-center
        bg-black/40
      "
      onClick={onClose}
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
    >
      {/* ====================
          Bottom Sheet
      ==================== */}

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="trip-select-title"
        className="
          relative
          z-[100000]
          max-h-[80dvh]
          w-full
          max-w-[390px]
          overflow-y-auto
          rounded-t-[24px]
          bg-white
          px-5
          pt-[20px]
          pb-[calc(24px+env(safe-area-inset-bottom))]
          text-[#191919]
        "
        onClick={(e) => {
          e.stopPropagation();
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
      >
        {/* ====================
            Header
        ==================== */}

        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h2
              id="trip-select-title"
              className="
                text-[20px]
                font-semibold
                leading-[28px]
                tracking-[-0.02em]
              "
            >
              여행 선택
            </h2>

            <p
              className="
                mt-[4px]
                text-[13px]
                leading-[20px]
                text-[#888888]
              "
            >
              관심 장소를 추가할 여행을 선택해주세요.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="
              click-scale-sm
              flex
              h-[36px]
              w-[36px]
              shrink-0
              items-center
              justify-center
            "
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* ====================
            Trip List
        ==================== */}

        {trips.length > 0 ? (
          <div
            className="
              hide-scrollbar
              mt-[20px]
              flex
              max-h-[420px]
              flex-col
              gap-[10px]
              overflow-y-auto
            "
          >
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
                  bg-white
                  p-[14px]
                  text-left
                "
              >
                {/* ====================
                    Title
                ==================== */}

                <p
                  className="
                    truncate
                    text-[16px]
                    font-semibold
                    leading-[24px]
                  "
                >
                  {trip.title}
                </p>

                {/* ====================
                    Destination
                ==================== */}

                {(trip.city || trip.country) && (
                  <p
                    className="
                      mt-[2px]
                      truncate
                      text-[13px]
                      leading-[18px]
                      text-[#555555]
                    "
                  >
                    {trip.city
                      ? `${trip.country} · ${trip.city}`
                      : trip.country}
                  </p>
                )}

                {/* ====================
                    Date
                ==================== */}

                <div
                  className="
                    mt-[8px]
                    flex
                    items-center
                    gap-[6px]
                    text-[12px]
                    leading-[18px]
                    text-[#888888]
                  "
                >
                  <CalendarDays size={14} strokeWidth={1.5} />

                  <span>
                    {trip.startDate}
                    {" ~ "}
                    {trip.endDate}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* ====================
              추가 가능한 여행 없음
          ==================== */

          <div
            className="
              mt-[24px]
              flex
              min-h-[130px]
              items-center
              justify-center
              rounded-xl
              bg-[#F5F5F5]
              px-[24px]
            "
          >
            <p
              className="
                text-center
                text-[13px]
                leading-[20px]
                text-[#888888]
              "
            >
              관심 장소를 추가할 수 있는 여행이 없어요.
              <br />
              진행 중이거나 예정된 여행에만 추가할 수 있어요.
            </p>
          </div>
        )}
      </section>
    </div>,
    document.body,
  );
}
