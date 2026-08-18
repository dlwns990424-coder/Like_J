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
import ScheduleMemo from "./ScheduleMemo";
import ScheduleMemoModal from "./ScheduleMemoModal";

export default function SchedulePlaceCard({
  schedule,
  onTimeSave,
  onMemoSave,
  isEditMode = false,
  isSelected = false,
  onSelect,
}) {
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);

  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);

  const [isHoursExpanded, setIsHoursExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);

    setIsHoursExpanded(false);

    setIsMemoModalOpen(false);
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

  const handleTimeSave = (startTime, endTime) => {
    onTimeSave(schedule.id, startTime, endTime);

    setIsTimeModalOpen(false);
  };

  // ====================
  // Card
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
  // Detail
  // ====================

  const handleToggle = (e) => {
    e.stopPropagation();

    if (isEditMode) {
      return;
    }

    setIsExpanded((prev) => !prev);
  };

  // ====================
  // Memo
  // ====================

  const handleMemoOpen = () => {
    if (isEditMode) {
      return;
    }

    setIsMemoModalOpen(true);
  };

  const handleMemoClose = () => {
    setIsMemoModalOpen(false);
  };

  const handleMemoSave = (content) => {
    onMemoSave?.(schedule.id, content);

    setIsMemoModalOpen(false);
  };

  const handleMemoDelete = () => {
    onMemoSave?.(schedule.id, "");

    setIsMemoModalOpen(false);
  };

  // ====================
  // Hours
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

  const openingHours = Array.isArray(schedule.openingHours)
    ? schedule.openingHours.map(parseOpeningHour).filter(Boolean)
    : [];

  const todayName = weekDays[new Date().getDay()];

  const todayOpeningHour = openingHours.find((item) => item.day === todayName);

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
            기본 정보
        ==================== */}

        <div className="min-w-0">
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

          {schedule.category && (
            <span className="mt-[4px] inline-flex rounded-md bg-[#F5F5F5] px-[6px] py-[2px] text-[10px] leading-[16px] text-[#555555]">
              {schedule.category}
            </span>
          )}

          {/* ====================
              Time
          ==================== */}

          <div className="mt-[6px]">
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
              {hasTime ? getTimeText() : "시간 추가"}
            </button>
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

              ${
                isExpanded
                  ? "mt-[12px] grid-rows-[1fr] opacity-100"
                  : "mt-0 grid-rows-[0fr] opacity-0"
              }
            `}
          >
            <div className="overflow-hidden">
              <div className="border-t border-[#EEEEEE] pt-[10px]">
                {/* ====================
                    Memo
                ==================== */}

                <ScheduleMemo
                  memo={schedule.memo || ""}
                  onClick={handleMemoOpen}
                />

                <div className="mt-[10px] flex flex-col gap-[8px] text-[12px] leading-[18px] text-[#555555]">
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
                        className="flex w-full items-center gap-[6px] text-left"
                      >
                        <Clock3 size={14} strokeWidth={1.5} />

                        <span className="min-w-0 flex-1">
                          <span className="font-medium text-[#191919]">
                            오늘({todayName})
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
                                <span className="w-[42px] shrink-0">
                                  {item.day}
                                </span>

                                <span>{item.time}</span>
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
                      className="click-scale flex w-fit items-center gap-[6px]"
                    >
                      <Globe size={14} strokeWidth={1.5} />

                      <span>웹사이트</span>
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
            Bottom
        ==================== */}

        {!isEditMode && (
          <div className="mt-[8px]">
            <button
              type="button"
              onClick={handleToggle}
              className="click-scale-sm flex h-[28px] w-[28px] items-center justify-center text-[#555555]"
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

      {/* ====================
          Memo Modal
      ==================== */}

      <ScheduleMemoModal
        isOpen={isMemoModalOpen}
        initialMemo={schedule.memo || ""}
        onClose={handleMemoClose}
        onSave={handleMemoSave}
        onDelete={handleMemoDelete}
      />
    </>
  );
}
