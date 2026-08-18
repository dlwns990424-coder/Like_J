import { useEffect, useMemo, useState } from "react";

import { MapPin, Plus } from "lucide-react";

import { useNavigate } from "react-router-dom";

import ScheduleDateTabs from "./ScheduleDateTabs";
import ScheduleAccommodation from "./ScheduleAccommodation";
import ScheduleMemo from "./ScheduleMemo";
import ScheduleMemoModal from "./ScheduleMemoModal";
import ScheduleSortMenu from "./ScheduleSortMenu";
import ScheduleEditMenu from "./ScheduleEditMenu";
import ScheduleTimeline from "./ScheduleTimeline";
import ScheduleEmptyGuide from "./ScheduleEmptyGuide";

import AccommodationSelectModal from "./AccommodationSelectModal";
import AccommodationPeriodModal from "./AccommodationPeriodModal";

import {
  deleteAccommodation,
  deleteSchedule,
  deleteScheduleMemo,
  getAccommodationsByTripAndDate,
  getFavoritePlacesByTripId,
  getScheduleMemoByTripAndDate,
  getSchedulesByTripId,
  saveAccommodation,
  saveScheduleMemo,
  updateSchedule,
} from "../../../lib/storage";

// ====================
// Date Utils
// ====================

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const formatDateKey = (date) => {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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
    dates.push(new Date(current));

    current.setDate(current.getDate() + 1);
  }

  return dates;
};

// ====================
// Time Sorting
// ====================

const getTimeValue = (schedule) => {
  if (!schedule.startTime) {
    return Number.MAX_SAFE_INTEGER;
  }

  const [hour, minute] = schedule.startTime.split(":").map(Number);

  return hour * 60 + minute;
};

