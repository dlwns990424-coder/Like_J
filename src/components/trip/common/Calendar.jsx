import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Calendar({
  currentMonth,
  setCurrentMonth,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  const year = currentMonth.getFullYear();

  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();

  const lastDate = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];

  const today = new Date();

  // ====================
  // Calendar Days
  // ====================

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= lastDate; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  // ====================
  // Date Utils
  // ====================

  const normalizeDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const isSameDate = (dateA, dateB) => {
    if (!dateA || !dateB) {
      return false;
    }

    return (
      dateA.getFullYear() === dateB.getFullYear() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getDate() === dateB.getDate()
    );
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

  // ====================
  // Date Select
  // ====================

  const handleDateSelect = (date) => {
    /*
      아무것도 선택하지 않은 상태
      또는 시작일 + 종료일이 모두 선택된 상태

      → 새 시작일 선택
    */

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);

      setEndDate(null);

      return;
    }

    /*
      두 번째로 선택한 날짜가
      기존 시작일보다 이전이면

      → 해당 날짜를 새로운 시작일로 변경
    */

    if (date < startDate) {
      setStartDate(date);

      setEndDate(null);

      return;
    }

    /*
      시작일 이후 날짜 선택

      → 종료일 설정
    */

    setEndDate(date);
  };

  // ====================
  // Month
  // ====================

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // ====================
  // Format
  // ====================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const y = date.getFullYear();

    const m = String(date.getMonth() + 1).padStart(2, "0");

    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  return (
    <div>
      {/* =========================
          Month Navigation
      ========================= */}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="
            click-scale-sm
            flex
            h-[40px]
            w-[40px]
            items-center
            justify-center
          "
        >
          <ChevronLeft size={22} strokeWidth={1.5} />
        </button>

        <h2
          className="
            text-[20px]
            font-semibold
            leading-[28px]
            tracking-[-0.02em]
          "
        >
          {year}년 {month + 1}월
        </h2>

        <button
          type="button"
          onClick={handleNextMonth}
          className="
            click-scale-sm
            flex
            h-[40px]
            w-[40px]
            items-center
            justify-center
          "
        >
          <ChevronRight size={22} strokeWidth={1.5} />
        </button>
      </div>

      {/* =========================
          Week
      ========================= */}

      <div
        className="
          mt-[16px]
          grid
          grid-cols-7
          text-center
          text-[12px]
          leading-[18px]
          text-[#888888]
        "
      >
        <span>일</span>
        <span>월</span>
        <span>화</span>
        <span>수</span>
        <span>목</span>
        <span>금</span>
        <span>토</span>
      </div>

      {/* =========================
          Calendar Days
      ========================= */}

      <div className="mt-[8px] grid grid-cols-7 gap-y-[6px]">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-[44px]" />;
          }

          const isStart = isSameDate(date, startDate);

          const isEnd = isSameDate(date, endDate);

          const inRange = isInRange(date);

          const isToday = isSameDate(date, today);

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => handleDateSelect(date)}
              className={`
                click-scale
                relative
                flex
                h-[44px]
                items-center
                justify-center
                text-[14px]
                leading-[20px]
                text-[#191919]

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

                {/* ====================
                    Today
                ==================== */}

                {isToday && (
                  <span
                    className={`
                      absolute
                      bottom-[3px]
                      h-[4px]
                      w-[4px]
                      rounded-full

                      ${isStart || isEnd ? "bg-white" : "bg-[#3478F6]"}
                    `}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* =========================
          Selected Date
      ========================= */}

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
