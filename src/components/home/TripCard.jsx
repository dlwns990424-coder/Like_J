import { CalendarDays, Check, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function TripCard({
  trip,
  isEditMode = false,
  isSelected = false,
  onSelect,
}) {
  // ====================
  // Card Class
  // ====================

  const cardClassName = `
    relative
    flex
    h-[120px]
    w-full
    overflow-hidden
    rounded-xl
    border
    bg-white

    ${isEditMode && isSelected ? "border-[#3478F6]" : "border-[#D9D9D9]"}

    ${isEditMode ? "" : "click-scale"}
  `;

  // ====================
  // Card Content
  // ====================

  const cardContent = (
    <>
      {/* ====================
          여행 대표 이미지
      ==================== */}

      <div
        className="
          h-[120px]
          w-[110px]
          shrink-0
          overflow-hidden
          bg-[#D9D9D9]
        "
      >
        {trip.imageUrl ? (
          <img
            src={trip.imageUrl}
            alt={trip.title}
            className="
              h-full
              w-full
              object-cover
            "
          />
        ) : (
          <div
            className="
              flex
              h-full
              w-full
              items-center
              justify-center
              text-[11px]
              text-[#888888]
            "
          >
            여행지 img
          </div>
        )}
      </div>

      {/* ====================
          여행 정보
      ==================== */}

      <div
        className="
          flex
          min-w-0
          flex-1
          flex-col
          justify-center
          px-[16px]
        "
      >
        <h2
          className="
            truncate
            pr-[28px]
            text-[16px]
            font-semibold
            leading-[24px]
            tracking-[-0.01em]
          "
        >
          {trip.title}
        </h2>

        {/* 여행지 */}

        <div
          className="
            mt-[4px]
            flex
            items-center
            gap-[5px]
            text-[12px]
            leading-[18px]
            text-[#555555]
          "
        >
          <MapPin size={14} strokeWidth={1.5} />

          <span className="truncate">
            {trip.destinationName || trip.city || trip.country}
          </span>
        </div>

        {/* 날짜 */}

        <div
          className="
            mt-[6px]
            flex
            items-center
            gap-[5px]
            text-[12px]
            leading-[18px]
            text-[#555555]
          "
        >
          <CalendarDays size={14} strokeWidth={1.5} />

          <span>
            {trip.startDate} ~ {trip.endDate}
          </span>
        </div>
      </div>

      {/* ====================
          편집 모드 체크
      ==================== */}

      {isEditMode && (
        <div
          className={`
            absolute
            top-[10px]
            right-[10px]
            flex
            h-[24px]
            w-[24px]
            items-center
            justify-center
            rounded-full
            border

            ${
              isSelected
                ? "border-[#3478F6] bg-[#3478F6] text-white"
                : "border-[#D9D9D9] bg-white"
            }
          `}
        >
          {isSelected && <Check size={16} strokeWidth={2} />}
        </div>
      )}
    </>
  );

  // ====================
  // Edit Mode
  // ====================

  if (isEditMode) {
    return (
      <button
        type="button"
        onClick={() => onSelect?.(trip.id)}
        className={cardClassName}
      >
        {cardContent}
      </button>
    );
  }

  // ====================
  // Normal Mode
  // ====================

  return (
    <Link to={`/trip/${trip.id}`} className={cardClassName}>
      {cardContent}
    </Link>
  );
}
