import { useEffect, useState } from "react";

import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  Globe,
  MapPin,
  Phone,
  Star,
} from "lucide-react";

import ScheduleTimeModal from "./ScheduleTimeModal";

export default function SchedulePlaceCard({
  schedule,
  onTimeSave,
  isEditMode = false,
  isSelected = false,
  onSelect,
}) {
  // ====================
  // State
  // ====================

  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);

  const [isHoursExpanded, setIsHoursExpanded] = useState(false);

  // ====================
  // 일정 변경
  // ====================

  useEffect(() => {
    setIsExpanded(false);

    setIsHoursExpanded(false);
  }, [schedule.id]);

  // ====================
  // Time
  // ====================

  const hasTime = schedule.startTime || schedule.endTime;

  const getTimeText = () => {
    if (schedule.startTime && schedule.endTime) {
      return `${schedule.startTime} ~ ${schedule.endTime}`;
    }

    if (schedule.startTime) {
      return `${schedule.startTime} ~`;
    }

    if (schedule.endTime) {
      return `~ ${schedule.endTime}`;
    }

    return "";
  };

  // ====================
  // Time Save
  // ====================

  const handleTimeSave = (startTime, endTime) => {
    onTimeSave(schedule.id, startTime, endTime);

    setIsTimeModalOpen(false);
  };

  // ====================
  // Card Click
  //
  // 편집모드에서만 선택
  // ====================

  const handleCardClick = () => {
    if (!isEditMode) {
      return;
    }

    onSelect?.();
  };

  // ====================
  // Time Open
  // ====================

  const handleTimeOpen = (e) => {
    e.stopPropagation();

    if (isEditMode) {
      return;
    }

    setIsTimeModalOpen(true);
  };

  // ====================
  // Detail Toggle
  // ====================

  const handleToggle = (e) => {
    e.stopPropagation();

    if (isEditMode) {
      return;
    }

    setIsExpanded((prev) => !prev);
  };

  // ====================
  // Hours Toggle
  // ====================

  const handleHoursToggle = (e) => {
    e.stopPropagation();

    if (isEditMode) {
      return;
    }

    setIsHoursExpanded((prev) => !prev);
  };

  // ====================
  // Website
  // ====================

  const handleUrlClick = (e) => {
    e.stopPropagation();

    if (!schedule.url) {
      return;
    }

    window.open(schedule.url, "_blank", "noopener,noreferrer");
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
  // 오전/오후 → 24시간
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

  const openingHours = Array.isArray(schedule.openingHours)
    ? schedule.openingHours.map(parseOpeningHour).filter(Boolean)
    : [];

  // ====================
  // 오늘
  // ====================

  const todayName = weekDays[new Date().getDay()];

  const todayOpeningHour = openingHours.find((item) => item.day === todayName);

  // ====================
  // Render
  // ====================

  return (
    <>
      <article
        onClick={handleCardClick}
        className={`
          relative
          w-full
          overflow-hidden
          rounded-xl
          border
          bg-white
          p-[10px]

          ${isSelected ? "border-[#3478F6]" : "border-[#D9D9D9]"}

          ${isEditMode ? "cursor-pointer" : ""}
        `}
      >
        {/* ====================
            Edit Select
        ==================== */}

        {isEditMode && (
          <div
            className={`
              absolute
              top-[8px]
              right-[8px]
              z-20
              flex
              h-[22px]
              w-[22px]
              items-center
              justify-center
              rounded-full
              border

              ${
                isSelected
                  ? "border-[#3478F6] bg-[#3478F6] text-white"
                  : "border-[#D9D9D9] bg-white"
              }
            `}
          >
            {isSelected && <Check size={14} strokeWidth={2} />}
          </div>
        )}

        {/* ====================
            Main
        ==================== */}

        <div className="flex gap-[12px]">
          {/* ====================
              Content
          ==================== */}

          <div className="min-w-0 flex-1">
            <h3
              className={`
                truncate
                text-[16px]
                font-semibold
                leading-[24px]
                tracking-[-0.01em]

                ${isEditMode ? "pr-[28px]" : ""}
              `}
            >
              {schedule.name}
            </h3>

            {/* ====================
                Category
            ==================== */}

            {schedule.category && (
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
                {schedule.category}
              </span>
            )}

            {/* ====================
                Time
            ==================== */}

            <div className="mt-[6px]">
              {hasTime ? (
                <button
                  type="button"
                  onClick={handleTimeOpen}
                  disabled={isEditMode}
                  className={`
                    inline-flex
                    rounded-md
                    bg-[#EAF2FF]
                    px-[7px]
                    py-[3px]
                    text-[11px]
                    font-medium
                    leading-[16px]
                    text-[#3478F6]

                    ${isEditMode ? "cursor-default" : "click-scale-sm"}
                  `}
                >
                  {getTimeText()}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleTimeOpen}
                  disabled={isEditMode}
                  className={`
                    inline-flex
                    rounded-md
                    bg-[#EAF2FF]
                    px-[7px]
                    py-[3px]
                    text-[11px]
                    font-medium
                    leading-[16px]
                    text-[#3478F6]

                    ${isEditMode ? "cursor-default" : "click-scale-sm"}
                  `}
                >
                  시간 추가
                </button>
              )}
            </div>

            {/* ====================
                Memo
            ==================== */}

            {schedule.memo && (
              <p
                className="
                  mt-[6px]
                  line-clamp-2
                  text-[12px]
                  leading-[18px]
                  text-[#555555]
                "
              >
                {schedule.memo}
              </p>
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
            {schedule.imageUrl && (
              <img
                src={schedule.imageUrl}
                alt={schedule.name}
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

        {!isEditMode && (
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
                  {" "}
                  {/* ====================
                      Address
                  ==================== */}
                  {schedule.address && (
                    <div className="flex items-start gap-[6px]">
                      <MapPin
                        size={14}
                        strokeWidth={1.5}
                        className="mt-[2px] shrink-0"
                      />

                      <span>{schedule.address}</span>
                    </div>
                  )}
                  {/* ====================
                      Rating
                  ==================== */}
                  {schedule.rating !== null &&
                    schedule.rating !== undefined && (
                      <div className="flex items-center gap-[6px]">
                        <Star size={14} strokeWidth={1.5} />

                        <span className="text-[#F5A623]">
                          {schedule.rating}
                        </span>
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
                  {schedule.url && (
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
                  {schedule.phone && (
                    <div className="flex items-center gap-[6px]">
                      <Phone size={14} strokeWidth={1.5} />

                      <span>{schedule.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================
            Detail Toggle
        ==================== */}

        {!isEditMode && (
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
              aria-label={isExpanded ? "장소 정보 접기" : "장소 정보 펼치기"}
            >
              {isExpanded ? (
                <ChevronUp size={18} strokeWidth={1.5} />
              ) : (
                <ChevronDown size={18} strokeWidth={1.5} />
              )}
            </button>
          </div>
        )}
      </article>

      {/* ====================
          Time Modal
      ==================== */}

      <ScheduleTimeModal
        isOpen={isTimeModalOpen}
        startTime={schedule.startTime || ""}
        endTime={schedule.endTime || ""}
        onClose={() => setIsTimeModalOpen(false)}
        onSave={handleTimeSave}
      />
    </>
  );
}
