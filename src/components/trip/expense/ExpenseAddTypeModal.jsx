import { ChevronRight, X } from "lucide-react";

import { createPortal } from "react-dom";

export default function ExpenseAddTypeModal({
  isOpen,
  onClose,
  onSchedule,
  onEtc,
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
        items-end
        justify-center
        bg-black/40
      "
      onClick={onClose}
    >
      <section
        className="
          min-h-[430px]
          w-full
          max-w-[390px]
          rounded-t-[24px]
          bg-white
          px-5
          pt-[20px]
          pb-[calc(32px+env(safe-area-inset-bottom))]
        "
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* ====================
            Header
        ==================== */}

        <div className="flex items-center justify-between">
          <h2 className="text-[20px]  leading-[28px]">지출 추가</h2>

          <button
            type="button"
            onClick={onClose}
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
            Expense Type
        ==================== */}

        <div className="mt-[20px] flex flex-col gap-[10px]">
          {/* ====================
              Schedule
          ==================== */}

          <button
            type="button"
            onClick={onSchedule}
            className="
              click-scale
              flex
              min-h-[64px]
              w-full
              items-center
              justify-between
              rounded-xl
              border
              border-[#D9D9D9]
              px-[16px]
              text-left
            "
          >
            <div>
              <p className="text-[15px] font-semibold">일정에서 지출 추가</p>

              <p className="mt-[2px] text-[12px] text-[#888888]">
                선택한 Day의 일정에 지출을 기록해요.
              </p>
            </div>

            <ChevronRight
              size={18}
              strokeWidth={1.5}
              className="text-[#888888]"
            />
          </button>

          {/* ====================
              Etc
          ==================== */}

          <button
            type="button"
            onClick={onEtc}
            className="
              click-scale
              flex
              min-h-[64px]
              w-full
              items-center
              justify-between
              rounded-xl
              border
              border-[#D9D9D9]
              px-[16px]
              text-left
            "
          >
            <div>
              <p className="text-[15px] font-semibold">기타 지출 추가</p>

              <p className="mt-[2px] text-[12px] text-[#888888]">
                일정과 관계없는 지출을 기록해요.
              </p>
            </div>

            <ChevronRight
              size={18}
              strokeWidth={1.5}
              className="text-[#888888]"
            />
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
