import { MoreHorizontal } from "lucide-react";

import { useState } from "react";

export default function ScheduleEditMenu({
  isEditMode,
  selectedSchedules,
  selectedScheduleIds,
  onEditStart,
  onEditComplete,
  onSelectAll,
  onSelectedDelete,
  onDeleteAll,
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (isEditMode) {
    return (
      <>
        <div className="mt-[14px] flex items-center justify-between">
          <p className="text-[13px] text-[#555555]">
            삭제할 일정을 선택해주세요.
          </p>

          <button
            type="button"
            onClick={onSelectAll}
            className="click-scale-sm text-[13px] font-medium text-[#3478F6]"
          >
            {selectedSchedules.length > 0 &&
            selectedScheduleIds.length === selectedSchedules.length
              ? "전체 해제"
              : "전체 선택"}
          </button>
        </div>

        <div className="mt-[20px] flex gap-[10px]">
          <button
            type="button"
            disabled={selectedScheduleIds.length === 0}
            onClick={onSelectedDelete}
            className={`
              flex
              h-[46px]
              flex-1
              items-center
              justify-center
              rounded-xl
              border
              text-[14px]
              font-semibold

              ${
                selectedScheduleIds.length > 0
                  ? "click-scale border-[#E5484D] text-[#E5484D]"
                  : "border-[#D9D9D9] text-[#BBBBBB]"
              }
            `}
          >
            선택 삭제
            {selectedScheduleIds.length > 0 && ` ${selectedScheduleIds.length}`}
          </button>

          <button
            type="button"
            onClick={onEditComplete}
            className="
              click-scale
              flex
              h-[46px]
              flex-1
              items-center
              justify-center
              rounded-xl
              bg-[#3478F6]
              text-[14px]
              font-semibold
              text-white
            "
          >
            편집 완료
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="relative mt-[8px] flex justify-end">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          click-scale-sm
          flex
          h-[38px]
          w-[38px]
          items-center
          justify-center
        "
      >
        <MoreHorizontal size={20} strokeWidth={1.5} />
      </button>

      {isOpen && (
        <div
          className="
            absolute
            top-[44px]
            right-0
            z-50
            w-[150px]
            overflow-hidden
            rounded-xl
            border
            border-[#D9D9D9]
            bg-white
          "
        >
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);

              onEditStart();
            }}
            className="
              click-scale
              flex
              h-[42px]
              w-full
              items-center
              px-[12px]
              text-[13px]
            "
          >
            일정 편집
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);

              onDeleteAll();
            }}
            className="
              click-scale
              flex
              h-[42px]
              w-full
              items-center
              border-t
              border-[#EEEEEE]
              px-[12px]
              text-[13px]
              text-[#E5484D]
            "
          >
            전체 삭제
          </button>
        </div>
      )}
    </div>
  );
}
