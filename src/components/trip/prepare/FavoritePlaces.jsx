import { useState } from "react";

import {
  ChevronDown,
  ChevronUp,
  Clock3,
  Globe,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Star,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { getFavoritePlacesByTripId } from "../../../lib/storage";

// ====================
// Category
// ====================

const getCategoryLabel = (category) => {
  if (!category) {
    return "";
  }

  const categoryMap = {
    치과: "치과",
    dentist: "치과",
    Dentist: "치과",
  };

  return categoryMap[category] || category;
};

// ====================
// Favorite Place Card
// ====================

function FavoritePlaceCard({ place }) {
  // ====================
  // State
  // ====================

  const [isExpanded, setIsExpanded] = useState(false);

  const [isHoursExpanded, setIsHoursExpanded] = useState(false);

  // ====================
  // Category
  // ====================

  const categoryLabel = getCategoryLabel(place.category);

  // ====================
  // Card Toggle
  // ====================

  const handleToggle = (e) => {
    e.stopPropagation();

    setIsExpanded((prev) => !prev);
  };

  // ====================
  // Hours Toggle
  // ====================

  const handleHoursToggle = (e) => {
    e.stopPropagation();

    setIsHoursExpanded((prev) => !prev);
  };

  // ====================
  // Website
  // ====================

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

  // ====================
  // 오전 / 오후 → 24시간
  // ====================

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

  // ====================
  // Opening Hour Parse
  // ====================

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

    // ====================
    // 휴무
    // ====================

    if (timeText.includes("휴무") || timeText.includes("Closed")) {
      return {
        day,
        time: "휴무",
      };
    }

    // ====================
    // 24시간
    // ====================

    if (timeText.includes("24시간")) {
      return {
        day,
        time: "24시간",
      };
    }

    // ====================
    // 시간 추출
    // ====================

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

  // ====================
  // Parsed Hours
  // ====================

  const openingHours = Array.isArray(place.openingHours)
    ? place.openingHours.map(parseOpeningHour).filter(Boolean)
    : [];

  // ====================
  // 오늘 영업시간
  // ====================

  const todayName = weekDays[new Date().getDay()];

  const todayOpeningHour = openingHours.find((item) => item.day === todayName);

  // ====================
  // Render
  // ====================

  return (
    <article
      className="
        w-full
        overflow-hidden
        rounded-xl
        border
        border-[#D9D9D9]
        bg-white
        p-[10px]
      "
    >
      {/* ====================
          기본 상태
      ==================== */}

      <div className="flex gap-[12px]">
        {/* ====================
            Content
        ==================== */}

        <div className="min-w-0 flex-1">
          <h3
            className="
              truncate
              text-[16px]
              font-semibold
              leading-[24px]
              tracking-[-0.01em]
            "
          >
            {place.name}
          </h3>

          {/* ====================
              Category
          ==================== */}

          {categoryLabel && (
            <span
              className="
                mt-[4px]
                inline-flex
                rounded-md
                bg-[#F5F5F5]
                px-[6px]
                py-[2px]
                text-[10px]
                leading-[16px]
                text-[#555555]
              "
            >
              {categoryLabel}
            </span>
          )}
        </div>

        {/* ====================
            Image
        ==================== */}

        <div
          className="
            h-[64px]
            w-[64px]
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
          <div
            className="
              border-t
              border-[#EEEEEE]
              pt-[10px]
            "
          >
            <div
              className="
                flex
                flex-col
                gap-[8px]
                text-[12px]
                leading-[18px]
                text-[#555555]
              "
            >
              {/* ====================
                  Address
              ==================== */}

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

              {/* ====================
                  Rating
              ==================== */}

              {place.rating !== null && place.rating !== undefined && (
                <div className="flex items-center gap-[6px]">
                  <Star size={14} strokeWidth={1.5} />

                  <span className="text-[#F5A623]">{place.rating}</span>
                </div>
              )}

              {/* ====================
                  Opening Hours
              ==================== */}

              {todayOpeningHour && (
                <div>
                  <button
                    type="button"
                    onClick={handleHoursToggle}
                    className="
                      click-scale-sm
                      flex
                      w-full
                      items-center
                      gap-[6px]
                      text-left
                    "
                  >
                    <Clock3 size={14} strokeWidth={1.5} className="shrink-0" />

                    <span className="min-w-0 flex-1">
                      <span className="font-medium text-[#191919]">
                        오늘({todayName})
                      </span>

                      <span className="ml-[6px]">{todayOpeningHour.time}</span>
                    </span>

                    {isHoursExpanded ? (
                      <ChevronUp
                        size={15}
                        strokeWidth={1.5}
                        className="shrink-0"
                      />
                    ) : (
                      <ChevronDown
                        size={15}
                        strokeWidth={1.5}
                        className="shrink-0"
                      />
                    )}
                  </button>

                  {/* ====================
                      Weekly Hours
                  ==================== */}

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
                      <div
                        className="
                          ml-[20px]
                          rounded-lg
                          bg-[#F7F7F7]
                          px-[10px]
                          py-[8px]
                        "
                      >
                        {openingHours.map((item) => (
                          <div
                            key={item.day}
                            className="
                              flex
                              min-h-[24px]
                              items-start
                              gap-[10px]
                              py-[2px]
                            "
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
                              className={`
                                min-w-0
                                flex-1

                                ${
                                  item.time === "휴무"
                                    ? "text-[#E5484D]"
                                    : "text-[#555555]"
                                }
                              `}
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

              {/* ====================
                  Website
              ==================== */}

              {place.url && (
                <button
                  type="button"
                  onClick={handleUrlClick}
                  className="
                    click-scale
                    flex
                    w-fit
                    items-center
                    gap-[6px]
                  "
                >
                  <Globe size={14} strokeWidth={1.5} />

                  <span>Google Maps에서 보기</span>
                </button>
              )}

              {/* ====================
                  Phone
              ==================== */}

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
          Detail Toggle
      ==================== */}

      <div className="mt-[8px] flex justify-start">
        <button
          type="button"
          onClick={handleToggle}
          className="
            click-scale-sm
            flex
            h-[28px]
            w-[28px]
            items-center
            justify-center
            text-[#555555]
          "
          aria-label={
            isExpanded ? "관심 장소 정보 접기" : "관심 장소 정보 펼치기"
          }
        >
          {isExpanded ? (
            <ChevronUp size={18} strokeWidth={1.5} />
          ) : (
            <ChevronDown size={18} strokeWidth={1.5} />
          )}
        </button>
      </div>
    </article>
  );
}

// ====================
// Favorite Places
// ====================

export default function FavoritePlaces({ tripId }) {
  const navigate = useNavigate();

  const favoritePlaces = getFavoritePlacesByTripId(tripId);

  // ====================
  // Map으로 장소 추가
  // ====================

  const handleAddPlace = () => {
    navigate("/map", {
      state: {
        mode: "favorite",
        tripId,
      },
    });
  };

  return (
    <section>
      {/* ====================
          Header
      ==================== */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[6px]">
          <h2
            className="
              text-[18px]
              font-semibold
              leading-[26px]
              tracking-[-0.01em]
            "
          >
            관심 장소
          </h2>
        </div>

        <button
          type="button"
          className="
            click-scale-sm
            flex
            h-[32px]
            w-[32px]
            items-center
            justify-center
          "
        >
          <MoreHorizontal size={22} strokeWidth={1.5} />
        </button>
      </div>

      {/* ====================
          관심 장소 List
      ==================== */}

      {favoritePlaces.length > 0 && (
        <div
          className="
            mt-[12px]
            flex
            flex-col
            gap-[10px]
          "
        >
          {favoritePlaces.map((place) => (
            <FavoritePlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}

      {/* ====================
          장소 추가
      ==================== */}

      <button
        type="button"
        onClick={handleAddPlace}
        className="
          click-scale
          mt-[12px]
          flex
          h-[38px]
          w-full
          items-center
          gap-[10px]
          rounded-xl
          bg-[#F5F5F5]
          px-[10px]
          text-[14px]
          leading-[20px]
          text-[#888888]
        "
      >
        <Plus size={18} strokeWidth={1.5} />

        <span>장소 추가</span>
      </button>
    </section>
  );
}
