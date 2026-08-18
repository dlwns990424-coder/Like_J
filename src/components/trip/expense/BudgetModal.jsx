import { useState } from "react";

import { X } from "lucide-react";

import { createPortal } from "react-dom";

export default function BudgetModal({
  isOpen,
  currency,
  initialBudget,
  onClose,
  onSave,
}) {
  const [budget, setBudget] = useState(
    initialBudget !== undefined && initialBudget !== null
      ? String(initialBudget)
      : "",
  );

  if (!isOpen) {
    return null;
  }

  // ====================
  // Save
  // ====================

  const handleSave = () => {
    const value = budget.replace(/,/g, "").trim();

    const amount = value === "" ? 0 : Number(value);

    if (Number.isNaN(amount)) {
      return;
    }

    onSave(amount);
  };

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
          w-full
          max-w-[390px]
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

        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold leading-[28px]">
            예산 설정
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="click-scale-sm flex h-[36px] w-[36px] items-center justify-center"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* ====================
            Currency
        ==================== */}

        <div className="mt-[24px]">
          <p className="text-[13px] leading-[20px] text-[#555555]">화폐 단위</p>

          <div className="mt-[8px] flex h-[52px] items-center rounded-xl bg-[#F5F5F5] px-[14px]">
            <span className="text-[15px] font-semibold">{currency.code}</span>

            <span className="ml-[8px] text-[13px] text-[#888888]">
              여행 국가 기준으로 자동 설정돼요.
            </span>
          </div>
        </div>

        {/* ====================
            Budget
        ==================== */}

        <div className="mt-[20px]">
          <label
            htmlFor="budget"
            className="text-[13px] leading-[20px] text-[#555555]"
          >
            여행 예산
          </label>

          <div className="mt-[8px] flex h-[52px] items-center rounded-xl bg-[#F5F5F5] px-[14px]">
            <span className="shrink-0 text-[16px] font-semibold">
              {currency.symbol}
            </span>

            <input
              id="budget"
              type="text"
              inputMode="numeric"
              value={budget}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");

                setBudget(value);
              }}
              placeholder="예산을 입력해주세요."
              className="
                ml-[8px]
                h-full
                min-w-0
                flex-1
                bg-transparent
                text-[16px]
                outline-none
                placeholder:text-[#888888]
              "
            />
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
            text-white
          "
        >
          저장
        </button>
      </section>
    </div>,
    document.body,
  );
}
