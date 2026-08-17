import { Check, X } from "lucide-react";
import { createPortal } from "react-dom";

export default function FavoriteAddSuccessModal({
  isOpen,
  tripTitle,
  placeName,
  onClose,
}) {
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
        items-center
        justify-center
        bg-black/40
        px-5
      "
      onClick={onClose}
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
    >
      {/* ====================
          Modal
      ==================== */}

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="favorite-success-title"
        className="
          relative
          z-[100000]
          w-full
          max-w-[350px]
          rounded-2xl
          bg-white
          px-[20px]
          pt-[20px]
          pb-[20px]
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
            Close
        ==================== */}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="
              click-scale-sm
              flex
              h-[32px]
              w-[32px]
              items-center
              justify-center
            "
          >
            <X size={19} strokeWidth={1.5} />
          </button>
        </div>

        {/* ====================
            Icon
        ==================== */}

        <div
          className="
            mx-auto
            flex
            h-[52px]
            w-[52px]
            items-center
            justify-center
            rounded-full
            bg-[#EEF4FF]
            text-[#3478F6]
          "
        >
          <Check size={26} strokeWidth={2} />
        </div>

        {/* ====================
            Text
        ==================== */}

        <div className="mt-[18px] text-center">
          <h2
            id="favorite-success-title"
            className="
              text-[18px]
              font-semibold
              leading-[26px]
              tracking-[-0.02em]
            "
          >
            관심 장소 추가 완료
          </h2>

          {placeName && (
            <p
              className="
                mt-[10px]
                truncate
                text-[14px]
                font-semibold
                leading-[20px]
              "
            >
              {placeName}
            </p>
          )}

          <p
            className="
              mt-[6px]
              text-[13px]
              leading-[20px]
              text-[#777777]
            "
          >
            <span className="font-semibold text-[#191919]">{tripTitle}</span>
            의 관심 장소에
            <br />
            추가되었습니다.
          </p>
        </div>

        {/* ====================
            완료
        ==================== */}

        <button
          type="button"
          onClick={onClose}
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
            text-[15px]
            font-semibold
            text-white
          "
        >
          완료
        </button>
      </section>
    </div>,
    document.body,
  );
}