export default function TripSchedule({ trip, containerRef, initialDate }) {
  const navigate = useNavigate();

  // ====================
  // Trip Dates
  // ====================

  const tripDates = useMemo(
    () => getTripDates(trip.startDate, trip.endDate),
    [trip.startDate, trip.endDate],
  );

  // ====================
  // Initial Date
  // ====================

  const getInitialSelectedDate = () => {
    if (initialDate) {
      const exists = tripDates.some(
        (date) => formatDateKey(date) === initialDate,
      );

      if (exists) {
        return initialDate;
      }
    }

    return tripDates.length > 0 ? formatDateKey(tripDates[0]) : "";
  };

  const [selectedDate, setSelectedDate] = useState(getInitialSelectedDate);

  // ====================
  // Schedule
  // ====================

  const [schedules, setSchedules] = useState([]);

  // ====================
  // Accommodation
  // ====================

  const [accommodations, setAccommodations] = useState([]);

  const [isAccommodationSelectOpen, setIsAccommodationSelectOpen] =
    useState(false);

  const [isAccommodationPeriodOpen, setIsAccommodationPeriodOpen] =
    useState(false);

  const [selectedAccommodationPlace, setSelectedAccommodationPlace] =
    useState(null);

  // ====================
  // Memo
  //
  // 날짜 전체 메모
  // ====================

  const [memo, setMemo] = useState("");

  const [isMemoOpen, setIsMemoOpen] = useState(false);

  // ====================
  // Sort
  // ====================

  const [sortType, setSortType] = useState("time");

  // ====================
  // Edit
  // ====================

  const [isEditMode, setIsEditMode] = useState(false);

  const [selectedScheduleIds, setSelectedScheduleIds] = useState([]);

  // ====================
  // Favorite Places
  // ====================

  const favoritePlaces = getFavoritePlacesByTripId(trip.id);

  // ====================
  // Refresh Schedule
  // ====================

  const refreshSchedules = () => {
    setSchedules(getSchedulesByTripId(trip.id));
  };

  // ====================
  // Refresh Accommodation
  // ====================

  const refreshAccommodations = () => {
    if (!selectedDate) {
      setAccommodations([]);

      return;
    }

    setAccommodations(getAccommodationsByTripAndDate(trip.id, selectedDate));
  };

  // ====================
  // Refresh Memo
  // ====================

  const refreshMemo = () => {
    if (!selectedDate) {
      setMemo("");

      return;
    }

    const savedMemo = getScheduleMemoByTripAndDate(trip.id, selectedDate);

    setMemo(savedMemo?.content || "");
  };

  // ====================
  // Initial Load
  // ====================

  useEffect(() => {
    refreshSchedules();
  }, [trip.id]);

  useEffect(() => {
    refreshAccommodations();

    refreshMemo();
  }, [trip.id, selectedDate]);

  // ====================
  // Return Date
  // ====================

  useEffect(() => {
    if (!initialDate) {
      return;
    }

    const exists = tripDates.some(
      (date) => formatDateKey(date) === initialDate,
    );

    if (exists) {
      setSelectedDate(initialDate);
    }
  }, [initialDate, tripDates]);

  // ====================
  // Selected Schedules
  // ====================

  const selectedSchedules = useMemo(() => {
    const filtered = schedules.filter(
      (schedule) => schedule.date === selectedDate,
    );

    // ====================
    // Added Order
    // ====================

    if (sortType === "order") {
      return [...filtered].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    // ====================
    // Time Order
    // ====================

    return [...filtered].sort((a, b) => {
      const timeDifference = getTimeValue(a) - getTimeValue(b);

      if (timeDifference !== 0) {
        return timeDifference;
      }

      return (a.order ?? 0) - (b.order ?? 0);
    });
  }, [schedules, selectedDate, sortType]);

  // ====================
  // Date Select
  // ====================

  const handleDateSelect = (date) => {
    const nextDate = formatDateKey(date);

    if (nextDate === selectedDate) {
      return;
    }

    setSelectedDate(nextDate);

    setIsEditMode(false);

    setSelectedScheduleIds([]);

    setIsMemoOpen(false);
  };

  // ====================
  // Date Memo
  // ====================

  const handleMemoOpen = () => {
    setIsMemoOpen(true);
  };

  const handleMemoClose = () => {
    setIsMemoOpen(false);
  };

  const handleMemoSave = (content) => {
    if (!content) {
      deleteScheduleMemo(trip.id, selectedDate);

      setMemo("");

      setIsMemoOpen(false);

      return;
    }

    saveScheduleMemo({
      tripId: trip.id,

      date: selectedDate,

      content,
    });

    setMemo(content);

    setIsMemoOpen(false);
  };

  const handleMemoDelete = () => {
    deleteScheduleMemo(trip.id, selectedDate);

    setMemo("");

    setIsMemoOpen(false);
  };

  // ====================
  // Schedule Card Memo
  // ====================

  const handleScheduleMemoSave = (scheduleId, content) => {
    updateSchedule(scheduleId, {
      memo: content,
    });

    refreshSchedules();
  };

  // ====================
  // Accommodation Open
  // ====================

  const handleAccommodationOpen = () => {
    setIsAccommodationSelectOpen(true);
  };

  // ====================
  // Accommodation Select
  // ====================

  const handleAccommodationPlaceSelect = (place) => {
    setSelectedAccommodationPlace(place);

    setIsAccommodationSelectOpen(false);

    setIsAccommodationPeriodOpen(true);
  };

  // ====================
  // Accommodation Map
  // ====================

  const handleAccommodationMap = () => {
    setIsAccommodationSelectOpen(false);

    navigate("/map", {
      state: {
        mode: "accommodation",

        tripId: trip.id,

        date: selectedDate,
      },
    });
  };

  // ====================
  // Accommodation Save
  // ====================

  const handleAccommodationSave = (period) => {
    if (!selectedAccommodationPlace) {
      return;
    }

    const accommodation = {
      id: crypto.randomUUID(),

      tripId: trip.id,

      placeId:
        selectedAccommodationPlace.placeId || selectedAccommodationPlace.id,

      name: selectedAccommodationPlace.name,

      category: selectedAccommodationPlace.category,

      address: selectedAccommodationPlace.address,

      country: selectedAccommodationPlace.country,

      countryCode: selectedAccommodationPlace.countryCode,

      city: selectedAccommodationPlace.city,

      lat: selectedAccommodationPlace.lat,

      lng: selectedAccommodationPlace.lng,

      imageUrl: selectedAccommodationPlace.imageUrl,

      checkInDate: period.checkInDate,

      checkInTime: period.checkInTime,

      checkOutDate: period.checkOutDate,

      checkOutTime: period.checkOutTime,
    };

    const saved = saveAccommodation(accommodation);

    if (!saved) {
      alert("해당 기간에는 숙소를 최대 2개까지 지정할 수 있어요.");

      return;
    }

    setIsAccommodationPeriodOpen(false);

    setSelectedAccommodationPlace(null);

    refreshAccommodations();
  };

  // ====================
  // Accommodation Delete
  // ====================

  const handleAccommodationDelete = (accommodationId) => {
    const confirmed = window.confirm("이 숙소를 삭제할까요?");

    if (!confirmed) {
      return;
    }

    deleteAccommodation(accommodationId);

    refreshAccommodations();
  };

  // ====================
  // Place Add
  // ====================

  const handlePlaceAdd = () => {
    if (!selectedDate) {
      return;
    }

    navigate("/map", {
      state: {
        mode: "schedule",

        tripId: trip.id,

        date: selectedDate,
      },
    });
  };

  // ====================
  // Time Save
  // ====================

  const handleTimeSave = (scheduleId, startTime, endTime) => {
    updateSchedule(scheduleId, {
      startTime,
      endTime,
    });

    refreshSchedules();
  };

  // ====================
  // Edit Start
  // ====================

  const handleEditStart = () => {
    setSelectedScheduleIds([]);

    setIsEditMode(true);
  };

  // ====================
  // Edit Complete
  // ====================

  const handleEditComplete = () => {
    setIsEditMode(false);

    setSelectedScheduleIds([]);
  };

  // ====================
  // Schedule Select
  // ====================

  const handleScheduleSelect = (scheduleId) => {
    setSelectedScheduleIds((prev) =>
      prev.includes(scheduleId)
        ? prev.filter((id) => id !== scheduleId)
        : [...prev, scheduleId],
    );
  };

  // ====================
  // Select All
  // ====================

  const handleSelectAll = () => {
    const allSelected =
      selectedSchedules.length > 0 &&
      selectedScheduleIds.length === selectedSchedules.length;

    if (allSelected) {
      setSelectedScheduleIds([]);

      return;
    }

    setSelectedScheduleIds(selectedSchedules.map((schedule) => schedule.id));
  };

  // ====================
  // Selected Delete
  // ====================

  const handleSelectedDelete = () => {
    if (selectedScheduleIds.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `선택한 일정 ${selectedScheduleIds.length}개를 삭제할까요?`,
    );

    if (!confirmed) {
      return;
    }

    selectedScheduleIds.forEach((scheduleId) => {
      deleteSchedule(scheduleId);
    });

    setSelectedScheduleIds([]);

    refreshSchedules();
  };

  // ====================
  // Delete All
  // ====================

  const handleDeleteAll = () => {
    if (selectedSchedules.length === 0) {
      return;
    }

    const confirmed = window.confirm("현재 날짜의 일정을 모두 삭제할까요?");

    if (!confirmed) {
      return;
    }

    selectedSchedules.forEach((schedule) => {
      deleteSchedule(schedule.id);
    });

    setSelectedScheduleIds([]);

    setIsEditMode(false);

    refreshSchedules();
  };

  return (
    <div
      ref={containerRef}
      className="
        hide-scrollbar
        h-full
        w-full
        overflow-x-hidden
        overflow-y-auto
        overscroll-y-contain
        pt-[calc(118px+env(safe-area-inset-top))]
        pb-[calc(120px+env(safe-area-inset-bottom))]
      "
    >
      <section className="px-5 pt-[16px]">
        {/* ====================
            Date
        ==================== */}

        <ScheduleDateTabs
          dates={tripDates}
          selectedDate={selectedDate}
          onSelect={handleDateSelect}
        />

        {/* ====================
            Accommodation
        ==================== */}

        <ScheduleAccommodation
          accommodations={accommodations}
          onAdd={handleAccommodationOpen}
          onDelete={handleAccommodationDelete}
        />

        {/* ====================
            Date Memo
        ==================== */}

        <ScheduleMemo memo={memo} onClick={handleMemoOpen} />

        {/* ====================
            Schedule Controls
        ==================== */}

        {selectedSchedules.length === 0 && !isEditMode ? (
          /* ====================
              Empty Guide
          ==================== */

          <div className="mt-[12px]">
            <ScheduleEmptyGuide onAddPlace={handlePlaceAdd} />
          </div>
        ) : (
          /* ====================
              Place Add + Edit + Sort
          ==================== */

          <div className="mt-[12px]">
            {isEditMode ? (
              <ScheduleEditMenu
                isEditMode={isEditMode}
                selectedSchedules={selectedSchedules}
                selectedScheduleIds={selectedScheduleIds}
                onEditStart={handleEditStart}
                onEditComplete={handleEditComplete}
                onSelectAll={handleSelectAll}
                onSelectedDelete={handleSelectedDelete}
                onDeleteAll={handleDeleteAll}
              />
            ) : (
              <div className="flex items-start justify-between gap-[12px]">
                {/* ====================
                    Add Place
                ==================== */}

                <button
                  type="button"
                  onClick={handlePlaceAdd}
                  className="
                    click-scale
                    flex
                    h-[44px]
                    w-[240px]
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
                    Edit + Sort
                ==================== */}

                <div className="ml-auto">
                  <ScheduleEditMenu
                    isEditMode={false}
                    selectedSchedules={selectedSchedules}
                    selectedScheduleIds={selectedScheduleIds}
                    onEditStart={handleEditStart}
                    onEditComplete={handleEditComplete}
                    onSelectAll={handleSelectAll}
                    onSelectedDelete={handleSelectedDelete}
                    onDeleteAll={handleDeleteAll}
                  />

                  <div className="mt-[2px]">
                    <ScheduleSortMenu
                      sortType={sortType}
                      onChange={setSortType}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====================
            Timeline
        ==================== */}

        <ScheduleTimeline
          schedules={selectedSchedules}
          isEditMode={isEditMode}
          selectedScheduleIds={selectedScheduleIds}
          onSelectSchedule={handleScheduleSelect}
          onTimeSave={handleTimeSave}
          onMemoSave={handleScheduleMemoSave}
        />
      </section>

      {/* ====================
          Accommodation Select
      ==================== */}

      <AccommodationSelectModal
        isOpen={isAccommodationSelectOpen}
        favoritePlaces={favoritePlaces}
        onClose={() => setIsAccommodationSelectOpen(false)}
        onSelect={handleAccommodationPlaceSelect}
        onOpenMap={handleAccommodationMap}
      />

      {/* ====================
          Accommodation Period
      ==================== */}

      <AccommodationPeriodModal
        isOpen={isAccommodationPeriodOpen}
        place={selectedAccommodationPlace}
        trip={trip}
        initialDate={selectedDate}
        onClose={() => {
          setIsAccommodationPeriodOpen(false);

          setSelectedAccommodationPlace(null);
        }}
        onSave={handleAccommodationSave}
      />

      {/* ====================
          Date Memo Modal
      ==================== */}

      <ScheduleMemoModal
        isOpen={isMemoOpen}
        initialMemo={memo}
        onClose={handleMemoClose}
        onSave={handleMemoSave}
        onDelete={handleMemoDelete}
      />
    </div>
  );
}
