import { useState } from "react";

import { ChevronLeft, X } from "lucide-react";

import { createPortal } from "react-dom";

export default function ExpenseRecordModal({
  isOpen,
  type,
  schedule,
  currency,
  editingExpense,
  onClose,
  onBack,
  onSave,
}) {
  const isSchedule = type === "schedule";

  const isEditing = Boolean(editingExpense);

  // ====================
  // State
  // ====================

  const [title, setTitle] = useState(editingExpense?.title || "");

  const [amount, setAmount] = useState(
    editingExpense?.amount !== undefined && editingExpense?.amount !== null
      ? String(editingExpense.amount)
      : "",
  );

  const [memo, setMemo] = useState(editingExpense?.memo || "");

  if (!isOpen) {
    return null;
  }

  // ====================
  // Memo Change
  // ====================

  const handleMemoChange = (e) => {
    const value = e.target.value;

    if (value.length > 50) {
      return;
    }

    setMemo(value);
  };

  // ====================
  // Save
  // ====================

  const handleSave = () => {
    const expenseAmount = amount.trim() === "" ? 0 : Number(amount);

    if (Number.isNaN(expenseAmount) || expenseAmount < 0) {
      return;
    }

    if (!isSchedule && !title.trim()) {
      return;
    }

    onSave({
      title: isSchedule
        ? schedule?.name || editingExpense?.title || ""
        : title.trim(),

      amount: expenseAmount,

      memo: memo.trim(),
    });
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

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-[8px]">
            <button
              type="button"
              onClick={onBack}
              aria-label="뒤로가기"
              className="
                click-scale-sm
                flex
                h-[36px]
                w-[36px]
                shrink-0
                items-center
                justify-center
                -ml-[8px]
              "
            >
              <ChevronLeft size={22} strokeWidth={1.5} />
            </button>

            <div>
              <h2 className="text-[20px] font-semibold leading-[28px]">
                {isEditing ? "지출 수정" : "지출 기록"}
              </h2>

              {isSchedule && (
                <p className="mt-[4px] text-[13px] text-[#888888]">
                  {schedule?.name || editingExpense?.title}
                </p>
              )}
            </div>
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
            Etc Title
        ==================== */}

        {!isSchedule && (
          <div className="mt-[24px]">
            <label className="text-[13px] text-[#555555]">지출 내용</label>

            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="지출 내용을 입력해주세요."
              className="
                mt-[8px]
                h-[52px]
                w-full
                rounded-xl
                bg-[#F5F5F5]
                px-[14px]
                text-[15px]
                outline-none
                placeholder:text-[#888888]
              "
            />
          </div>
        )}

        {/* ====================
            Amount
        ==================== */}

        <div className="mt-[20px]">
          <label className="text-[13px] text-[#555555]">금액</label>

          <div className="mt-[8px] flex h-[52px] items-center rounded-xl bg-[#F5F5F5] px-[14px]">
            <span className="shrink-0 text-[16px] font-semibold">
              {currency.symbol}
            </span>

            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value.replace(/[^0-9]/g, ""));
              }}
              placeholder="금액을 입력해주세요."
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
            Memo
        ==================== */}

        <div className="mt-[20px]">
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-[#555555]">메모</label>

            <span className="text-[12px] text-[#888888]">{memo.length}/50</span>
          </div>

          <textarea
            value={memo}
            onChange={handleMemoChange}
            maxLength={50}
            placeholder="메모를 입력해주세요."
            className="
              mt-[8px]
              h-[90px]
              w-full
              resize-none
              rounded-xl
              bg-[#F5F5F5]
              px-[14px]
              py-[12px]
              text-[14px]
              outline-none
              placeholder:text-[#888888]
            "
          />
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
