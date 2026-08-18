import { useState } from "react";

import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  Globe,
  MapPin,
  Phone,
  Plus,
  Star,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import ScheduleMemo from "../schedule/ScheduleMemo";
import ScheduleMemoModal from "../schedule/ScheduleMemoModal";

import FavoritePlaceEditMenu from "./FavoritePlaceEditMenu";
import FavoritePlaceEmptyGuide from "./FavoritePlaceEmptyGuide";

import {
  deleteFavoritePlaces,
  getFavoritePlacesByTripId,
  getSchedulesByTripId,
  getTripById,
  saveSchedule,
  updateFavoritePlace,
} from "../../../lib/storage";

// ====================
// Date Utils
// ====================

const parseDate = (dateString) => {
  if (!dateString) {
    return null;
  }

  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
};

const formatDateKey = (date) => {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDateLabel = (dateString) => {
  const date = parseDate(dateString);

  if (!date) {
    return dateString;
  }

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const month = date.getMonth() + 1;

  const day = date.getDate();

  const weekDay = weekDays[date.getDay()];

  return `${month}월 ${day}일 (${weekDay})`;
};

const getTripDates = (startDate, endDate) => {
  const start = parseDate(startDate);

  const end = parseDate(endDate);

  if (!start || !end) {
    return [];
  }

  const dates = [];

  const current = new Date(start);

  while (current <= end) {
    dates.push(formatDateKey(current));

    current.setDate(current.getDate() + 1);
  }

  return dates;
};

// ====================
// Schedule Date Modal
// ====================

function ScheduleDateModal({ isOpen, trip, onClose, onSelect }) {
  if (!isOpen || !trip) {
    return null;
  }

  const tripDates = getTripDates(trip.startDate, trip.endDate);

  return (
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
        role="dialog"
        aria-modal="true"
        className="
          max-h-[80dvh]
          w-full
          max-w-[390px]
          overflow-y-auto
          rounded-t-[24px]
          bg-white
          px-5
          pt-[20px]
          pb-[calc(24px+env(safe-area-inset-bottom))]
          text-[#191919]
        "
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* ====================
            Header
        ==================== */}

        <div className="flex items-start justify-between">
          <div>
            <h2
              className="
                text-[20px]
                font-semibold
                leading-[28px]
                tracking-[-0.02em]
              "
            >
              일정 날짜 선택
            </h2>

            <p
              className="
                mt-[4px]
                text-[13px]
                leading-[20px]
                text-[#888888]
              "
            >
              장소를 추가할 날짜를 선택해주세요.
            </p>
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
            Trip Information
        ==================== */}

        <div
          className="
            mt-[20px]
            rounded-xl
            bg-[#F5F5F5]
            px-[14px]
            py-[12px]
          "
        >
          <p
            className="
              text-[15px]
              font-semibold
              leading-[22px]
            "
          >
            {trip.title}
          </p>

          <div
            className="
              mt-[4px]
              flex
              items-center
              gap-[6px]
              text-[12px]
              leading-[18px]
              text-[#888888]
            "
          >
            <CalendarDays size={14} strokeWidth={1.5} />

            <span>
              {trip.startDate} ~ {trip.endDate}
            </span>
          </div>
        </div>

        {/* ====================
            Date List
        ==================== */}

        {tripDates.length > 0 ? (
          <div
            className="
              hide-scrollbar
              mt-[16px]
              flex
              max-h-[380px]
              flex-col
              gap-[8px]
              overflow-y-auto
            "
          >
            {tripDates.map((date, index) => (
              <button
                key={date}
                type="button"
                onClick={() => onSelect(date)}
                className="
                  click-scale
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-[#D9D9D9]
                  bg-white
                  px-[14px]
                  py-[12px]
                  text-left
                "
              >
                <div>
                  <p
                    className="
                      text-[14px]
                      font-semibold
                      leading-[20px]
                    "
                  >
                    Day {index + 1}
                  </p>

                  <p
                    className="
                      mt-[2px]
                      text-[13px]
                      leading-[18px]
                      text-[#555555]
                    "
                  >
                    {formatDateLabel(date)}
                  </p>
                </div>

                <ChevronDown
                  size={17}
                  strokeWidth={1.5}
                  className="-rotate-90 text-[#888888]"
                />
              </button>
            ))}
          </div>
        ) : (
          <div
            className="
              mt-[20px]
              flex
              min-h-[100px]
              items-center
              justify-center
              rounded-xl
              bg-[#F5F5F5]
            "
          >
            <p
              className="
                text-[13px]
                leading-[20px]
                text-[#888888]
              "
            >
              여행 날짜를 확인해주세요.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

// ====================
// Favorite Place Card
// ====================

function FavoritePlaceCard({
  place,
  onScheduleAdd,
  onMemoOpen,
  isEditMode = false,
  isSelected = false,
  onSelect,
}) {
  // ====================
  // State
  // ====================

  const [isExpanded, setIsExpanded] = useState(false);

  const [isHoursExpanded, setIsHoursExpanded] = useState(false);

  // ====================
  // Card Select
  // ====================

  const handleCardClick = () => {
    if (!isEditMode) {
      return;
    }

    onSelect?.();
  };

  // ====================
  // Detail Toggle
  // ====================

  const handleToggle = (e) => {
    e.stopPropagation();

    if (isEditMode) {
      return;
    }

    setIsExpanded((prev) => !prev);
  };

  // ====================
  // Hours Toggle
  // ====================

  const handleHoursToggle = (e) => {
    e.stopPropagation();

    if (isEditMode) {
      return;
    }

    setIsHoursExpanded((prev) => !prev);
  };

  // ====================
  // Memo
  // ====================

  const handleMemoOpen = () => {
    if (isEditMode) {
      return;
    }

    onMemoOpen?.(place);
  };

  // ====================
  // Website
  // ====================

  const handleUrlClick = (e) => {
    e.stopPropagation();

    if (isEditMode) {
      return;
    }

    if (!place.url) {
      return;
    }

    window.open(place.url, "_blank", "noopener,noreferrer");
  };

  // ====================
  // Schedule Add
  // ====================

  const handleScheduleAdd = (e) => {
    e.stopPropagation();

    if (isEditMode) {
      return;
    }

    onScheduleAdd?.(place);
  };

  // ====================
  // Opening Hours
  // ====================

  const weekDays = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];

  const convertTime = (time) => {
    if (!time) {
      return "";
    }

    const value = time.trim();

    if (value.includes("24시간")) {
      return "24시간";
    }

    const match = value.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);

    if (!match) {
      return value;
    }

    const period = match[1];

    let hour = Number(match[2]);

    const minute = match[3];

    if (period === "오전" && hour === 12) {
      hour = 0;
    }

    if (period === "오후" && hour !== 12) {
      hour += 12;
    }

    return `${String(hour).padStart(2, "0")}:${minute}`;
  };

  const parseOpeningHour = (value) => {
    if (!value) {
      return null;
    }

    const colonIndex = value.indexOf(":");

    if (colonIndex === -1) {
      return null;
    }

    const day = value.slice(0, colonIndex).trim();

    const timeText = value.slice(colonIndex + 1).trim();

    if (timeText.includes("휴무") || timeText.includes("Closed")) {
      return {
        day,
        time: "휴무",
      };
    }

    if (timeText.includes("24시간")) {
      return {
        day,
        time: "24시간",
      };
    }

    const timeMatches = timeText.match(/(오전|오후)\s*\d{1,2}:\d{2}/g);

    if (!timeMatches || timeMatches.length < 2) {
      return {
        day,
        time: timeText,
      };
    }

    const ranges = [];

    for (let i = 0; i < timeMatches.length; i += 2) {
      const start = timeMatches[i];

      const end = timeMatches[i + 1];

      if (!end) {
        continue;
      }

      ranges.push(`${convertTime(start)} ~ ${convertTime(end)}`);
    }

    return {
      day,

      time: ranges.join(", ") || timeText,
    };
  };

  const openingHours = Array.isArray(place.openingHours)
    ? place.openingHours.map(parseOpeningHour).filter(Boolean)
    : [];

  const todayName = weekDays[new Date().getDay()];

  const todayOpeningHour = openingHours.find((item) => item.day === todayName);

  return (
    <article
      onClick={handleCardClick}
      className={`
        relative
        w-full
        overflow-hidden
        rounded-xl
        border
        bg-white
        p-[10px]

        ${isSelected ? "border-[#3478F6]" : "border-[#D9D9D9]"}

        ${isEditMode ? "cursor-pointer" : ""}
      `}
    >
      {/* ====================
          Edit Select
      ==================== */}

      {isEditMode && (
        <div
          className={`
            absolute
            top-[8px]
            right-[8px]
            z-20
            flex
            h-[22px]
            w-[22px]
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
          {isSelected && <Check size={14} strokeWidth={2} />}
        </div>
      )}

      {/* ====================
          기본 정보
      ==================== */}

      <div className="min-w-0">
        <h3
          className={`
            truncate
            text-[16px]
            font-semibold
            leading-[24px]
            tracking-[-0.01em]

            ${isEditMode ? "pr-[28px]" : ""}
          `}
        >
          {place.name}
        </h3>

        {place.category && (
          <span
            className="
              mt-[4px]
              inline-flex
              rounded-md
              bg-[#F5F5F5]
              px-[6px]
              py-[2px]
              text-[10px]
              leading-[16px]
              text-[#555555]
            "
          >
            {place.category}
          </span>
        )}
      </div>

      {/* ====================
          Detail
      ==================== */}

      {!isEditMode && (
        <div
          className={`
            grid
            transition-[grid-template-rows,opacity,margin]
            duration-300
            ease-in-out

            ${
              isExpanded
                ? "mt-[12px] grid-rows-[1fr] opacity-100"
                : "mt-0 grid-rows-[0fr] opacity-0"
            }
          `}
        >
          <div className="overflow-hidden">
            <div
              className="
                border-t
                border-[#EEEEEE]
                pt-[10px]
              "
            >
              {/* ====================
                  Memo
              ==================== */}

              <ScheduleMemo memo={place.memo || ""} onClick={handleMemoOpen} />

              <div
                className="
                  mt-[10px]
                  flex
                  flex-col
                  gap-[8px]
                  text-[12px]
                  leading-[18px]
                  text-[#555555]
                "
              >
                {/* Address */}

                {place.address && (
                  <div className="flex items-start gap-[6px]">
                    <MapPin
                      size={14}
                      strokeWidth={1.5}
                      className="mt-[2px] shrink-0"
                    />

                    <span>{place.address}</span>
                  </div>
                )}

                {/* Rating */}

                {place.rating !== null && place.rating !== undefined && (
                  <div className="flex items-center gap-[6px]">
                    <Star size={14} strokeWidth={1.5} />

                    <span className="text-[#F5A623]">{place.rating}</span>
                  </div>
                )}

                {/* Opening Hours */}

                {todayOpeningHour && (
                  <div>
                    <button
                      type="button"
                      onClick={handleHoursToggle}
                      className="
                        flex
                        w-full
                        items-center
                        gap-[6px]
                        text-left
                      "
                    >
                      <Clock3
                        size={14}
                        strokeWidth={1.5}
                        className="shrink-0"
                      />

                      <span className="min-w-0 flex-1">
                        <span className="font-medium text-[#191919]">
                          오늘({todayName})
                        </span>

                        <span className="ml-[6px]">
                          {todayOpeningHour.time}
                        </span>
                      </span>

                      {isHoursExpanded ? (
                        <ChevronUp
                          size={15}
                          strokeWidth={1.5}
                          className="shrink-0"
                        />
                      ) : (
                        <ChevronDown
                          size={15}
                          strokeWidth={1.5}
                          className="shrink-0"
                        />
                      )}
                    </button>

                    <div
                      className={`
                        grid
                        transition-[grid-template-rows,opacity,margin]
                        duration-200
                        ease-in-out

                        ${
                          isHoursExpanded
                            ? "mt-[8px] grid-rows-[1fr] opacity-100"
                            : "mt-0 grid-rows-[0fr] opacity-0"
                        }
                      `}
                    >
                      <div className="overflow-hidden">
                        <div
                          className="
                            ml-[20px]
                            rounded-lg
                            bg-[#F7F7F7]
                            px-[10px]
                            py-[8px]
                          "
                        >
                          {openingHours.map((item) => (
                            <div
                              key={item.day}
                              className="
                                flex
                                min-h-[24px]
                                items-start
                                gap-[10px]
                                py-[2px]
                              "
                            >
                              <span
                                className={`
                                  w-[42px]
                                  shrink-0

                                  ${
                                    item.day === todayName
                                      ? "font-semibold text-[#3478F6]"
                                      : "text-[#555555]"
                                  }
                                `}
                              >
                                {item.day}
                              </span>

                              <span
                                className={`
                                  min-w-0
                                  flex-1

                                  ${
                                    item.time === "휴무"
                                      ? "text-[#E5484D]"
                                      : "text-[#555555]"
                                  }
                                `}
                              >
                                {item.time}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Website */}

                {place.url && (
                  <button
                    type="button"
                    onClick={handleUrlClick}
                    className="
                      click-scale
                      flex
                      w-fit
                      items-center
                      gap-[6px]
                    "
                  >
                    <Globe size={14} strokeWidth={1.5} />

                    <span>웹사이트</span>
                  </button>
                )}

                {/* Phone */}

                {place.phone && (
                  <div className="flex items-center gap-[6px]">
                    <Phone size={14} strokeWidth={1.5} />

                    <span>{place.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================
          Bottom
      ==================== */}

      {!isEditMode && (
        <div className="mt-[14px] flex items-center justify-between">
          <button
            type="button"
            onClick={handleToggle}
            className="
              click-scale-sm
              flex
              h-[30px]
              w-[30px]
              items-center
              justify-center
              text-[#555555]
            "
            aria-label={
              isExpanded ? "관심 장소 정보 접기" : "관심 장소 정보 펼치기"
            }
          >
            {isExpanded ? (
              <ChevronUp size={20} strokeWidth={1.5} />
            ) : (
              <ChevronDown size={20} strokeWidth={1.5} />
            )}
          </button>

          <button
            type="button"
            onClick={handleScheduleAdd}
            className="
              click-scale
              flex
              h-[36px]
              items-center
              justify-center
              rounded-full
              bg-[#3478F6]
              px-[18px]
              text-[12px]
              text-white
            "
          >
            일정 추가
          </button>
        </div>
      )}
    </article>
  );
}

// ====================
// Favorite Places
// ====================

export default function FavoritePlaces({ tripId }) {
  const navigate = useNavigate();

  // ====================
  // Data
  // ====================

  const trip = getTripById(tripId);

  // ====================
  // Favorite Places
  // ====================

  const [favoritePlaces, setFavoritePlaces] = useState(() =>
    getFavoritePlacesByTripId(tripId),
  );

  // ====================
  // Schedule
  // ====================

  const [selectedPlace, setSelectedPlace] = useState(null);

  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // ====================
  // Memo
  // ====================

  const [memoPlace, setMemoPlace] = useState(null);

  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);

  // ====================
  // Edit
  // ====================

  const [isEditMode, setIsEditMode] = useState(false);

  const [selectedPlaceIds, setSelectedPlaceIds] = useState([]);

  // ====================
  // Refresh
  // ====================

  const refreshFavoritePlaces = () => {
    setFavoritePlaces(getFavoritePlacesByTripId(tripId));
  };

  // ====================
  // Map으로 장소 추가
  // ====================

  const handleAddPlace = () => {
    navigate("/map", {
      state: {
        mode: "favorite",

        tripId,
      },
    });
  };

  // ====================
  // Memo Open
  // ====================

  const handleMemoOpen = (place) => {
    setMemoPlace(place);

    setIsMemoModalOpen(true);
  };

  // ====================
  // Memo Close
  // ====================

  const handleMemoClose = () => {
    setMemoPlace(null);

    setIsMemoModalOpen(false);
  };

  // ====================
  // Memo Save
  // ====================

  const handleMemoSave = (content) => {
    if (!memoPlace) {
      return;
    }

    updateFavoritePlace(memoPlace.id, {
      memo: content,
    });

    refreshFavoritePlaces();

    handleMemoClose();
  };

  // ====================
  // Memo Delete
  // ====================

  const handleMemoDelete = () => {
    if (!memoPlace) {
      return;
    }

    updateFavoritePlace(memoPlace.id, {
      memo: "",
    });

    refreshFavoritePlaces();

    handleMemoClose();
  };

  // ====================
  // Edit Start
  // ====================

  const handleEditStart = () => {
    setSelectedPlaceIds([]);

    setIsEditMode(true);
  };

  // ====================
  // Edit Complete
  // ====================

  const handleEditComplete = () => {
    setIsEditMode(false);

    setSelectedPlaceIds([]);
  };

  // ====================
  // Place Select
  // ====================

  const handlePlaceSelect = (placeId) => {
    setSelectedPlaceIds((prev) =>
      prev.includes(placeId)
        ? prev.filter((id) => id !== placeId)
        : [...prev, placeId],
    );
  };

  // ====================
  // Select All
  // ====================

  const handleSelectAll = () => {
    const allSelected =
      favoritePlaces.length > 0 &&
      selectedPlaceIds.length === favoritePlaces.length;

    if (allSelected) {
      setSelectedPlaceIds([]);

      return;
    }

    setSelectedPlaceIds(favoritePlaces.map((place) => place.id));
  };

  // ====================
  // Selected Delete
  // ====================

  const handleSelectedDelete = () => {
    if (selectedPlaceIds.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `선택한 관심 장소 ${selectedPlaceIds.length}개를 삭제할까요?`,
    );

    if (!confirmed) {
      return;
    }

    deleteFavoritePlaces(selectedPlaceIds);

    setSelectedPlaceIds([]);

    refreshFavoritePlaces();
  };

  // ====================
  // Delete All
  // ====================

  const handleDeleteAll = () => {
    if (favoritePlaces.length === 0) {
      return;
    }

    const confirmed = window.confirm("관심 장소를 모두 삭제할까요?");

    if (!confirmed) {
      return;
    }

    const placeIds = favoritePlaces.map((place) => place.id);

    deleteFavoritePlaces(placeIds);

    setSelectedPlaceIds([]);

    setIsEditMode(false);

    refreshFavoritePlaces();
  };

  // ====================
  // Schedule Modal Open
  // ====================

  const handleScheduleOpen = (place) => {
    setSelectedPlace(place);

    setIsDateModalOpen(true);
  };

  // ====================
  // Schedule Modal Close
  // ====================

  const handleScheduleClose = () => {
    setSelectedPlace(null);

    setIsDateModalOpen(false);
  };

  // ====================
  // Schedule Save
  // ====================

  const handleScheduleDateSelect = (date) => {
    if (!selectedPlace) {
      return;
    }

    const schedules = getSchedulesByTripId(tripId);

    const sameDateSchedules = schedules.filter(
      (schedule) => schedule.date === date,
    );

    const nextOrder =
      sameDateSchedules.length > 0
        ? Math.max(
            ...sameDateSchedules.map((schedule) => schedule.order ?? 0),
          ) + 1
        : 0;

    saveSchedule({
      id: crypto.randomUUID(),

      tripId,

      date,

      placeId: selectedPlace.placeId || selectedPlace.id,

      name: selectedPlace.name,

      category: selectedPlace.category,

      address: selectedPlace.address,

      country: selectedPlace.country,

      countryCode: selectedPlace.countryCode,

      city: selectedPlace.city,

      lat: selectedPlace.lat,

      lng: selectedPlace.lng,

      rating: selectedPlace.rating,

      url: selectedPlace.url,

      phone: selectedPlace.phone,

      openingHours: selectedPlace.openingHours || [],

      openNow: selectedPlace.openNow ?? null,

      startTime: null,

      endTime: null,

      memo: "",

      order: nextOrder,
    });

    handleScheduleClose();

    alert(`${formatDateLabel(date)} 일정에 추가되었습니다.`);
  };

  // ====================
  // Render
  // ====================

  return (
    <>
      <section>
        {/* ====================
            Header
        ==================== */}

        <div>
          <h2
            className="
              text-[18px]
              font-semibold
              leading-[26px]
              tracking-[-0.01em]
            "
          >
            관심 장소
          </h2>
        </div>

        {/* ====================
            Favorite Place Content
        ==================== */}

        {favoritePlaces.length === 0 && !isEditMode ? (
          /* ====================
              Empty Guide
          ==================== */

          <div className="mt-[12px]">
            <FavoritePlaceEmptyGuide onAddPlace={handleAddPlace} />
          </div>
        ) : (
          <>
            {/* ====================
                Controls
            ==================== */}

            {isEditMode ? (
              <div className="mt-[14px]">
                <FavoritePlaceEditMenu
                  isEditMode
                  favoritePlaces={favoritePlaces}
                  selectedPlaceIds={selectedPlaceIds}
                  onEditStart={handleEditStart}
                  onEditComplete={handleEditComplete}
                  onSelectAll={handleSelectAll}
                  onSelectedDelete={handleSelectedDelete}
                  onDeleteAll={handleDeleteAll}
                />
              </div>
            ) : (
              <div
                className="
                  mt-[12px]
                  flex
                  items-start
                  justify-between
                  gap-[12px]
                "
              >
                {/* ====================
                    Add Place
                ==================== */}

                <button
                  type="button"
                  onClick={handleAddPlace}
                  className="
                    click-scale
                    flex
                    h-[44px]
                    w-[230px]
                    shrink-0
                    items-center
                    justify-between
                    rounded-xl
                    bg-[#F5F5F5]
                    px-[16px]
                    text-[#555555]
                  "
                >
                  <div className="flex items-center gap-[8px]">
                    <MapPin size={18} strokeWidth={1.5} />

                    <span
                      className="
                        text-[14px]
                        font-medium
                        leading-[20px]
                      "
                    >
                      장소 추가
                    </span>
                  </div>

                  <Plus size={17} strokeWidth={1.5} />
                </button>

                {/* ====================
                    Edit Menu
                ==================== */}

                <div className="ml-auto shrink-0">
                  <FavoritePlaceEditMenu
                    isEditMode={false}
                    favoritePlaces={favoritePlaces}
                    selectedPlaceIds={selectedPlaceIds}
                    onEditStart={handleEditStart}
                    onEditComplete={handleEditComplete}
                    onSelectAll={handleSelectAll}
                    onSelectedDelete={handleSelectedDelete}
                    onDeleteAll={handleDeleteAll}
                  />
                </div>
              </div>
            )}

            {/* ====================
                Favorite Place List
            ==================== */}

            {favoritePlaces.length > 0 && (
              <div
                className={`
                  flex
                  flex-col
                  gap-[10px]

                  ${isEditMode ? "mt-[20px]" : "mt-[12px]"}
                `}
              >
                {favoritePlaces.map((place) => (
                  <FavoritePlaceCard
                    key={place.id}
                    place={place}
                    onScheduleAdd={handleScheduleOpen}
                    onMemoOpen={handleMemoOpen}
                    isEditMode={isEditMode}
                    isSelected={selectedPlaceIds.includes(place.id)}
                    onSelect={() => handlePlaceSelect(place.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* ====================
          Schedule Date Modal
      ==================== */}

      <ScheduleDateModal
        isOpen={isDateModalOpen}
        trip={trip}
        onClose={handleScheduleClose}
        onSelect={handleScheduleDateSelect}
      />

      {/* ====================
          Memo Modal
      ==================== */}

      <ScheduleMemoModal
        isOpen={isMemoModalOpen}
        initialMemo={memoPlace?.memo || ""}
        onClose={handleMemoClose}
        onSave={handleMemoSave}
        onDelete={handleMemoDelete}
      />
    </>
  );
}
