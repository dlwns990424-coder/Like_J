import { X } from "lucide-react";

import { createPortal } from "react-dom";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
  danger = false,
  showClose = false,
}) {
  if (!isOpen) {
    return null;
  }

  const hasCancel = typeof onCancel === "function";

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[999999]
        flex
        items-center
        justify-center
        bg-black/40
        px-5
      "
      onClick={() => {
        if (hasCancel) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="
          relative
          w-full
          max-w-[350px]
          rounded-2xl
          bg-white
          px-[20px]
          pt-[24px]
          pb-[16px]
          shadow-xl
        "
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* ====================
            Close
        ==================== */}

        {showClose && hasCancel && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="닫기"
            className="
              click-scale-sm
              absolute
              top-[12px]
              right-[12px]
              flex
              h-[32px]
              w-[32px]
              items-center
              justify-center
              text-[#555555]
            "
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        )}

        {/* ====================
            Title
        ==================== */}

        <h2 className="text-center text-[18px] font-semibold leading-[26px] tracking-[-0.02em] text-[#191919]">
          {title}
        </h2>

        {/* ====================
            Message
        ==================== */}

        {message && (
          <p className="mt-[10px] text-center text-[14px] leading-[20px] text-[#555555]">
            {message}
          </p>
        )}

        {/* ====================
            Buttons
        ==================== */}

        {hasCancel ? (
          <div className="mt-[24px] flex gap-[10px]">
            {/* ====================
                Cancel
            ==================== */}

            <button
              type="button"
              onClick={onCancel}
              className="
                click-scale
                flex
                h-[48px]
                flex-1
                items-center
                justify-center
                rounded-xl
                border
                border-[#D9D9D9]
                bg-white
                text-[16px]
                font-semibold
                leading-[24px]
                text-[#555555]
              "
            >
              {cancelText}
            </button>

            {/* ====================
                Confirm
            ==================== */}

            <button
              type="button"
              onClick={onConfirm}
              className={`
                click-scale
                flex
                h-[48px]
                flex-1
                items-center
                justify-center
                rounded-xl
                text-[16px]
                font-semibold
                leading-[24px]
                text-white

                ${danger ? "bg-[#E5484D]" : "bg-[#3478F6]"}
              `}
            >
              {confirmText}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onConfirm}
            className="
              click-scale
              mt-[24px]
              flex
              h-[48px]
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
            {confirmText}
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}
