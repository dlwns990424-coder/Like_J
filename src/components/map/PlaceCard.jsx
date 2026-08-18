import { useEffect, useRef, useState } from "react";

import {
  ChevronDown,
  ChevronUp,
  Clock3,
  Globe,
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
  onHeightChange,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const [isHoursExpanded, setIsHoursExpanded] = useState(false);

  const cardRef = useRef(null);

  // ====================
  // Place 변경
  // ====================

  useEffect(() => {
    setIsExpanded(false);

    setIsHoursExpanded(false);
  }, [place.id]);

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

  // ====================
  // Toggle
  // ====================

  const handleToggle = (e) => {
    e.stopPropagation();

    setIsExpanded((prev) => !prev);
  };

  const handleHoursToggle = (e) => {
    e.stopPropagation();

    setIsHoursExpanded((prev) => !prev);
  };

  // ====================
  // Actions
  // ====================

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

  const handleUrlClick = (e) => {
    e.stopPropagation();

    if (!place.url) {
      return;
    }

    window.open(place.url, "_blank", "noopener,noreferrer");
  };

  // ====================
  // Opening Hours
  // ====================

  const weekDays = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];

  const convertTime = (time) => {
    if (!time) {
      return "";
    }

    const value = time.trim();

    if (value.includes("24시간")) {
      return "24시간";
    }

    const match = value.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);

    if (!match) {
      return value;
    }

    const period = match[1];

    let hour = Number(match[2]);

    const minute = match[3];

    if (period === "오전" && hour === 12) {
      hour = 0;
    }

    if (period === "오후" && hour !== 12) {
      hour += 12;
    }

    return `${String(hour).padStart(2, "0")}:${minute}`;
  };

  const parseOpeningHour = (value) => {
    if (!value) {
      return null;
    }

    const colonIndex = value.indexOf(":");

    if (colonIndex === -1) {
      return null;
    }

    const day = value.slice(0, colonIndex).trim();

    const timeText = value.slice(colonIndex + 1).trim();

    if (timeText.includes("휴무") || timeText.includes("Closed")) {
      return {
        day,
        time: "휴무",
      };
    }

    if (timeText.includes("24시간")) {
      return {
        day,
        time: "24시간",
      };
    }

    const timeMatches = timeText.match(/(오전|오후)\s*\d{1,2}:\d{2}/g);

    if (!timeMatches || timeMatches.length < 2) {
      return {
        day,
        time: timeText,
      };
    }

    const ranges = [];

    for (let i = 0; i < timeMatches.length; i += 2) {
      const start = timeMatches[i];

      const end = timeMatches[i + 1];

      if (!end) {
        continue;
      }

      ranges.push(`${convertTime(start)} ~ ${convertTime(end)}`);
    }

    return {
      day,

      time: ranges.join(", ") || timeText,
    };
  };

  const openingHours = Array.isArray(place.openingHours)
    ? place.openingHours.map(parseOpeningHour).filter(Boolean)
    : [];

  const todayName = weekDays[new Date().getDay()];

  const todayOpeningHour = openingHours.find((item) => item.day === todayName);

  return (
    <section
      ref={cardRef}
      className="
        absolute
        right-5
        bottom-[100px]
        left-5
        z-30
        overflow-hidden
        rounded-xl
        border
        border-[#D9D9D9]
        bg-white
      "
    >
      <div className="p-[14px]">
        {/* ====================
            기본 정보
        ==================== */}

        <div className="min-w-0">
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

        {/* ====================
            Detail
        ==================== */}

        <div
          className={`
            grid
            transition-[grid-template-rows,opacity,margin]
            duration-300
            ease-in-out

            ${
              isExpanded
                ? "mt-[12px] grid-rows-[1fr] opacity-100"
                : "mt-0 grid-rows-[0fr] opacity-0"
            }
          `}
        >
          <div className="overflow-hidden">
            <div className="border-t border-[#EEEEEE] pt-[10px]">
              <div className="flex flex-col gap-[8px] text-[12px] leading-[18px] text-[#555555]">
                {/* Address */}

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

                {/* Rating */}

                {place.rating !== null && place.rating !== undefined && (
                  <div className="flex items-center gap-[6px]">
                    <Star size={14} strokeWidth={1.5} />

                    <span className="text-[#F5A623]">{place.rating}</span>
                  </div>
                )}

                {/* Opening Hours */}

                {todayOpeningHour && (
                  <div>
                    <button
                      type="button"
                      onClick={handleHoursToggle}
                      className="
                        flex
                        w-full
                        items-center
                        gap-[6px]
                        text-left
                      "
                    >
                      <Clock3
                        size={14}
                        strokeWidth={1.5}
                        className="shrink-0"
                      />

                      <span className="min-w-0 flex-1">
                        <span className="font-medium text-[#191919]">
                          오늘(
                          {todayName})
                        </span>

                        <span className="ml-[6px]">
                          {todayOpeningHour.time}
                        </span>
                      </span>

                      {isHoursExpanded ? (
                        <ChevronUp size={15} strokeWidth={1.5} />
                      ) : (
                        <ChevronDown size={15} strokeWidth={1.5} />
                      )}
                    </button>

                    <div
                      className={`
                        grid
                        transition-[grid-template-rows,opacity,margin]
                        duration-200
                        ease-in-out

                        ${
                          isHoursExpanded
                            ? "mt-[8px] grid-rows-[1fr] opacity-100"
                            : "mt-0 grid-rows-[0fr] opacity-0"
                        }
                      `}
                    >
                      <div className="overflow-hidden">
                        <div className="ml-[20px] rounded-lg bg-[#F7F7F7] px-[10px] py-[8px]">
                          {openingHours.map((item) => (
                            <div
                              key={item.day}
                              className="flex min-h-[24px] items-start gap-[10px] py-[2px]"
                            >
                              <span
                                className={`
                                    w-[42px]
                                    shrink-0

                                    ${
                                      item.day === todayName
                                        ? "font-semibold text-[#3478F6]"
                                        : "text-[#555555]"
                                    }
                                  `}
                              >
                                {item.day}
                              </span>

                              <span
                                className={
                                  item.time === "휴무"
                                    ? "text-[#E5484D]"
                                    : "text-[#555555]"
                                }
                              >
                                {item.time}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Website */}

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

                {/* Phone */}

                {place.phone && (
                  <div className="flex items-center gap-[6px]">
                    <Phone size={14} strokeWidth={1.5} />

                    <span>{place.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ====================
            Bottom
        ==================== */}

        <div className="mt-[14px] flex items-center justify-between">
          <button
            type="button"
            onClick={handleToggle}
            className="
              click-scale-sm
              flex
              h-[30px]
              w-[30px]
              items-center
              justify-center
              text-[#555555]
            "
          >
            {isExpanded ? (
              <ChevronUp size={20} strokeWidth={1.5} />
            ) : (
              <ChevronDown size={20} strokeWidth={1.5} />
            )}
          </button>

          {mode === "schedule" && (
            <button
              type="button"
              onClick={handleScheduleClick}
              className="click-scale flex h-[36px] items-center justify-center rounded-full bg-[#3478F6] px-[18px] text-[13px] font-semibold text-white"
            >
              일정 추가
            </button>
          )}

          {mode === "favorite" && (
            <button
              type="button"
              onClick={handleFavoriteClick}
              className="click-scale flex h-[36px] items-center justify-center rounded-full bg-[#3478F6] px-[18px] text-[13px] font-semibold text-white"
            >
              관심 장소 추가
            </button>
          )}

          {mode === "accommodation" && (
            <button
              type="button"
              onClick={handleAccommodationClick}
              className="click-scale flex h-[36px] items-center justify-center rounded-full bg-[#3478F6] px-[18px] text-[13px] font-semibold text-white"
            >
              숙소로 지정
            </button>
          )}

          {!mode && (
            <button
              type="button"
              onClick={handleFavoriteClick}
              className="click-scale flex h-[36px] items-center justify-center rounded-full bg-[#3478F6] px-[18px] text-[13px] font-semibold text-white"
            >
              관심 장소 추가
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
