import { useEffect, useState } from "react";

import { Check, ChevronDown, ChevronUp, X } from "lucide-react";

import { createPortal } from "react-dom";

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
// Time Picker
// ====================

function TimePicker({ value, onChange }) {
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
    <div className="grid grid-cols-[1fr_1fr_1fr] gap-[6px]">
      {/* ====================
          오전 / 오후
      ==================== */}

      <div className="relative">
        <button
          type="button"
          onClick={() =>
            setOpenMenu((prev) => (prev === "period" ? null : "period"))
          }
          className="
            flex
            h-[44px]
            w-full
            items-center
            justify-between
            rounded-lg
            border
            border-[#D9D9D9]
            bg-white
            px-[10px]
            text-[13px]
            outline-none
          "
        >
          <span className={value ? "text-[#191919]" : "text-[#888888]"}>
            {value ? parsedTime.period : "오전"}
          </span>

          {openMenu === "period" ? (
            <ChevronDown size={14} strokeWidth={1.5} className="shrink-0" />
          ) : (
            <ChevronUp size={14} strokeWidth={1.5} className="shrink-0" />
          )}
        </button>

        {openMenu === "period" && (
          <div
            className="
              absolute
              bottom-[50px]
              left-0
              z-[100010]
              w-full
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
                  h-[40px]
                  w-full
                  items-center
                  justify-between
                  px-[10px]
                  text-[13px]
                  hover:bg-[#F5F5F5]
                "
              >
                <span>{period}</span>

                {value && parsedTime.period === period && (
                  <Check size={14} strokeWidth={2} className="text-[#3478F6]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ====================
          시
      ==================== */}

      <div className="relative">
        <button
          type="button"
          onClick={() =>
            setOpenMenu((prev) => (prev === "hour" ? null : "hour"))
          }
          className="
            flex
            h-[44px]
            w-full
            items-center
            justify-between
            rounded-lg
            border
            border-[#D9D9D9]
            bg-white
            px-[10px]
            text-[13px]
            outline-none
          "
        >
          <span className={value ? "text-[#191919]" : "text-[#888888]"}>
            {value ? parsedTime.hour : "시"}
          </span>

          {openMenu === "hour" ? (
            <ChevronDown size={14} strokeWidth={1.5} className="shrink-0" />
          ) : (
            <ChevronUp size={14} strokeWidth={1.5} className="shrink-0" />
          )}
        </button>

        {openMenu === "hour" && (
          <div
            className="
              hide-scrollbar
              absolute
              bottom-[50px]
              left-0
              z-[100010]
              max-h-[180px]
              w-full
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
                  h-[40px]
                  w-full
                  shrink-0
                  items-center
                  justify-between
                  px-[10px]
                  text-[13px]
                  hover:bg-[#F5F5F5]
                "
              >
                <span>{hour}</span>

                {value && parsedTime.hour === hour && (
                  <Check size={14} strokeWidth={2} className="text-[#3478F6]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ====================
          분
      ==================== */}

      <div className="relative">
        <button
          type="button"
          onClick={() =>
            setOpenMenu((prev) => (prev === "minute" ? null : "minute"))
          }
          className="
            flex
            h-[44px]
            w-full
            items-center
            justify-between
            rounded-lg
            border
            border-[#D9D9D9]
            bg-white
            px-[10px]
            text-[13px]
            outline-none
          "
        >
          <span className={value ? "text-[#191919]" : "text-[#888888]"}>
            {value ? parsedTime.minute : "분"}
          </span>

          {openMenu === "minute" ? (
            <ChevronDown size={14} strokeWidth={1.5} className="shrink-0" />
          ) : (
            <ChevronUp size={14} strokeWidth={1.5} className="shrink-0" />
          )}
        </button>

        {openMenu === "minute" && (
          <div
            className="
              hide-scrollbar
              absolute
              bottom-[50px]
              right-0
              z-[100010]
              max-h-[180px]
              w-full
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
                  h-[40px]
                  w-full
                  shrink-0
                  items-center
                  justify-between
                  px-[10px]
                  text-[13px]
                  hover:bg-[#F5F5F5]
                "
              >
                <span>{minute}</span>

                {value && parsedTime.minute === minute && (
                  <Check size={14} strokeWidth={2} className="text-[#3478F6]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScheduleTimeModal({
  isOpen,
  startTime,
  endTime,
  onClose,
  onSave,
}) {
  const [start, setStart] = useState("");

  const [end, setEnd] = useState("");

  // ====================
  // Open
  // 기존 시간 동기화
  // ====================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setStart(startTime || "");

    setEnd(endTime || "");
  }, [isOpen, startTime, endTime]);

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

    body.style.overflow = "hidden";

    html.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousBodyOverflow;

      html.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen]);

  // ====================
  // Save
  // ====================

  const handleSave = () => {
    if (!start) {
      alert("시작 시간을 선택해주세요.");

      return;
    }

    if (end && end <= start) {
      alert("종료 시간은 시작 시간보다 늦어야 합니다.");

      return;
    }

    onSave(start, end);
  };

  // ====================
  // Time Delete
  // ====================

  const handleTimeDelete = () => {
    onSave("", "");
  };

  // ====================
  // Render Guard
  // ====================

  if (!isOpen) {
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
        aria-labelledby="schedule-time-title"
        className="
          relative
          z-[100000]
          max-h-[calc(100dvh-20px)]
          w-full
          max-w-[390px]
          overflow-visible
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
            id="schedule-time-title"
            className="
              text-[20px]
              font-semibold
              leading-[28px]
              tracking-[-0.02em]
            "
          >
            시간 설정
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
              items-center
              justify-center
            "
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* ====================
            Start Time
        ==================== */}

        <div className="mt-[24px]">
          <label
            className="
              mb-[8px]
              block
              text-[13px]
              leading-[20px]
              text-[#555555]
            "
          >
            시작 시간
          </label>

          <TimePicker value={start} onChange={setStart} />
        </div>

        {/* ====================
            End Time
        ==================== */}

        <div className="mt-[18px]">
          <label
            className="
              mb-[8px]
              block
              text-[13px]
              leading-[20px]
              text-[#555555]
            "
          >
            종료 시간
          </label>

          <TimePicker value={end} onChange={setEnd} />
        </div>

        {/* ====================
            시간 삭제
        ==================== */}

        {(startTime || endTime) && (
          <button
            type="button"
            onClick={handleTimeDelete}
            className="
              click-scale-sm
              mt-[16px]
              text-[13px]
              leading-[20px]
              text-[#E5484D]
            "
          >
            시간 삭제
          </button>
        )}

        {/* ====================
            Actions
        ==================== */}

        <div className="mt-[24px] flex gap-[10px]">
          <button
            type="button"
            onClick={onClose}
            className="
              click-scale
              flex
              h-[50px]
              flex-1
              items-center
              justify-center
              rounded-xl
              border
              border-[#D9D9D9]
              bg-white
              text-[14px]
              font-semibold
              text-[#555555]
            "
          >
            취소
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="
              click-scale
              flex
              h-[50px]
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
            저장
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
