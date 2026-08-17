import { useEffect, useState } from "react";

import { X } from "lucide-react";

import { createPortal } from "react-dom";

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
          w-full
          max-w-[390px]
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
            className="text-[20px] font-semibold leading-[28px] tracking-[-0.02em]"
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
            Time Inputs
        ==================== */}

        <div className="mt-[24px] flex gap-[12px]">
          {/* ====================
              Start
          ==================== */}

          <div className="min-w-0 flex-1">
            <label
              htmlFor="schedule-start-time"
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

            <input
              id="schedule-start-time"
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="
                h-[52px]
                w-full
                rounded-xl
                border
                border-[#D9D9D9]
                bg-white
                px-[12px]
                text-[16px]
                leading-[24px]
                outline-none
                focus:border-[#3478F6]
              "
            />
          </div>

          {/* ====================
              End
          ==================== */}

          <div className="min-w-0 flex-1">
            <label
              htmlFor="schedule-end-time"
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

            <input
              id="schedule-end-time"
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="
                h-[52px]
                w-full
                rounded-xl
                border
                border-[#D9D9D9]
                bg-white
                px-[12px]
                text-[16px]
                leading-[24px]
                outline-none
                focus:border-[#3478F6]
              "
            />
          </div>
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
