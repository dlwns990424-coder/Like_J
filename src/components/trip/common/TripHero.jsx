import { useEffect, useState } from "react";

import { CalendarDays, Check, X } from "lucide-react";

export default function TripHero({
  trip,
  userName,
  titleRef,
  onTitleSave,
  onDateEdit,
}) {
  // ====================
  // Title Edit
  // ====================

  const [isTitleEditMode, setIsTitleEditMode] = useState(false);

  const [titleValue, setTitleValue] = useState(trip.title || "");

  // ====================
  // Trip Title Sync
  // ====================

  useEffect(() => {
    setTitleValue(trip.title || "");
  }, [trip.title]);

  // ====================
  // Date Format
  // ====================

  const formatDate = (dateString) => {
    const date = new Date(`${dateString}T00:00:00`);

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${month}.${day}`;
  };

  // ====================
  // Night Count
  // ====================

  const getNightCount = () => {
    const start = new Date(`${trip.startDate}T00:00:00`);

    const end = new Date(`${trip.endDate}T00:00:00`);

    const difference = end.getTime() - start.getTime();

    return Math.round(difference / (1000 * 60 * 60 * 24));
  };

  // ====================
  // Title Edit Open
  // ====================

  const handleTitleEditOpen = () => {
    setTitleValue(trip.title || "");

    setIsTitleEditMode(true);
  };

  // ====================
  // Title Edit Cancel
  // ====================

  const handleTitleEditCancel = () => {
    setTitleValue(trip.title || "");

    setIsTitleEditMode(false);
  };

  // ====================
  // Title Save
  // ====================

  const handleTitleSave = () => {
    const trimmedTitle = titleValue.trim();

    if (!trimmedTitle) {
      return;
    }

    onTitleSave?.(trimmedTitle);

    setIsTitleEditMode(false);
  };

  // ====================
  // Key Down
  // ====================

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleTitleSave();
    }

    if (e.key === "Escape") {
      handleTitleEditCancel();
    }
  };

  // ====================
  // Full Title
  // ====================

  const fullTitle = `${userName} 님의 ${trip.title}`;

  return (
    <section className="relative h-[320px] shrink-0">
      {/* ====================
          Hero Image
      ==================== */}

      <div className="relative h-[240px] w-full overflow-hidden bg-[#D9D9D9]">
        {trip.imageUrl ? (
          <img
            src={trip.imageUrl}
            alt={trip.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[#D9D9D9]" />
        )}

        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* ====================
          Trip Information
      ==================== */}

      <div
        className="
          absolute
          top-[190px]
          right-5
          left-5
          rounded-xl
          bg-white
          px-[20px]
          py-[18px]
          shadow-lg
        "
      >
        {/* ====================
            Title
        ==================== */}

        {isTitleEditMode ? (
          <div
            ref={titleRef}
            className="
              flex
              min-h-[38px]
              items-center
              justify-center
              gap-[6px]
            "
          >
            <span
              className="
                shrink-0
                text-[16px]
                font-semibold
                leading-[24px]
                tracking-[-0.02em]
              "
            >
              {userName} 님의
            </span>

            <input
              type="text"
              value={titleValue}
              onChange={(e) => {
                setTitleValue(e.target.value);
              }}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              className="
                h-[38px]
                min-w-0
                flex-1
                rounded-lg
                border
                border-[#3478F6]
                bg-[#F5F5F5]
                px-[10px]
                text-[15px]
                font-semibold
                leading-[22px]
                outline-none
              "
            />

            <button
              type="button"
              onClick={handleTitleSave}
              aria-label="여행 이름 저장"
              className="
                click-scale-sm
                flex
                h-[32px]
                w-[32px]
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#3478F6]
                text-white
              "
            >
              <Check size={16} strokeWidth={2} />
            </button>

            <button
              type="button"
              onClick={handleTitleEditCancel}
              aria-label="여행 이름 수정 취소"
              className="
                click-scale-sm
                flex
                h-[32px]
                w-[32px]
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#F5F5F5]
                text-[#555555]
              "
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>
        ) : (
          <button
            ref={titleRef}
            type="button"
            onClick={handleTitleEditOpen}
            className="
              click-scale-sm
              block
              w-full
              text-center
              text-[18px]
              font-semibold
              leading-[26px]
              tracking-[-0.02em]
            "
          >
            {fullTitle}
          </button>
        )}

        {/* ====================
            Date
        ==================== */}

        <button
          type="button"
          onClick={onDateEdit}
          className="
            click-scale-sm
            mx-auto
            mt-[8px]
            flex
            items-center
            justify-center
            gap-[6px]
            text-[12px]
            leading-[18px]
            text-[#777777]
          "
        >
          <CalendarDays size={14} strokeWidth={1.5} />

          <span>
            {formatDate(trip.startDate)}
            {" ~ "}
            {formatDate(trip.endDate)}
            {" / "}
            {getNightCount()}박
          </span>
        </button>
      </div>
    </section>
  );
}
