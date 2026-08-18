import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";

import { createPortal } from "react-dom";

export default function ScheduleExpenseSelectModal({
  isOpen,
  schedules,
  scheduleExpenses,
  onClose,
  onBack,
  onSelect,
}) {
  if (!isOpen) {
    return null;
  }

  // ====================
  // Expense Check
  // ====================

  const hasExpense = (scheduleId) => {
    return scheduleExpenses.some(
      (expense) =>
        expense.type === "schedule" && expense.scheduleId === scheduleId,
    );
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
          flex
    h-[560px]
    max-h-[80dvh]
    w-full
    max-w-[390px]
    flex-col
    overflow-hidden
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

        <div className="flex shrink-0 items-start justify-between">
          <div className="flex items-start gap-[8px]">
            <button
              type="button"
              onClick={onBack}
              aria-label="뒤로가기"
              className="
                click-scale-sm
                -ml-[8px]
                flex
                h-[36px]
                w-[36px]
                shrink-0
                items-center
                justify-center
              "
            >
              <ChevronLeft size={22} strokeWidth={1.5} />
            </button>

            <div>
              <h2 className="text-[20px] font-semibold">일정 선택</h2>

              <p className="mt-[4px] text-[13px] text-[#888888]">
                현재 선택한 Day의 일정이에요.
              </p>
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
            Schedule List
        ==================== */}

        {schedules.length > 0 ? (
          <div
            className="
              hide-scrollbar
              mt-[20px]
              flex
              min-h-0
              flex-1
              flex-col
              gap-[8px]
              overflow-y-auto
              overscroll-y-contain
              pr-[2px]
            "
          >
            {schedules.map((schedule) => {
              const registered = hasExpense(schedule.id);

              return (
                <button
                  key={schedule.id}
                  type="button"
                  disabled={registered}
                  onClick={() => {
                    if (registered) {
                      return;
                    }

                    onSelect(schedule);
                  }}
                  className={`
                    flex
                    min-h-[60px]
                    w-full
                    shrink-0
                    items-center
                    justify-between
                    rounded-xl
                    border
                    px-[14px]
                    text-left

                    ${
                      registered
                        ? "cursor-default border-[#EEEEEE] bg-[#F8F8F8]"
                        : "click-scale border-[#D9D9D9] bg-white"
                    }
                  `}
                >
                  <div className="min-w-0">
                    <p
                      className={`
                        truncate
                        text-[14px]
                        font-medium

                        ${registered ? "text-[#888888]" : "text-[#191919]"}
                      `}
                    >
                      {schedule.name}
                    </p>

                    {schedule.category && (
                      <p className="mt-[2px] text-[12px] text-[#888888]">
                        {schedule.category}
                      </p>
                    )}
                  </div>

                  {registered ? (
                    <div className="flex shrink-0 items-center gap-[5px] text-[#3478F6]">
                      <Check size={15} strokeWidth={1.8} />

                      <span className="text-[12px]">지출 등록됨</span>
                    </div>
                  ) : (
                    <ChevronRight
                      size={17}
                      strokeWidth={1.5}
                      className="shrink-0 text-[#888888]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div
            className="
              mt-[20px]
              flex
              min-h-[120px]
              items-center
              justify-center
              rounded-xl
              bg-[#F5F5F5]
            "
          >
            <p className="text-[13px] text-[#888888]">등록된 일정이 없어요.</p>
          </div>
        )}
      </section>
    </div>,
    document.body,
  );
}
