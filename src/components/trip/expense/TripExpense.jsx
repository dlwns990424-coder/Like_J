import { useMemo, useState } from "react";

import { Plus } from "lucide-react";

import ScheduleDateTabs from "../schedule/ScheduleDateTabs";

import ExpenseBudgetCard from "./ExpenseBudgetCard";
import ExpenseList from "./ExpenseList";

import BudgetModal from "./BudgetModal";
import ExpenseAddTypeModal from "./ExpenseAddTypeModal";
import ScheduleExpenseSelectModal from "./ScheduleExpenseSelectModal";
import ExpenseRecordModal from "./ExpenseRecordModal";

import { formatDateKey, getTripCurrency, getTripDates } from "./expenseUtils";

import {
  getExpensesByTripId,
  getSchedulesByTripId,
  saveExpense,
  updateExpense,
  updateTrip,
} from "../../../lib/storage";

export default function TripExpense({ trip, containerRef }) {
  if (!trip) {
    return null;
  }

  // ====================
  // Trip Dates
  // ====================

  const tripDates = useMemo(
    () => getTripDates(trip.startDate, trip.endDate),
    [trip.startDate, trip.endDate],
  );

  // ====================
  // Currency
  // ====================

  const currency = useMemo(() => getTripCurrency(trip), [trip]);

  // ====================
  // Selected Date
  // ====================

  const [selectedDate, setSelectedDate] = useState(() =>
    tripDates.length > 0 ? formatDateKey(tripDates[0]) : "",
  );

  // ====================
  // Expenses
  // ====================

  const [expenses, setExpenses] = useState(() => getExpensesByTripId(trip.id));

  // ====================
  // Budget Modal
  // ====================

  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

  // ====================
  // Add Type Modal
  // ====================

  const [isAddTypeOpen, setIsAddTypeOpen] = useState(false);

  // ====================
  // Schedule Select
  // ====================

  const [isScheduleSelectOpen, setIsScheduleSelectOpen] = useState(false);

  // ====================
  // Expense Record
  // ====================

  const [recordType, setRecordType] = useState(null);

  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [editingExpense, setEditingExpense] = useState(null);

  // ====================
  // Budget
  // ====================

  const budget = Number(trip.budget) || 0;

  // ====================
  // Day Schedule
  // ====================

  const daySchedules = useMemo(() => {
    return getSchedulesByTripId(trip.id).filter(
      (schedule) => schedule.date === selectedDate,
    );
  }, [trip.id, selectedDate]);

  // ====================
  // Day Expenses
  // ====================

  const dayExpenses = useMemo(
    () => expenses.filter((expense) => expense.date === selectedDate),
    [expenses, selectedDate],
  );

  // ====================
  // Schedule Expense
  // ====================

  const scheduleExpenses = dayExpenses.filter(
    (expense) => expense.type === "schedule",
  );

  // ====================
  // Etc Expense
  // ====================

  const etcExpenses = dayExpenses.filter((expense) => expense.type === "etc");

  // ====================
  // Total
  // ====================

  const totalExpense = expenses.reduce(
    (sum, expense) => sum + (Number(expense.amount) || 0),
    0,
  );

  const remainingBudget = budget - totalExpense;

  const usagePercentage =
    budget > 0 ? Math.min(100, Math.round((totalExpense / budget) * 100)) : 0;

  // ====================
  // Refresh
  // ====================

  const refreshExpenses = () => {
    setExpenses(getExpensesByTripId(trip.id));
  };

  // ====================
  // Date Select
  // ====================

  const handleDateSelect = (date) => {
    setSelectedDate(formatDateKey(date));

    setEditingExpense(null);

    setRecordType(null);

    setSelectedSchedule(null);
  };

  // ====================
  // Budget
  // ====================

  const handleBudgetOpen = () => {
    setIsBudgetOpen(true);
  };

  const handleBudgetClose = () => {
    setIsBudgetOpen(false);
  };

  const handleBudgetSave = (amount) => {
    updateTrip(trip.id, {
      budget: amount,
      currencyCode: currency.code,
    });

    trip.budget = amount;

    trip.currencyCode = currency.code;

    setIsBudgetOpen(false);
  };

  // ====================
  // Add Type
  // ====================

  const handleAddTypeOpen = () => {
    setIsAddTypeOpen(true);
  };

  const handleAddTypeClose = () => {
    setIsAddTypeOpen(false);
  };

  // ====================
  // Schedule Expense
  // ====================

  const handleScheduleExpenseOpen = () => {
    setIsAddTypeOpen(false);

    setEditingExpense(null);

    setIsScheduleSelectOpen(true);
  };

  // ====================
  // Schedule Select Back
  // ====================

  const handleScheduleSelectBack = () => {
    setIsScheduleSelectOpen(false);

    setIsAddTypeOpen(true);
  };

  // ====================
  // Schedule Select Close
  // ====================

  const handleScheduleSelectClose = () => {
    setIsScheduleSelectOpen(false);
  };

  // ====================
  // Schedule Select
  // ====================

  const handleScheduleSelect = (schedule) => {
    const existingExpense = expenses.find(
      (expense) =>
        expense.type === "schedule" && expense.scheduleId === schedule.id,
    );

    if (existingExpense) {
      return;
    }

    setSelectedSchedule(schedule);

    setEditingExpense(null);

    setIsScheduleSelectOpen(false);

    setRecordType("schedule");
  };

  // ====================
  // Etc Expense
  // ====================

  const handleEtcExpenseOpen = () => {
    setIsAddTypeOpen(false);

    setSelectedSchedule(null);

    setEditingExpense(null);

    setRecordType("etc");
  };

  // ====================
  // Expense Edit
  // ====================

  const handleExpenseClick = (expense) => {
    setEditingExpense(expense);

    setRecordType(expense.type);

    if (expense.type === "schedule") {
      const schedule = getSchedulesByTripId(trip.id).find(
        (item) => item.id === expense.scheduleId,
      );

      setSelectedSchedule(schedule || null);
    } else {
      setSelectedSchedule(null);
    }
  };

  // ====================
  // Record Back
  // ====================

  const handleRecordBack = () => {
    // ====================
    // Edit Mode
    //
    // 기존 지출 수정은
    // 이전 선택 단계가 없으므로
    // 모달만 닫는다.
    // ====================

    if (editingExpense) {
      handleRecordClose();

      return;
    }

    // ====================
    // Schedule
    // ====================

    if (recordType === "schedule") {
      setRecordType(null);

      setSelectedSchedule(null);

      setIsScheduleSelectOpen(true);

      return;
    }

    // ====================
    // Etc
    // ====================

    if (recordType === "etc") {
      setRecordType(null);

      setSelectedSchedule(null);

      setIsAddTypeOpen(true);
    }
  };

  // ====================
  // Record Close
  // ====================

  const handleRecordClose = () => {
    setRecordType(null);

    setSelectedSchedule(null);

    setEditingExpense(null);
  };

  // ====================
  // Expense Save
  // ====================

  const handleExpenseSave = ({ title, amount, memo }) => {
    // ====================
    // Edit
    // ====================

    if (editingExpense) {
      updateExpense(editingExpense.id, {
        title,
        amount,
        memo,
      });

      refreshExpenses();

      handleRecordClose();

      return;
    }

    // ====================
    // Duplicate
    // ====================

    if (recordType === "schedule" && selectedSchedule) {
      const alreadyExists = expenses.some(
        (expense) =>
          expense.type === "schedule" &&
          expense.scheduleId === selectedSchedule.id,
      );

      if (alreadyExists) {
        handleRecordClose();

        return;
      }
    }

    // ====================
    // Create
    // ====================

    const expense = {
      id: crypto.randomUUID(),

      tripId: trip.id,

      type: recordType,

      date: selectedDate,

      scheduleId: recordType === "schedule" ? selectedSchedule?.id : null,

      title,

      amount,

      memo,

      currencyCode: currency.code,

      createdAt: new Date().toISOString(),
    };

    saveExpense(expense);

    refreshExpenses();

    handleRecordClose();
  };

  // ====================
  // Render
  // ====================

  return (
    <>
      <div
        ref={containerRef}
        className="
          hide-scrollbar
          h-full
          w-full
          overflow-x-hidden
          overflow-y-auto
          overscroll-y-contain
          pb-[calc(120px+env(safe-area-inset-bottom))]
          pt-[calc(108px+env(safe-area-inset-top))]
        "
      >
        <section className="px-5 pt-[8px]">
          <ExpenseBudgetCard
            budget={budget}
            totalExpense={totalExpense}
            remainingBudget={remainingBudget}
            usagePercentage={usagePercentage}
            currency={currency}
            onEdit={handleBudgetOpen}
          />

          <ScheduleDateTabs
            dates={tripDates}
            selectedDate={selectedDate}
            onSelect={handleDateSelect}
          />

          <div className="mt-[16px] flex items-center justify-between">
            <h2 className="text-[18px] font-semibold leading-[26px]">
              지출 내역
            </h2>

            <button
              type="button"
              onClick={handleAddTypeOpen}
              className="
                click-scale
                flex
                h-[36px]
                items-center
                gap-[6px]
                rounded-full
                bg-[#3478F6]
                px-[14px]
                text-[14px]
                text-white
              "
            >
              <Plus size={16} strokeWidth={1.5} />

              <span>지출 추가</span>
            </button>
          </div>

          <ExpenseList
            scheduleExpenses={scheduleExpenses}
            etcExpenses={etcExpenses}
            currency={currency}
            onExpenseClick={handleExpenseClick}
          />
        </section>
      </div>

      <BudgetModal
        key={`${isBudgetOpen}-${budget}`}
        isOpen={isBudgetOpen}
        currency={currency}
        initialBudget={budget}
        onClose={handleBudgetClose}
        onSave={handleBudgetSave}
      />

      <ExpenseAddTypeModal
        isOpen={isAddTypeOpen}
        onClose={handleAddTypeClose}
        onSchedule={handleScheduleExpenseOpen}
        onEtc={handleEtcExpenseOpen}
      />

      <ScheduleExpenseSelectModal
        isOpen={isScheduleSelectOpen}
        schedules={daySchedules}
        scheduleExpenses={scheduleExpenses}
        onClose={handleScheduleSelectClose}
        onBack={handleScheduleSelectBack}
        onSelect={handleScheduleSelect}
      />

      <ExpenseRecordModal
        key={
          editingExpense
            ? `edit-${editingExpense.id}`
            : `${recordType}-${selectedSchedule?.id || "etc"}`
        }
        isOpen={Boolean(recordType)}
        type={recordType}
        schedule={selectedSchedule}
        selectedDate={selectedDate}
        currency={currency}
        editingExpense={editingExpense}
        onClose={handleRecordClose}
        onBack={handleRecordBack}
        onSave={handleExpenseSave}
      />
    </>
  );
}
