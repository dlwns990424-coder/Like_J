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

export default function ScheduleDateTabs({ dates, selectedDate, onSelect }) {
  const selectedDateObject = dates.find(
    (date) => formatDateKey(date) === selectedDate,
  );

  return (
    <>
      {/* ====================
          Date Tabs
      ==================== */}

      <div
        className="
          hide-scrollbar
          flex
          gap-[8px]
          overflow-x-auto
          pb-[4px]
        "
      >
        {dates.map((date) => {
          const dateKey = formatDateKey(date);

          const isActive = dateKey === selectedDate;

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelect(date)}
              className={`
                  click-scale-sm
                  flex
                  h-[34px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  px-[12px]
                  text-[12px]
                  font-medium
                  leading-[18px]

                  ${
                    isActive
                      ? "bg-[#3478F6] text-white"
                      : "bg-[#F0F0F0] text-[#888888]"
                  }
                `}
            >
              {getShortDate(date)} {getWeekday(date)}
            </button>
          );
        })}
      </div>

      {/* ====================
          Selected Date
      ==================== */}

      {selectedDateObject && (
        <h2
          className="
            mt-[12px]
            text-[18px]
            font-semibold
            leading-[26px]
          "
        >
          {getShortDate(selectedDateObject)} {getWeekday(selectedDateObject)}
        </h2>
      )}
    </>
  );
}
