import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Calendar({
  currentMonth,
  setCurrentMonth,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  const today = new Date();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();

  const lastDate = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= lastDate; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  const normalizeDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const isSameDate = (dateA, dateB) => {
    if (!dateA || !dateB) return false;

    return (
      dateA.getFullYear() === dateB.getFullYear() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getDate() === dateB.getDate()
    );
  };

  const isPastDate = (date) => {
    const normalizedToday = normalizeDate(today);

    const normalizedDate = normalizeDate(date);

    return normalizedDate < normalizedToday;
  };

  const isInRange = (date) => {
    if (!startDate || !endDate) {
      return false;
    }

    const target = normalizeDate(date);
    const start = normalizeDate(startDate);
    const end = normalizeDate(endDate);

    return target >= start && target <= end;
  };

  const handleDateSelect = (date) => {
    if (isPastDate(date)) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
      return;
    }

    if (date < startDate) {
      setStartDate(date);
      setEndDate(null);
      return;
    }

    setEndDate(date);
  };

  const handlePrevMonth = () => {
    const previousMonth = new Date(year, month - 1, 1);

    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );

    if (previousMonth < currentMonthStart) {
      return;
    }

    setCurrentMonth(previousMonth);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const formatDate = (date) => {
    if (!date) return "";

    const y = date.getFullYear();

    const m = String(date.getMonth() + 1).padStart(2, "0");

    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="flex h-[40px] w-[40px] items-center justify-center"
        >
          <ChevronLeft size={22} strokeWidth={1.5} />
        </button>

        <h2 className="text-[20px] font-semibold leading-[28px] tracking-[-0.02em]">
          {year}년 {month + 1}월
        </h2>

        <button
          type="button"
          onClick={handleNextMonth}
          className="flex h-[40px] w-[40px] items-center justify-center"
        >
          <ChevronRight size={22} strokeWidth={1.5} />
        </button>
      </div>

      <div className="mt-[16px] grid grid-cols-7 text-center text-[12px] leading-[18px] text-[#888888]">
        <span>일</span>
        <span>월</span>
        <span>화</span>
        <span>수</span>
        <span>목</span>
        <span>금</span>
        <span>토</span>
      </div>

      <div className="mt-[8px] grid grid-cols-7 gap-y-[6px]">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-[44px]" />;
          }

          const isStart = isSameDate(date, startDate);

          const isEnd = isSameDate(date, endDate);

          const inRange = isInRange(date);

          const disabled = isPastDate(date);

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => handleDateSelect(date)}
              className={`
                relative
                flex
                h-[44px]
                items-center
                justify-center
                text-[14px]
                leading-[20px]

                ${disabled ? "cursor-default text-[#D9D9D9]" : "text-[#191919]"}

                ${inRange ? "bg-[#EAF2FF]" : ""}

                ${isStart ? "rounded-l-full" : ""}

                ${isEnd ? "rounded-r-full" : ""}
              `}
            >
              <span
                className={`
                  relative
                  z-10
                  flex
                  h-[36px]
                  w-[36px]
                  items-center
                  justify-center
                  rounded-full

                  ${isStart || isEnd ? "bg-[#3478F6] text-white" : ""}
                `}
              >
                {date.getDate()}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-[20px] flex items-center justify-center gap-[30px]">
        <div className="text-center">
          <p className="text-[12px] leading-[18px] text-[#888888]">시작일</p>

          <p className="mt-[2px] text-[16px] leading-[24px]">
            {startDate ? formatDate(startDate) : "선택해주세요"}
          </p>
        </div>

        <div className="text-center">
          <p className="text-[12px] leading-[18px] text-[#888888]">종료일</p>

          <p className="mt-[2px] text-[16px] leading-[24px]">
            {endDate ? formatDate(endDate) : "선택해주세요"}
          </p>
        </div>
      </div>
    </div>
  );
}
