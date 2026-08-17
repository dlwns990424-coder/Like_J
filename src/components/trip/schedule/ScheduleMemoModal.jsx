import { useEffect, useRef, useState } from "react";

import { Trash2, X } from "lucide-react";

import { createPortal } from "react-dom";

const MAX_LENGTH = 200;

export default function ScheduleMemoModal({
  isOpen,
  initialMemo,
  onClose,
  onSave,
  onDelete,
}) {
  const [memo, setMemo] = useState("");

  const textareaRef = useRef(null);

  // ====================
  // Open
  // ====================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setMemo(initialMemo || "");

    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen, initialMemo]);

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
  // Change
  // ====================

  const handleChange = (e) => {
    const value = e.target.value;

    if (value.length > MAX_LENGTH) {
      return;
    }

    setMemo(value);
  };

  // ====================
  // Save
  // ====================

  const handleSave = () => {
    const trimmedMemo = memo.trim();

    onSave(trimmedMemo);
  };

  // ====================
  // Delete
  // ====================

  const handleDelete = () => {
    const confirmed = window.confirm("작성한 메모를 삭제할까요?");

    if (!confirmed) {
      return;
    }

    onDelete();
  };

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
        aria-labelledby="schedule-memo-title"
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
            id="schedule-memo-title"
            className="text-[20px] font-semibold leading-[28px] tracking-[-0.02em]"
          >
            하루 메모
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
            Memo
        ==================== */}

        <div className="mt-[20px]">
          <textarea
            ref={textareaRef}
            value={memo}
            onChange={handleChange}
            maxLength={MAX_LENGTH}
            placeholder="오늘 일정에 대한 메모를 작성해보세요."
            className="
              h-[160px]
              w-full
              resize-none
              rounded-xl
              border
              border-[#D9D9D9]
              bg-white
              p-[12px]
              text-[14px]
              leading-[22px]
              outline-none
              placeholder:text-[#AAAAAA]
              focus:border-[#3478F6]
            "
          />

          <div className="mt-[6px] flex items-center justify-between">
            {/* 삭제 */}

            <div>
              {initialMemo && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="
                    click-scale-sm
                    flex
                    items-center
                    gap-[5px]
                    text-[12px]
                    leading-[18px]
                    text-[#E5484D]
                  "
                >
                  <Trash2 size={14} strokeWidth={1.5} />

                  <span>메모 삭제</span>
                </button>
              )}
            </div>

            {/* 글자 수 */}

            <p className="text-[12px] leading-[18px] text-[#888888]">
              {memo.length} / {MAX_LENGTH}
            </p>
          </div>
        </div>

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
