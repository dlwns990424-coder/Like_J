import { useEffect, useRef, useState } from "react";

import {
  ChevronDown,
  ChevronUp,
  Clock3,
  Globe,
  Info,
  MapPin,
  Phone,
  Star,
} from "lucide-react";

export default function PlaceCard({
  place,
  mode,
  onFavoriteAdd,
  onScheduleAdd,
  onAccommodationAdd,
  onCreateTrip,
  onHeightChange,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const cardRef = useRef(null);

  // ====================
  // Height
  // ====================

  useEffect(() => {
    const card = cardRef.current;

    if (!card) {
      return;
    }

    const updateHeight = () => {
      onHeightChange?.(card.getBoundingClientRect().height);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);

    resizeObserver.observe(card);

    return () => {
      resizeObserver.disconnect();
    };
  }, [onHeightChange]);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();

    onFavoriteAdd?.();
  };

  const handleScheduleClick = (e) => {
    e.stopPropagation();

    onScheduleAdd?.();
  };

  const handleAccommodationClick = (e) => {
    e.stopPropagation();

    onAccommodationAdd?.();
  };

  const handleCreateTripClick = (e) => {
    e.stopPropagation();

    onCreateTrip?.();
  };

  const handleUrlClick = (e) => {
    e.stopPropagation();

    if (!place.url) {
      return;
    }

    window.open(place.url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      ref={cardRef}
      onClick={handleToggle}
      className="
        absolute
        right-5
        bottom-[100px]
        left-5
        z-30
        cursor-pointer
        overflow-hidden
        rounded-xl
        border
        border-[#D9D9D9]
        bg-white
      "
    >
      <div className="p-[14px]">
        <div className="flex gap-[12px]">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[18px] font-semibold leading-[26px]">
              {place.name}
            </h2>

            {place.category && (
              <span
                className="
                  mt-[6px]
                  inline-flex
                  rounded-md
                  bg-[#F5F5F5]
                  px-[6px]
                  py-[2px]
                  text-[11px]
                  leading-[16px]
                  text-[#555555]
                "
              >
                {place.category}
              </span>
            )}
          </div>

          <div className="h-[64px] w-[64px] shrink-0 overflow-hidden rounded-lg bg-[#D9D9D9]">
            {place.imageUrl && (
              <img
                src={place.imageUrl}
                alt={place.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="mt-[12px] flex flex-col gap-[8px] text-[12px] leading-[18px] text-[#555555]">
          <div className="flex items-start gap-[6px]">
            <Info size={14} strokeWidth={1.5} className="mt-[2px] shrink-0" />

            <span>{place.name} 정보</span>
          </div>

          {place.address && (
            <div className="flex items-start gap-[6px]">
              <MapPin
                size={14}
                strokeWidth={1.5}
                className="mt-[2px] shrink-0"
              />

              <span>{place.address}</span>
            </div>
          )}
        </div>

        <div
          className={`
            grid
            transition-[grid-template-rows,opacity,margin]
            duration-300
            ease-in-out

            ${
              isExpanded
                ? "mt-[8px] grid-rows-[1fr] opacity-100"
                : "mt-0 grid-rows-[0fr] opacity-0"
            }
          `}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-[8px] text-[12px] leading-[18px] text-[#555555]">
              {place.rating !== null && place.rating !== undefined && (
                <div className="flex items-center gap-[6px]">
                  <Star size={14} strokeWidth={1.5} />

                  <span className="text-[#F5A623]">{place.rating}</span>
                </div>
              )}

              {place.openingHours && (
                <div className="flex items-start gap-[6px]">
                  <Clock3
                    size={14}
                    strokeWidth={1.5}
                    className="mt-[2px] shrink-0"
                  />

                  <span>{place.openingHours}</span>
                </div>
              )}

              {place.url && (
                <button
                  type="button"
                  onClick={handleUrlClick}
                  className="click-scale flex w-fit items-center gap-[6px]"
                >
                  <Globe size={14} strokeWidth={1.5} />

                  <span>웹사이트</span>
                </button>
              )}

              {place.phone && (
                <div className="flex items-center gap-[6px]">
                  <Phone size={14} strokeWidth={1.5} />

                  <span>{place.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-[14px] flex items-center justify-between">
          <div className="flex h-[30px] w-[30px] items-center justify-center text-[#555555]">
            {isExpanded ? (
              <ChevronUp size={20} strokeWidth={1.5} />
            ) : (
              <ChevronDown size={20} strokeWidth={1.5} />
            )}
          </div>

          {mode === "schedule" && (
            <button
              type="button"
              onClick={handleScheduleClick}
              className="
                click-scale
                flex
                h-[36px]
                items-center
                justify-center
                rounded-full
                bg-[#3478F6]
                px-[18px]
                text-[13px]
                font-semibold
                text-white
              "
            >
              일정 추가
            </button>
          )}

          {mode === "favorite" && (
            <button
              type="button"
              onClick={handleFavoriteClick}
              className="
                click-scale
                flex
                h-[36px]
                items-center
                justify-center
                rounded-full
                bg-[#3478F6]
                px-[18px]
                text-[13px]
                font-semibold
                text-white
              "
            >
              관심 장소 추가
            </button>
          )}

          {/* ====================
              Accommodation
          ==================== */}

          {mode === "accommodation" && (
            <button
              type="button"
              onClick={handleAccommodationClick}
              className="
                click-scale
                flex
                h-[36px]
                items-center
                justify-center
                rounded-full
                bg-[#3478F6]
                px-[18px]
                text-[13px]
                font-semibold
                text-white
              "
            >
              숙소로 지정
            </button>
          )}

          {!mode && (
            <div className="flex gap-[8px]">
              <button
                type="button"
                onClick={handleFavoriteClick}
                className="
                  click-scale
                  flex
                  h-[34px]
                  items-center
                  justify-center
                  rounded-full
                  bg-[#3478F6]
                  px-[12px]
                  text-[12px]
                  font-semibold
                  text-white
                "
              >
                관심 장소 추가
              </button>

              <button
                type="button"
                onClick={handleCreateTripClick}
                className="
                  click-scale
                  flex
                  h-[34px]
                  items-center
                  justify-center
                  rounded-full
                  bg-[#3478F6]
                  px-[12px]
                  text-[12px]
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
    </section>
  );
}
