import { useEffect, useState } from "react";

import { X } from "lucide-react";

import { createPortal } from "react-dom";

import Calendar from "./Calendar";

// ====================
// Parse Date
// ====================

const parseDate = (dateString) => {
  if (!dateString) {
    return null;
  }

  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day);
};

// ====================
// Format Date
// ====================

const formatDate = (date) => {
  if (!date) {
    return "";
  }

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function TripDateEditModal({ isOpen, trip, onClose, onSave }) {
  // ====================
  // State
  // ====================

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  // ====================
  // Open
  // ====================

  useEffect(() => {
    if (!isOpen || !trip) {
      return;
    }

    const start = parseDate(trip.startDate);

    const end = parseDate(trip.endDate);

    setStartDate(start);

    setEndDate(end);

    setCurrentMonth(start || new Date());
  }, [isOpen, trip?.startDate, trip?.endDate]);

  // ====================
  // Body Scroll
  // ====================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // ====================
  // Save
  // ====================

  const handleSave = () => {
    if (!startDate || !endDate) {
      return;
    }

    onSave?.({
      startDate: formatDate(startDate),

      endDate: formatDate(endDate),
    });
  };

  // ====================
  // Render
  // ====================

  if (!isOpen || !trip) {
    return null;
  }

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[999999]
        flex
        items-end
        justify-center
        bg-black/40
      "
      onClick={onClose}
    >
      <div
        className="
          hide-scrollbar
          max-h-[90dvh]
          w-full
          max-w-[390px]
          overflow-y-auto
          rounded-t-[24px]
          bg-white
          px-5
          pt-[20px]
          pb-[calc(24px+env(safe-area-inset-bottom))]
        "
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* ====================
            Header
        ==================== */}

        <div className="flex items-start justify-between">
          <div>
            <h2
              className="
                text-[20px]
                font-semibold
                leading-[28px]
                tracking-[-0.02em]
              "
            >
              여행 일정 수정
            </h2>

            <p
              className="
                mt-[4px]
                text-[13px]
                leading-[20px]
                text-[#888888]
              "
            >
              새로운 여행 기간을 선택해주세요.
            </p>
          </div>

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
            Calendar
        ==================== */}

        <div className="mt-[24px]">
          <Calendar
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>

        {/* ====================
            Change Button
        ==================== */}

        <button
          type="button"
          disabled={!startDate || !endDate}
          onClick={handleSave}
          className={`
            mt-[28px]
            flex
            h-[52px]
            w-full
            items-center
            justify-center
            rounded-xl
            text-[16px]
            font-semibold
            leading-[24px]
            text-white

            ${
              startDate && endDate ? "click-scale bg-[#3478F6]" : "bg-[#BBBBBB]"
            }
          `}
        >
          변경
        </button>
      </div>
    </div>,
    document.body,
  );
}
