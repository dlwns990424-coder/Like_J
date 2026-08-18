import { MapPin } from "lucide-react";

import { formatMoney } from "./expenseUtils";

export default function ExpenseList({
  scheduleExpenses,
  etcExpenses,
  currency,
  onExpenseClick,
}) {
  return (
    <>
      {/* ====================
          Schedule Expense
      ==================== */}

      <div className="mt-[18px]">
        <p className="text-[13px]  text-[#555555]">일정 지출</p>

        {scheduleExpenses.length > 0 ? (
          <div className="mt-[8px] flex flex-col gap-[8px]">
            {scheduleExpenses.map((expense) => (
              <button
                key={expense.id}
                type="button"
                onClick={() => {
                  onExpenseClick?.(expense);
                }}
                className="
                  click-scale
                  w-full
                  rounded-xl
                  border
                  border-[#D9D9D9]
                  bg-white
                  px-[14px]
                  py-[12px]
                  text-left
                "
              >
                <div className="flex items-start justify-between gap-[12px]">
                  {/* ====================
                      Content
                  ==================== */}

                  <div className="min-w-0">
                    <div className="flex items-center gap-[6px]">
                      <MapPin size={14} strokeWidth={1.5} />

                      <p className="truncate text-[16px] font-medium">
                        {expense.title}
                      </p>
                    </div>

                    {expense.memo && (
                      <p className="mt-[5px] text-[12px] text-[#888888]">
                        {expense.memo}
                      </p>
                    )}
                  </div>

                  {/* ====================
                      Amount
                  ==================== */}

                  <p className="shrink-0 text-[14px] font-medium">
                    {formatMoney(expense.amount, currency)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div
            className="
              mt-[8px]
              flex
              min-h-[100px]
              items-center
              justify-center
              rounded-xl
              bg-[#F5F5F5]
            "
          >
            <p className="text-[13px] text-[#888888]">
              등록된 일정 지출이 없어요.
            </p>
          </div>
        )}
      </div>

      {/* ====================
          Etc Expense
      ==================== */}

      <div className="mt-[20px]">
        <p className="text-[13px]  text-[#555555]">기타 지출</p>

        {etcExpenses.length > 0 ? (
          <div className="mt-[8px] flex flex-col gap-[8px]">
            {etcExpenses.map((expense) => (
              <button
                key={expense.id}
                type="button"
                onClick={() => {
                  onExpenseClick?.(expense);
                }}
                className="
                  click-scale
                  w-full
                  rounded-xl
                  border
                  border-[#D9D9D9]
                  bg-white
                  px-[14px]
                  py-[12px]
                  text-left
                "
              >
                <div className="flex items-start justify-between gap-[12px]">
                  {/* ====================
                      Content
                  ==================== */}

                  <div className="min-w-0">
                    <p className="truncate text-[16px] font-medium">
                      {expense.title}
                    </p>

                    {expense.memo && (
                      <p className="mt-[5px] text-[12px] text-[#888888]">
                        {expense.memo}
                      </p>
                    )}
                  </div>

                  {/* ====================
                      Amount
                  ==================== */}

                  <p className="shrink-0 text-[14px] font-semibold">
                    {formatMoney(expense.amount, currency)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div
            className="
              mt-[8px]
              flex
              min-h-[100px]
              items-center
              justify-center
              rounded-xl
              bg-[#F5F5F5]
            "
          >
            <p className="text-[13px] text-[#888888]">
              등록된 기타 지출이 없어요.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
