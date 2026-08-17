import { ChevronDown, Check } from "lucide-react";

import { useState } from "react";

export default function ScheduleSortMenu({ sortType, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  // ====================
  // Sort Label
  // ====================

  const getSortLabel = () => {
    if (sortType === "order") {
      return "추가순";
    }

    return "시간순";
  };

  // ====================
  // Select
  // ====================

  const handleSelect = (value) => {
    onChange(value);

    setIsOpen(false);
  };

  return (
    <div className="relative flex justify-end">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          click-scale-sm
          flex
          h-[28px]
          items-center
          gap-[4px]
          text-[11px]
          leading-[16px]
          text-[#555555]
        "
      >
        <span>정렬 기준</span>

        <strong className="font-semibold text-[#191919]">
          {getSortLabel()}
        </strong>

        <ChevronDown
          size={13}
          strokeWidth={1.5}
          className={`
            transition-transform
            duration-200

            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* ====================
          Dropdown
      ==================== */}

      {isOpen && (
        <div
          className="
            absolute
            top-[32px]
            right-0
            z-40
            w-[120px]
            overflow-hidden
            rounded-xl
            border
            border-[#E5E5E5]
            bg-white
            p-[4px]
            shadow-lg
          "
        >
          <button
            type="button"
            onClick={() => handleSelect("time")}
            className="
              flex
              h-[36px]
              w-full
              items-center
              justify-between
              rounded-lg
              px-[10px]
              text-[12px]
              text-[#191919]
              hover:bg-[#F5F5F5]
            "
          >
            <span>시간순</span>

            {sortType === "time" && (
              <Check size={14} strokeWidth={1.8} className="text-[#3478F6]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSelect("order")}
            className="
              flex
              h-[36px]
              w-full
              items-center
              justify-between
              rounded-lg
              px-[10px]
              text-[12px]
              text-[#191919]
              hover:bg-[#F5F5F5]
            "
          >
            <span>추가순</span>

            {sortType === "order" && (
              <Check size={14} strokeWidth={1.8} className="text-[#3478F6]" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
