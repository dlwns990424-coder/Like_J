import { useEffect, useState } from "react";

import { Check, X } from "lucide-react";

import { createPortal } from "react-dom";

export default function Toast({ isOpen, message, onClose, duration = 2000 }) {
  // ====================
  // Animation
  // ====================

  const [isVisible, setIsVisible] = useState(false);

  // ====================
  // Close
  // ====================

  const handleClose = () => {
    setIsVisible(false);

    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  // ====================
  // Open / Auto Close
  // ====================

  useEffect(() => {
    if (!isOpen) {
      setIsVisible(false);

      return;
    }

    const openTimer = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    const closeTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    const removeTimer = setTimeout(() => {
      onClose?.();
    }, duration + 300);

    return () => {
      cancelAnimationFrame(openTimer);

      clearTimeout(closeTimer);

      clearTimeout(removeTimer);
    };
  }, [isOpen, duration, onClose]);

  // ====================
  // Render
  // ====================

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className={`
        fixed
        top-[calc(68px+env(safe-area-inset-top))]
        left-1/2
        z-[999999]
        w-[calc(100%-40px)]
        max-w-[350px]
        -translate-x-1/2

        transition-all
        duration-300
        ease-out

        ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-[8px] opacity-0"
        }
      `}
    >
      <div
        className="
          relative
          flex
          min-h-[48px]
          w-full
          items-center
          gap-[10px]
          rounded-xl
          border
          border-[#3478F6]
          bg-[#EAF2FF]
          px-[14px]
          py-[12px]
          pr-[42px]
          shadow-sm
        "
      >
        {/* ====================
            Icon
        ==================== */}

        <div
          className="
            flex
            h-[22px]
            w-[22px]
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#3478F6]
            text-white
          "
        >
          <Check size={14} strokeWidth={2.2} />
        </div>

        {/* ====================
            Message
        ==================== */}

        <p
          className="
            min-w-0
            flex-1
            text-[13px]
            font-medium
            leading-[20px]
            text-[#191919]
          "
        >
          {message}
        </p>

        {/* ====================
            Close
        ==================== */}

        <button
          type="button"
          onClick={handleClose}
          aria-label="알림 닫기"
          className="
            click-scale-sm
            absolute
            top-[8px]
            right-[8px]
            flex
            h-[28px]
            w-[28px]
            items-center
            justify-center
            text-[#555555]
          "
        >
          <X size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>,
    document.body,
  );
}
