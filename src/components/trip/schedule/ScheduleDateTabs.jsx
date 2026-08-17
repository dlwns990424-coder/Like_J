import { useEffect, useRef } from "react";

// ====================
// Date Utils
// ====================

const formatDateKey = (date) => {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getWeekday = (date) => {
  return ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
};

const getShortDate = (date) => {
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

export default function ScheduleDateTabs({
  dates = [],
  selectedDate,
  onSelect,
}) {
  const buttonRefs = useRef({});

  // ====================
  // 선택 날짜 자동 Scroll
  // ====================

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    const selectedButton = buttonRefs.current[selectedDate];

    if (!selectedButton) {
      return;
    }

    selectedButton.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [selectedDate]);

  return (
    <div
      className="
        hide-scrollbar
        flex
        w-full
        gap-[8px]
        overflow-x-auto
        overscroll-x-contain
        scroll-smooth
        py-[2px]
      "
    >
      {dates.map((date) => {
        const dateKey = formatDateKey(date);

        const isSelected = dateKey === selectedDate;

        return (
          <button
            key={dateKey}
            ref={(element) => {
              if (element) {
                buttonRefs.current[dateKey] = element;
              } else {
                delete buttonRefs.current[dateKey];
              }
            }}
            type="button"
            onClick={() => onSelect(date)}
            className={`
              click-scale-sm
              flex
              h-[36px]
              shrink-0
              items-center
              justify-center
              rounded-full
              px-[14px]
              text-[12px]
              font-semibold
              leading-[18px]
              transition-colors
              duration-200

              ${
                isSelected
                  ? "bg-[#3478F6] text-white"
                  : "bg-[#F1F1F1] text-[#888888]"
              }
            `}
          >
            {getWeekday(date)} {getShortDate(date)}
          </button>
        );
      })}
    </div>
  );
}
