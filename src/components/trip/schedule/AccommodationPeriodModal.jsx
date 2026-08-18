import { useEffect, useState } from "react";

import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  MapPin,
  X,
} from "lucide-react";

import { createPortal } from "react-dom";

import Calendar from "../common/Calendar";

// ====================
// Time Utils
// ====================

const HOURS = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, "0"),
);

const MINUTES = ["00", "10", "20", "30", "40", "50"];

const parseTime = (time) => {
  if (!time) {
    return {
      period: "오전",
      hour: "12",
      minute: "00",
    };
  }

  const [hourValue, minuteValue] = time.split(":");

  const hour24 = Number(hourValue);

  const period = hour24 >= 12 ? "오후" : "오전";

  let hour12 = hour24 % 12;

  if (hour12 === 0) {
    hour12 = 12;
  }

  return {
    period,

    hour: String(hour12).padStart(2, "0"),

    minute: minuteValue || "00",
  };
};

const to24HourTime = ({ period, hour, minute }) => {
  let hour24 = Number(hour);

  if (period === "오전" && hour24 === 12) {
    hour24 = 0;
  }

  if (period === "오후" && hour24 !== 12) {
    hour24 += 12;
  }

  return `${String(hour24).padStart(2, "0")}:${minute}`;
};

// ====================
// Date Utils
// ====================

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const formatDate = (date) => {
  if (!date) {
    return "";
  }

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// ====================
// Time Select
// ====================

function TimeSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const [openMenu, setOpenMenu] = useState(null);

  const parsedTime = parseTime(value);

  const handleChange = (type, nextValue) => {
    const nextTime = {
      ...parsedTime,

      [type]: nextValue,
    };

    onChange(to24HourTime(nextTime));

    setOpenMenu(null);
  };

  return (
    <div className="relative">
      {/* ====================
          Time Button
      ==================== */}

      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);

          setOpenMenu(null);
        }}
        className="
          flex
          h-[50px]
          w-full
          items-center
          gap-[6px]
          rounded-xl
          border
          border-[#D9D9D9]
          bg-white
          px-[10px]
          text-[13px]
          leading-[20px]
          outline-none
        "
      >
        <Clock3
          size={15}
          strokeWidth={1.5}
          className="
            shrink-0
            text-[#888888]
          "
        />

        <span
          className="
            min-w-0
            flex-1
            text-left
          "
        >
          {parsedTime.period} {parsedTime.hour}:{parsedTime.minute}
        </span>

        {isOpen ? (
          <ChevronDown size={14} strokeWidth={1.5} className="shrink-0" />
        ) : (
          <ChevronUp size={14} strokeWidth={1.5} className="shrink-0" />
        )}
      </button>

      {/* ====================
          Time Picker
      ==================== */}

      {isOpen && (
        <div
          className="
            absolute
            right-0
            bottom-[56px]
            z-[100020]
            w-[260px]
            rounded-xl
            border
            border-[#D9D9D9]
            bg-white
            p-[8px]
            shadow-lg
          "
        >
          <div className="grid grid-cols-3 gap-[6px]">
            {/* ====================
                Period
            ==================== */}

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenMenu((prev) => (prev === "period" ? null : "period"))
                }
                className="
                  flex
                  h-[42px]
                  w-full
                  items-center
                  justify-between
                  rounded-lg
                  border
                  border-[#D9D9D9]
                  bg-white
                  px-[9px]
                  text-[12px]
                "
              >
                <span>{parsedTime.period}</span>

                {openMenu === "period" ? (
                  <ChevronDown size={13} strokeWidth={1.5} />
                ) : (
                  <ChevronUp size={13} strokeWidth={1.5} />
                )}
              </button>

              {openMenu === "period" && (
                <div
                  className="
                    absolute
                    right-0
                    bottom-[48px]
                    left-0
                    z-[100030]
                    overflow-hidden
                    rounded-lg
                    border
                    border-[#D9D9D9]
                    bg-white
                    shadow-lg
                  "
                >
                  {["오전", "오후"].map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => handleChange("period", period)}
                      className="
                          flex
                          h-[38px]
                          w-full
                          items-center
                          justify-between
                          px-[9px]
                          text-[12px]
                        "
                    >
                      <span>{period}</span>

                      {parsedTime.period === period && (
                        <Check
                          size={13}
                          strokeWidth={2}
                          className="text-[#3478F6]"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ====================
                Hour
            ==================== */}

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenMenu((prev) => (prev === "hour" ? null : "hour"))
                }
                className="
                  flex
                  h-[42px]
                  w-full
                  items-center
                  justify-between
                  rounded-lg
                  border
                  border-[#D9D9D9]
                  bg-white
                  px-[9px]
                  text-[12px]
                "
              >
                <span>{parsedTime.hour}</span>

                {openMenu === "hour" ? (
                  <ChevronDown size={13} strokeWidth={1.5} />
                ) : (
                  <ChevronUp size={13} strokeWidth={1.5} />
                )}
              </button>

              {openMenu === "hour" && (
                <div
                  className="
                    hide-scrollbar
                    absolute
                    right-0
                    bottom-[48px]
                    left-0
                    z-[100030]
                    max-h-[180px]
                    overflow-y-auto
                    rounded-lg
                    border
                    border-[#D9D9D9]
                    bg-white
                    shadow-lg
                  "
                >
                  {HOURS.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => handleChange("hour", hour)}
                      className="
                          flex
                          h-[38px]
                          w-full
                          items-center
                          justify-between
                          px-[9px]
                          text-[12px]
                        "
                    >
                      <span>{hour}</span>

                      {parsedTime.hour === hour && (
                        <Check
                          size={13}
                          strokeWidth={2}
                          className="text-[#3478F6]"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ====================
                Minute
            ==================== */}

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenMenu((prev) => (prev === "minute" ? null : "minute"))
                }
                className="
                  flex
                  h-[42px]
                  w-full
                  items-center
                  justify-between
                  rounded-lg
                  border
                  border-[#D9D9D9]
                  bg-white
                  px-[9px]
                  text-[12px]
                "
              >
                <span>{parsedTime.minute}</span>

                {openMenu === "minute" ? (
                  <ChevronDown size={13} strokeWidth={1.5} />
                ) : (
                  <ChevronUp size={13} strokeWidth={1.5} />
                )}
              </button>

              {openMenu === "minute" && (
                <div
                  className="
                    hide-scrollbar
                    absolute
                    right-0
                    bottom-[48px]
                    left-0
                    z-[100030]
                    max-h-[180px]
                    overflow-y-auto
                    rounded-lg
                    border
                    border-[#D9D9D9]
                    bg-white
                    shadow-lg
                  "
                >
                  {MINUTES.map((minute) => (
                    <button
                      key={minute}
                      type="button"
                      onClick={() => handleChange("minute", minute)}
                      className="
                          flex
                          h-[38px]
                          w-full
                          items-center
                          justify-between
                          px-[9px]
                          text-[12px]
                        "
                    >
                      <span>{minute}</span>

                      {parsedTime.minute === minute && (
                        <Check
                          size={13}
                          strokeWidth={2}
                          className="text-[#3478F6]"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccommodationPeriodModal({
  isOpen,
  place,
  trip,
  initialDate,
  onClose,
  onSave,
}) {
  // ====================
  // Accommodation Date
  // ====================

  const [checkInDate, setCheckInDate] = useState("");

  const [checkOutDate, setCheckOutDate] = useState("");

  // ====================
  // Accommodation Time
  // ====================

  const [checkInTime, setCheckInTime] = useState("15:00");

  const [checkOutTime, setCheckOutTime] = useState("11:00");

  // ====================
  // Calendar
  // ====================

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [calendarStartDate, setCalendarStartDate] = useState(null);

  const [calendarEndDate, setCalendarEndDate] = useState(null);

  // ====================
  // Modal Open
  // ====================

  useEffect(() => {
    if (!isOpen || !trip) {
      return;
    }

    const firstDate =
      initialDate &&
      initialDate >= trip.startDate &&
      initialDate <= trip.endDate
        ? initialDate
        : trip.startDate;

    setCheckInDate(firstDate);

    const checkIn = new Date(`${firstDate}T00:00:00`);

    checkIn.setDate(checkIn.getDate() + 1);

    const year = checkIn.getFullYear();

    const month = String(checkIn.getMonth() + 1).padStart(2, "0");

    const day = String(checkIn.getDate()).padStart(2, "0");

    const nextDate = `${year}-${month}-${day}`;

    const nextCheckOut = nextDate <= trip.endDate ? nextDate : trip.endDate;

    setCheckOutDate(nextCheckOut);

    setCheckInTime("15:00");

    setCheckOutTime("11:00");

    setCalendarStartDate(parseDate(firstDate));

    setCalendarEndDate(parseDate(nextCheckOut));

    setCurrentMonth(parseDate(firstDate) || new Date());

    setIsCalendarOpen(false);
  }, [isOpen, initialDate, trip]);

  // ====================
  // Scroll Lock
  // ====================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const body = document.body;

    const html = document.documentElement;

    const previousBodyOverflow = body.style.overflow;

    const previousHtmlOverflow = html.style.overflow;

    const previousTouchAction = body.style.touchAction;

    body.style.overflow = "hidden";

    html.style.overflow = "hidden";

    body.style.touchAction = "none";

    return () => {
      body.style.overflow = previousBodyOverflow;

      html.style.overflow = previousHtmlOverflow;

      body.style.touchAction = previousTouchAction;
    };
  }, [isOpen]);

  // ====================
  // Calendar Open
  // ====================

  const handleCalendarOpen = () => {
    const startDate = parseDate(checkInDate);

    const endDate = parseDate(checkOutDate);

    setCalendarStartDate(startDate);

    setCalendarEndDate(endDate);

    setCurrentMonth(startDate || parseDate(trip.startDate) || new Date());

    setIsCalendarOpen(true);
  };

  // ====================
  // Calendar Close
  // ====================

  const handleCalendarClose = () => {
    setIsCalendarOpen(false);
  };

  // ====================
  // Calendar Apply
  // ====================

  const handleCalendarApply = () => {
    if (!calendarStartDate) {
      alert("체크인 날짜를 선택해주세요.");

      return;
    }

    if (!calendarEndDate) {
      alert("체크아웃 날짜를 선택해주세요.");

      return;
    }

    const start = formatDate(calendarStartDate);

    const end = formatDate(calendarEndDate);

    if (start < trip.startDate || start > trip.endDate) {
      alert("체크인 날짜는 여행 기간 안에서 선택해주세요.");

      return;
    }

    if (end < trip.startDate || end > trip.endDate) {
      alert("체크아웃 날짜는 여행 기간 안에서 선택해주세요.");

      return;
    }

    if (end <= start) {
      alert("체크아웃 날짜는 체크인 날짜보다 뒤여야 합니다.");

      return;
    }

    setCheckInDate(start);

    setCheckOutDate(end);

    setIsCalendarOpen(false);
  };

  // ====================
  // Save
  // ====================

  const handleSave = () => {
    if (!checkInDate) {
      alert("체크인 날짜를 선택해주세요.");

      return;
    }

    if (!checkOutDate) {
      alert("체크아웃 날짜를 선택해주세요.");

      return;
    }

    if (checkInDate < trip.startDate || checkInDate > trip.endDate) {
      alert("체크인 날짜는 여행 기간 안에서 선택해주세요.");

      return;
    }

    if (checkOutDate < trip.startDate || checkOutDate > trip.endDate) {
      alert("체크아웃 날짜는 여행 기간 안에서 선택해주세요.");

      return;
    }

    if (checkOutDate <= checkInDate) {
      alert("체크아웃 날짜는 체크인 날짜보다 뒤여야 합니다.");

      return;
    }

    if (!checkInTime) {
      alert("체크인 시간을 선택해주세요.");

      return;
    }

    if (!checkOutTime) {
      alert("체크아웃 시간을 선택해주세요.");

      return;
    }

    onSave({
      checkInDate,

      checkInTime,

      checkOutDate,

      checkOutTime,
    });
  };

  // ====================
  // Render Guard
  // ====================

  if (!isOpen || !place || !trip) {
    return null;
  }

  return createPortal(
    <>
      {/* ====================
          Accommodation Modal
      ==================== */}

      <div
        className="
          fixed
          inset-0
          z-[99999]
          flex
          items-end
          justify-center
          bg-black/40
        "
        onClick={onClose}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="accommodation-period-title"
          className="
            relative
            z-[100000]
            max-h-[90dvh]
            w-full
            max-w-[390px]
            overflow-y-auto
            overflow-x-hidden
            rounded-t-[24px]
            bg-white
            px-5
            pt-[20px]
            pb-[calc(24px+env(safe-area-inset-bottom))]
            text-[#191919]
          "
          onClick={(e) => {
            e.stopPropagation();
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
        >
          {/* ====================
              Header
          ==================== */}

          <div className="flex items-center justify-between">
            <h2
              id="accommodation-period-title"
              className="
                text-[20px]
                font-semibold
                leading-[28px]
                tracking-[-0.02em]
              "
            >
              숙소 설정
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="
                click-scale-sm
                flex
                h-[36px]
                w-[36px]
                shrink-0
                items-center
                justify-center
              "
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* ====================
              Place
          ==================== */}

          <div
            className="
              mt-[20px]
              flex
              items-center
              gap-[12px]
              rounded-xl
              border
              border-[#D9D9D9]
              p-[10px]
            "
          >
            <div
              className="
                h-[58px]
                w-[58px]
                shrink-0
                overflow-hidden
                rounded-lg
                bg-[#D9D9D9]
              "
            >
              {place.imageUrl && (
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="
                  truncate
                  text-[15px]
                  font-semibold
                  leading-[22px]
                "
              >
                {place.name}
              </p>

              {place.address && (
                <div className="mt-[4px] flex items-start gap-[4px]">
                  <MapPin
                    size={12}
                    strokeWidth={1.5}
                    className="
                      mt-[2px]
                      shrink-0
                      text-[#888888]
                    "
                  />

                  <p
                    className="
                      line-clamp-2
                      text-[11px]
                      leading-[16px]
                      text-[#888888]
                    "
                  >
                    {place.address}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ====================
              Accommodation Period
          ==================== */}

          <div className="mt-[24px]">
            <p
              className="
                text-[14px]
                font-semibold
                leading-[20px]
              "
            >
              숙박 기간
            </p>

            <button
              type="button"
              onClick={handleCalendarOpen}
              className="
                click-scale-sm
                mt-[8px]
                flex
                h-[50px]
                w-full
                items-center
                gap-[8px]
                rounded-xl
                border
                border-[#D9D9D9]
                bg-white
                px-[12px]
                text-[13px]
              "
            >
              <CalendarDays
                size={16}
                strokeWidth={1.5}
                className="
                  shrink-0
                  text-[#888888]
                "
              />

              <span>{checkInDate}</span>

              <span className="text-[#888888]">~</span>

              <span>{checkOutDate}</span>
            </button>
          </div>

          {/* ====================
              Check In / Check Out
          ==================== */}

          <div className="mt-[24px] grid grid-cols-2 gap-[12px]">
            {/* ====================
                Check In
            ==================== */}

            <div className="min-w-0">
              <p
                className="
                  text-[14px]
                  font-semibold
                  leading-[20px]
                "
              >
                체크인
              </p>

              <div
                className="
                  mt-[8px]
                  rounded-xl
                  bg-[#F5F5F5]
                  px-[10px]
                  py-[8px]
                "
              >
                <p
                  className="
                    truncate
                    text-[12px]
                    leading-[18px]
                    text-[#555555]
                  "
                >
                  {checkInDate}
                </p>
              </div>

              <div className="mt-[8px]">
                <TimeSelect value={checkInTime} onChange={setCheckInTime} />
              </div>
            </div>

            {/* ====================
                Check Out
            ==================== */}

            <div className="min-w-0">
              <p
                className="
                  text-[14px]
                  font-semibold
                  leading-[20px]
                "
              >
                체크아웃
              </p>

              <div
                className="
                  mt-[8px]
                  rounded-xl
                  bg-[#F5F5F5]
                  px-[10px]
                  py-[8px]
                "
              >
                <p
                  className="
                    truncate
                    text-[12px]
                    leading-[18px]
                    text-[#555555]
                  "
                >
                  {checkOutDate}
                </p>
              </div>

              <div className="mt-[8px]">
                <TimeSelect value={checkOutTime} onChange={setCheckOutTime} />
              </div>
            </div>
          </div>

          {/* ====================
              Save
          ==================== */}

          <button
            type="button"
            onClick={handleSave}
            className="
              click-scale
              mt-[28px]
              flex
              h-[52px]
              w-full
              items-center
              justify-center
              rounded-xl
              bg-[#3478F6]
              text-[16px]
              font-semibold
              leading-[24px]
              text-white
            "
          >
            숙소 지정
          </button>
        </section>
      </div>

      {/* ====================
          Calendar Modal
      ==================== */}

      {isCalendarOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100100]
            flex
            items-end
            justify-center
            bg-black/40
          "
          onClick={handleCalendarClose}
        >
          <section
            className="
              max-h-[90dvh]
              w-full
              max-w-[390px]
              overflow-y-auto
              rounded-t-[24px]
              bg-white
              px-5
              pt-[20px]
              pb-[calc(24px+env(safe-area-inset-bottom))]
              text-[#191919]
            "
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {/* ====================
                Header
            ==================== */}

            <div className="mb-[20px] flex items-center justify-between">
              <h2
                className="
                  text-[20px]
                  font-semibold
                  leading-[28px]
                  tracking-[-0.02em]
                "
              >
                숙소 날짜 선택
              </h2>

              <button
                type="button"
                onClick={handleCalendarClose}
                className="
                  click-scale-sm
                  flex
                  h-[36px]
                  w-[36px]
                  items-center
                  justify-center
                "
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* ====================
                Calendar
            ==================== */}

            <Calendar
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              startDate={calendarStartDate}
              setStartDate={setCalendarStartDate}
              endDate={calendarEndDate}
              setEndDate={setCalendarEndDate}
            />

            {/* ====================
                Apply
            ==================== */}

            <button
              type="button"
              onClick={handleCalendarApply}
              className="
                click-scale
                mt-[24px]
                flex
                h-[52px]
                w-full
                items-center
                justify-center
                rounded-xl
                bg-[#3478F6]
                text-[16px]
                font-semibold
                text-white
              "
            >
              날짜 적용
            </button>
          </section>
        </div>
      )}
    </>,
    document.body,
  );
}
