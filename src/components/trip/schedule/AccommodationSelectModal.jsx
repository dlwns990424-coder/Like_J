import { BedDouble, MapPin, Search, X } from "lucide-react";

import { createPortal } from "react-dom";

export default function AccommodationSelectModal({
  isOpen,
  favoritePlaces,
  onClose,
  onSelect,
  onOpenMap,
}) {
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
        aria-labelledby="accommodation-select-title"
        className="
          relative
          z-[100000]
          max-h-[85dvh]
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
              id="accommodation-select-title"
              className="
                text-[20px]
                font-semibold
                leading-[28px]
                tracking-[-0.02em]
              "
            >
              숙소 지정
            </h2>

            <p
              className="
                mt-[4px]
                text-[13px]
                leading-[20px]
                text-[#888888]
              "
            >
              숙박할 장소를 선택해주세요.
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
            Map Search
        ==================== */}

        <button
          type="button"
          onClick={onOpenMap}
          className="
            click-scale
            mt-[20px]
            flex
            h-[48px]
            w-full
            items-center
            gap-[10px]
            rounded-xl
            bg-[#3478F6]
            px-[14px]
            text-[14px]
            font-semibold
            leading-[20px]
            text-white
          "
        >
          <Search size={18} strokeWidth={1.5} />

          <span>지도에서 숙소 찾기</span>
        </button>

        {/* ====================
            Favorite Places
        ==================== */}

        <div className="mt-[24px]">
          <div className="flex items-center gap-[6px]">
            <BedDouble size={17} strokeWidth={1.5} />

            <h3
              className="
                text-[15px]
                font-semibold
                leading-[22px]
              "
            >
              관심 장소에서 선택
            </h3>
          </div>

          {favoritePlaces.length > 0 ? (
            <div
              className="
                hide-scrollbar
                mt-[12px]
                flex
                max-h-[320px]
                flex-col
                gap-[10px]
                overflow-y-auto
              "
            >
              {favoritePlaces.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => onSelect(place)}
                  className="
                      click-scale
                      flex
                      w-full
                      items-center
                      gap-[12px]
                      rounded-xl
                      border
                      border-[#D9D9D9]
                      bg-white
                      p-[10px]
                      text-left
                    "
                >
                  {/* ====================
                        Image
                    ==================== */}

                  <div
                    className="
                        h-[58px]
                        w-[58px]
                        shrink-0
                        overflow-hidden
                        rounded-lg
                        bg-[#D9D9D9]
                      "
                  >
                    {place.imageUrl && (
                      <img
                        src={place.imageUrl}
                        alt={place.name}
                        className="
                            h-full
                            w-full
                            object-cover
                          "
                      />
                    )}
                  </div>

                  {/* ====================
                        Info
                    ==================== */}

                  <div className="min-w-0 flex-1">
                    <p
                      className="
                          truncate
                          text-[15px]
                          font-semibold
                          leading-[22px]
                        "
                    >
                      {place.name}
                    </p>

                    {place.category && (
                      <p
                        className="
                            mt-[2px]
                            text-[11px]
                            leading-[16px]
                            text-[#555555]
                          "
                      >
                        {place.category}
                      </p>
                    )}

                    {place.address && (
                      <div className="mt-[4px] flex items-start gap-[4px]">
                        <MapPin
                          size={12}
                          strokeWidth={1.5}
                          className="
                              mt-[2px]
                              shrink-0
                              text-[#888888]
                            "
                        />

                        <p
                          className="
                              line-clamp-1
                              text-[11px]
                              leading-[16px]
                              text-[#888888]
                            "
                        >
                          {place.address}
                        </p>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div
              className="
                mt-[16px]
                flex
                min-h-[100px]
                items-center
                justify-center
                rounded-xl
                bg-[#F5F5F5]
                px-[20px]
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
                등록된 관심 장소가 없어요.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>,
    document.body,
  );
}
