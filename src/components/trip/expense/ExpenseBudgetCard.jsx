import { formatMoney } from "./expenseUtils";

export default function ExpenseBudgetCard({
  budget,
  totalExpense,
  remainingBudget,
  usagePercentage,
  currency,
  onEdit,
}) {
  const isOverBudget = remainingBudget < 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onEdit}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onEdit?.();
        }
      }}
      className="
        click-scale
        mt-[20px]
        cursor-pointer
        rounded-2xl
        bg-[#F5F5F5]
        p-[16px]
        mb-4
      "
    >
      {/* ====================
          Header
      ==================== */}

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] leading-[20px] text-[#888888]">여행 예산</p>

          <p className="mt-[4px] text-[24px] font-bold leading-[32px]">
            {formatMoney(budget, currency)}
          </p>
        </div>

        <span className="text-[13px] font-medium text-[#3478F6]">
          {budget > 0 ? "수정" : "예산 설정"}
        </span>
      </div>

      {/* ====================
          Budget Status
      ==================== */}

      {budget > 0 && (
        <>
          {/* ====================
              Progress
          ==================== */}

          <div className="mt-[20px] h-[6px] overflow-hidden rounded-full bg-[#D9D9D9]">
            <div
              className="h-full rounded-full bg-[#3478F6]"
              style={{
                width: `${usagePercentage}%`,
              }}
            />
          </div>

          {/* ====================
              Summary
          ==================== */}

          <div className="mt-[12px] flex items-center justify-between">
            <div>
              <p className="text-[12px] text-[#888888]">총 지출</p>

              <p className="mt-[2px] text-[14px] font-semibold">
                {formatMoney(totalExpense, currency)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[12px] text-[#888888]">남은 예산</p>

              <p
                className={`
                  mt-[2px]
                  text-[14px]
                  font-semibold

                  ${isOverBudget ? "text-[#E5484D]" : "text-[#191919]"}
                `}
              >
                {formatMoney(remainingBudget, currency)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
