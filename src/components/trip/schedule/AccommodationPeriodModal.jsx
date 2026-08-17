import { useEffect, useState } from "react";

import { CalendarDays, Clock3, MapPin, X } from "lucide-react";

import { createPortal } from "react-dom";

export default function AccommodationPeriodModal({
  isOpen,
  place,
  trip,
  initialDate,
  onClose,
  onSave,
}) {
  const [checkInDate, setCheckInDate] = useState("");

  const [checkInTime, setCheckInTime] = useState("15:00");

  const [checkOutDate, setCheckOutDate] = useState("");

  const [checkOutTime, setCheckOutTime] = useState("11:00");

  // ====================
  // Modal Open
  // 초기값 설정
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

    setCheckOutDate(nextDate <= trip.endDate ? nextDate : trip.endDate);

    setCheckInTime("15:00");

    setCheckOutTime("11:00");
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
  // 체크인 날짜 변경
  // ====================

  const handleCheckInDateChange = (e) => {
    const value = e.target.value;

    setCheckInDate(value);

    if (!value) {
      return;
    }

    if (checkOutDate > value) {
      return;
    }

    const next = new Date(`${value}T00:00:00`);

    next.setDate(next.getDate() + 1);

    const year = next.getFullYear();

    const month = String(next.getMonth() + 1).padStart(2, "0");

    const day = String(next.getDate()).padStart(2, "0");

    const nextDate = `${year}-${month}-${day}`;

    setCheckOutDate(nextDate <= trip.endDate ? nextDate : trip.endDate);
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
            숙소 기간 설정
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
            Check In
        ==================== */}

        <div className="mt-[24px]">
          <p
            className="
              text-[14px]
              font-semibold
              leading-[20px]
            "
          >
            체크인
          </p>

          <div className="mt-[8px] flex gap-[10px]">
            <label className="relative min-w-0 flex-1">
              <CalendarDays
                size={16}
                strokeWidth={1.5}
                className="
                  pointer-events-none
                  absolute
                  top-1/2
                  left-[12px]
                  z-10
                  -translate-y-1/2
                  text-[#888888]
                "
              />

              <input
                type="date"
                min={trip.startDate}
                max={trip.endDate}
                value={checkInDate}
                onChange={handleCheckInDateChange}
                className="
                  h-[50px]
                  w-full
                  min-w-0
                  rounded-xl
                  border
                  border-[#D9D9D9]
                  bg-white
                  pl-[38px]
                  pr-[8px]
                  text-[13px]
                  leading-[20px]
                  outline-none
                  focus:border-[#3478F6]
                "
              />
            </label>

            <label className="relative w-[120px] shrink-0">
              <Clock3
                size={16}
                strokeWidth={1.5}
                className="
                  pointer-events-none
                  absolute
                  top-1/2
                  left-[12px]
                  z-10
                  -translate-y-1/2
                  text-[#888888]
                "
              />

              <input
                type="time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="
                  h-[50px]
                  w-full
                  rounded-xl
                  border
                  border-[#D9D9D9]
                  bg-white
                  pl-[38px]
                  pr-[8px]
                  text-[13px]
                  leading-[20px]
                  outline-none
                  focus:border-[#3478F6]
                "
              />
            </label>
          </div>
        </div>

        {/* ====================
            Check Out
        ==================== */}

        <div className="mt-[20px]">
          <p
            className="
              text-[14px]
              font-semibold
              leading-[20px]
            "
          >
            체크아웃
          </p>

          <div className="mt-[8px] flex gap-[10px]">
            <label className="relative min-w-0 flex-1">
              <CalendarDays
                size={16}
                strokeWidth={1.5}
                className="
                  pointer-events-none
                  absolute
                  top-1/2
                  left-[12px]
                  z-10
                  -translate-y-1/2
                  text-[#888888]
                "
              />

              <input
                type="date"
                min={checkInDate || trip.startDate}
                max={trip.endDate}
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="
                  h-[50px]
                  w-full
                  min-w-0
                  rounded-xl
                  border
                  border-[#D9D9D9]
                  bg-white
                  pl-[38px]
                  pr-[8px]
                  text-[13px]
                  leading-[20px]
                  outline-none
                  focus:border-[#3478F6]
                "
              />
            </label>

            <label className="relative w-[120px] shrink-0">
              <Clock3
                size={16}
                strokeWidth={1.5}
                className="
                  pointer-events-none
                  absolute
                  top-1/2
                  left-[12px]
                  z-10
                  -translate-y-1/2
                  text-[#888888]
                "
              />

              <input
                type="time"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                className="
                  h-[50px]
                  w-full
                  rounded-xl
                  border
                  border-[#D9D9D9]
                  bg-white
                  pl-[38px]
                  pr-[8px]
                  text-[13px]
                  leading-[20px]
                  outline-none
                  focus:border-[#3478F6]
                "
              />
            </label>
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
    </div>,
    document.body,
  );
}
