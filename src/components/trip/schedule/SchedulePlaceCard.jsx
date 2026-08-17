import { useState } from "react";
import { Check } from "lucide-react";

import ScheduleTimeModal from "./ScheduleTimeModal";

export default function SchedulePlaceCard({
  schedule,
  onTimeSave,
  isEditMode = false,
  isSelected = false,
  onSelect,
}) {
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);

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
  // 편집 모드일 때만
  // 카드 전체 선택 가능
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

  return (
    <>
      <article
        onClick={handleCardClick}
        className={`
          relative
          w-full
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
              <p className="mt-[6px] line-clamp-2 text-[12px] leading-[18px] text-[#555555]">
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
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>
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
