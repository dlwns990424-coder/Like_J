import { MoreHorizontal } from "lucide-react";

import { useState } from "react";

export default function FavoritePlaceEditMenu({
  isEditMode,
  favoritePlaces,
  selectedPlaceIds,
  onEditStart,
  onEditComplete,
  onSelectAll,
  onSelectedDelete,
  onDeleteAll,
}) {
  const [isOpen, setIsOpen] = useState(false);

  // ====================
  // Edit Mode
  // ====================

  if (isEditMode) {
    return (
      <>
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-[#555555]">
            삭제할 관심 장소를 선택해주세요.
          </p>

          <button
            type="button"
            onClick={onSelectAll}
            className="click-scale-sm text-[13px] font-medium text-[#3478F6]"
          >
            {favoritePlaces.length > 0 &&
            selectedPlaceIds.length === favoritePlaces.length
              ? "전체 해제"
              : "전체 선택"}
          </button>
        </div>

        <div className="mt-[20px] flex gap-[10px]">
          <button
            type="button"
            disabled={selectedPlaceIds.length === 0}
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
                selectedPlaceIds.length > 0
                  ? "click-scale border-[#E5484D] text-[#E5484D]"
                  : "border-[#D9D9D9] text-[#BBBBBB]"
              }
            `}
          >
            선택 삭제
            {selectedPlaceIds.length > 0 && ` ${selectedPlaceIds.length}`}
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

  // ====================
  // Normal Mode
  // ====================

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
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

      {isOpen && (
        <div
          className="
            absolute
            top-[38px]
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
            관심 장소 편집
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
