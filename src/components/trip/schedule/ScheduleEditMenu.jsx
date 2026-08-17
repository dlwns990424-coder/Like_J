import { MoreHorizontal } from "lucide-react";

export default function ScheduleEditMenu({
  isEditMode,
  selectedSchedules = [],
  selectedScheduleIds = [],
  onEditStart,
  onEditComplete,
  onSelectAll,
  onSelectedDelete,
  onDeleteAll,
}) {
  // ====================
  // Edit Mode
  // ====================

  if (isEditMode) {
    const isAllSelected =
      selectedSchedules.length > 0 &&
      selectedScheduleIds.length === selectedSchedules.length;

    return (
      <div className="mt-[12px]">
        <div className="flex items-center justify-between">
          {/* ====================
              Left
          ==================== */}

          <button
            type="button"
            onClick={onSelectAll}
            className="
              click-scale-sm
              text-[13px]
              font-medium
              leading-[20px]
              text-[#555555]
            "
          >
            {isAllSelected ? "전체 선택 해제" : "전체 선택"}
          </button>

          {/* ====================
              Right
          ==================== */}

          <button
            type="button"
            onClick={onEditComplete}
            className="
              click-scale-sm
              text-[13px]
              font-semibold
              leading-[20px]
              text-[#3478F6]
            "
          >
            편집 완료
          </button>
        </div>

        {/* ====================
            Delete Actions
        ==================== */}

        <div className="mt-[10px] flex gap-[8px]">
          <button
            type="button"
            onClick={onSelectedDelete}
            disabled={selectedScheduleIds.length === 0}
            className={`
              click-scale
              flex
              h-[36px]
              flex-1
              items-center
              justify-center
              rounded-lg
              text-[12px]
              font-semibold

              ${
                selectedScheduleIds.length > 0
                  ? "bg-[#FFF0F0] text-[#E5484D]"
                  : "cursor-default bg-[#F5F5F5] text-[#BBBBBB]"
              }
            `}
          >
            선택 삭제
            {selectedScheduleIds.length > 0 &&
              ` (${selectedScheduleIds.length})`}
          </button>

          <button
            type="button"
            onClick={onDeleteAll}
            disabled={selectedSchedules.length === 0}
            className={`
              click-scale
              flex
              h-[36px]
              flex-1
              items-center
              justify-center
              rounded-lg
              text-[12px]
              font-semibold

              ${
                selectedSchedules.length > 0
                  ? "bg-[#FFF0F0] text-[#E5484D]"
                  : "cursor-default bg-[#F5F5F5] text-[#BBBBBB]"
              }
            `}
          >
            전체 삭제
          </button>
        </div>
      </div>
    );
  }

  // ====================
  // Normal Mode
  // ====================

  return (
    <div className="mt-[10px] flex justify-end">
      <button
        type="button"
        onClick={onEditStart}
        aria-label="일정 편집"
        className="
          click-scale-sm
          flex
          h-[28px]
          w-[28px]
          items-center
          justify-center
          text-[#191919]
        "
      >
        <MoreHorizontal size={20} strokeWidth={1.8} />
      </button>
    </div>
  );
}
