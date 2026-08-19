import { Check, ChevronDown, ChevronUp, Search } from "lucide-react";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../../components/common/Header";
import BottomNav from "../../components/common/BottomNav";

import TripCard from "../../components/home/TripCard";
import TripEditMenu from "./TripEditMenu";

import {
  deleteTrips,
  getCurrentUser,
  getTripsByUserId,
  updateUserName,
} from "../../lib/storage";
import MainHeader from "../../components/common/MainHeader";

export default function MyPage() {
  // ====================
  // Current User
  // ====================

  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  // ====================
  // Nickname Edit
  // ====================

  const [isNameEdit, setIsNameEdit] = useState(false);

  const [name, setName] = useState(currentUser?.name || "");

  // ====================
  // Nickname Length
  // ====================

  const getNicknameLength = (value) => {
    return [...value].reduce((length, char) => {
      if (/[가-힣]/.test(char)) {
        return length + 2;
      }

      return length + 1;
    }, 0);
  };

  // ====================
  // Trips
  // ====================

  const [tripList, setTripList] = useState(() => {
    if (!currentUser) {
      return [];
    }

    return getTripsByUserId(currentUser.id);
  });

  // ====================
  // Sort
  // ====================

  const [sortType, setSortType] = useState("time");

  const [isSortOpen, setIsSortOpen] = useState(false);

  // ====================
  // Edit
  // ====================

  const [isEditMode, setIsEditMode] = useState(false);

  const [selectedTripIds, setSelectedTripIds] = useState([]);

  // ====================
  // Sorted Trips
  // ====================

  const trips = useMemo(() => {
    // ====================
    // 시간순
    //
    // 여행 시작일이
    // 가장 빠른 여행부터
    // ====================

    if (sortType === "time") {
      return [...tripList].sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate),
      );
    }

    // ====================
    // 추가순
    //
    // 가장 최근에 생성한
    // 여행부터
    // ====================

    if (sortType === "created") {
      return [...tripList].reverse();
    }

    return tripList;
  }, [tripList, sortType]);

  // ====================
  // Nickname Edit Start
  // ====================

  const handleNameEditStart = () => {
    setName(currentUser?.name || "");

    setIsNameEdit(true);
  };

  // ====================
  // Nickname Change
  // ====================

  const handleNameChange = (e) => {
    const value = e.target.value;

    // 한글, 영문, 숫자만 허용
    const nicknameRegex = /^[가-힣A-Za-z0-9]*$/;

    if (!nicknameRegex.test(value)) {
      return;
    }

    // 한글 1자 = 2
    // 영문/숫자 1자 = 1
    // 최대 16
    if (getNicknameLength(value) > 16) {
      return;
    }

    setName(value);
  };

  // ====================
  // Nickname Save
  // ====================

  const handleNameSave = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const nicknameRegex = /^[가-힣A-Za-z0-9]+$/;

    if (!nicknameRegex.test(trimmedName)) {
      return;
    }

    if (getNicknameLength(trimmedName) > 16) {
      return;
    }

    const updatedUser = updateUserName(currentUser.id, trimmedName);

    if (!updatedUser) {
      return;
    }

    setCurrentUser(updatedUser);

    setName(updatedUser.name);

    setIsNameEdit(false);
  };

  // ====================
  // Nickname Key Down
  // ====================

  const handleNameKeyDown = (e) => {
    if (e.key !== "Enter") {
      return;
    }

    e.preventDefault();

    handleNameSave();
  };

  // ====================
  // Sort Change
  // ====================

  const handleSort = (type) => {
    setSortType(type);

    setIsSortOpen(false);
  };

  // ====================
  // Edit Start
  // ====================

  const handleEditStart = () => {
    setIsEditMode(true);

    setSelectedTripIds([]);

    setIsSortOpen(false);
  };

  // ====================
  // Edit Complete
  // ====================

  const handleEditComplete = () => {
    setIsEditMode(false);

    setSelectedTripIds([]);
  };

  // ====================
  // Trip Select
  // ====================

  const handleTripSelect = (tripId) => {
    setSelectedTripIds((prev) => {
      if (prev.includes(tripId)) {
        return prev.filter((id) => id !== tripId);
      }

      return [...prev, tripId];
    });
  };

  // ====================
  // Select All
  // ====================

  const handleSelectAll = () => {
    if (trips.length === 0) {
      return;
    }

    if (selectedTripIds.length === trips.length) {
      setSelectedTripIds([]);

      return;
    }

    setSelectedTripIds(trips.map((trip) => trip.id));
  };

  // ====================
  // Selected Delete
  // ====================

  const handleSelectedDelete = () => {
    if (selectedTripIds.length === 0) {
      return;
    }

    deleteTrips(selectedTripIds);

    setTripList((prev) =>
      prev.filter((trip) => !selectedTripIds.includes(trip.id)),
    );

    setSelectedTripIds([]);
  };

  // ====================
  // Delete All
  // ====================

  const handleDeleteAll = () => {
    if (tripList.length === 0) {
      return;
    }

    const tripIds = tripList.map((trip) => trip.id);

    deleteTrips(tripIds);

    setTripList([]);

    setSelectedTripIds([]);

    setIsEditMode(false);
  };

  return (
    <main
      className="
        min-h-dvh
        bg-white
        pb-[120px]
        text-[#191919]
      "
    >
      <div
        className="
          mx-auto
          min-h-dvh
          w-full
        "
      >
        {/* ====================
            Header
        ==================== */}

        <MainHeader />

        {/* ====================
            Content
        ==================== */}

        <div
          className="
            mx-auto
            w-full
            max-w-[430px]
            px-5
            pt-[calc(60px+env(safe-area-inset-top))]
          "
        >
          {/* ====================
              User Info
          ==================== */}

          <section
            className="
              mt-[20px]
              rounded-xl
              border
              border-[#D9D9D9]
              bg-white
              px-[16px]
              py-[18px]
            "
          >
            {/* ====================
                Nickname
            ==================== */}

            {isNameEdit ? (
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  onKeyDown={handleNameKeyDown}
                  enterKeyHint="done"
                  autoFocus
                  className="
                    h-[32px]
                    w-full
                    rounded-lg
                    border
                    border-[#3478F6]
                    px-[8px]
                    text-[18px]
                    font-semibold
                    leading-[27px]
                    tracking-[-0.01em]
                    outline-none
                  "
                />

                <p className="mt-[5px] text-[11px] leading-[16px] text-[#888888]">
                  한글 8자 / 영문 16자 이내, 특수문자 사용 불가
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleNameEditStart}
                className="
                  text-left
                  text-[18px]
                  font-semibold
                  leading-[27px]
                  tracking-[-0.01em]
                "
              >
                {currentUser?.name || "사용자"}
              </button>
            )}

            {/* ====================
                Email
            ==================== */}

            <p
              className="
                mt-[6px]
                text-[13px]
                leading-[20px]
                text-[#888888]
              "
            >
              {currentUser?.email || ""}
            </p>
          </section>

          {/* ====================
              Trip List
          ==================== */}

          <section className="mt-[24px]">
            <div className="flex items-center justify-between">
              <h2
                className="
                  text-[18px]
                  font-semibold
                  leading-[27px]
                  tracking-[-0.01em]
                "
              >
                여행 목록
              </h2>

              {!isEditMode && (
                <TripEditMenu
                  isEditMode={false}
                  trips={trips}
                  selectedTripIds={selectedTripIds}
                  onEditStart={handleEditStart}
                  onEditComplete={handleEditComplete}
                  onSelectAll={handleSelectAll}
                  onSelectedDelete={handleSelectedDelete}
                  onDeleteAll={handleDeleteAll}
                />
              )}
            </div>

            {/* ====================
                Normal Mode
            ==================== */}

            {!isEditMode && (
              <div className="relative mt-[2px] flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsSortOpen((prev) => !prev)}
                  className="
                    flex
                    items-center
                    gap-[4px]
                    text-[12px]
                    leading-[18px]
                    text-[#555555]
                  "
                >
                  <span>정렬 기준</span>

                  <strong className="font-medium text-[#191919]">
                    {sortType === "time" ? "시간순" : "추가순"}
                  </strong>

                  {isSortOpen ? (
                    <ChevronUp size={14} strokeWidth={1.5} />
                  ) : (
                    <ChevronDown size={14} strokeWidth={1.5} />
                  )}
                </button>

                {/* ====================
                    Sort Menu
                ==================== */}

                {isSortOpen && (
                  <div
                    className="
                      absolute
                      top-[26px]
                      right-0
                      z-20
                      w-[120px]
                      overflow-hidden
                      rounded-[12px]
                      border
                      border-[#E5E5E5]
                      bg-white
                      py-[6px]
                      shadow-lg
                    "
                  >
                    <button
                      type="button"
                      onClick={() => handleSort("time")}
                      className="
                        flex
                        h-[44px]
                        w-full
                        items-center
                        justify-between
                        px-[14px]
                        text-[13px]
                        hover:bg-[#F5F5F5]
                      "
                    >
                      <span>시간순</span>

                      {sortType === "time" && (
                        <Check
                          size={16}
                          strokeWidth={1.8}
                          className="text-[#3478F6]"
                        />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSort("created")}
                      className="
                        flex
                        h-[44px]
                        w-full
                        items-center
                        justify-between
                        px-[14px]
                        text-[13px]
                        hover:bg-[#F5F5F5]
                      "
                    >
                      <span>추가순</span>

                      {sortType === "created" && (
                        <Check
                          size={16}
                          strokeWidth={1.8}
                          className="text-[#3478F6]"
                        />
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ====================
                Edit Mode
            ==================== */}

            {isEditMode && (
              <div className="mt-[14px]">
                <TripEditMenu
                  isEditMode
                  trips={trips}
                  selectedTripIds={selectedTripIds}
                  onEditStart={handleEditStart}
                  onEditComplete={handleEditComplete}
                  onSelectAll={handleSelectAll}
                  onSelectedDelete={handleSelectedDelete}
                  onDeleteAll={handleDeleteAll}
                />
              </div>
            )}

            {/* ====================
                Trip Cards
            ==================== */}

            {trips.length > 0 ? (
              <div
                className={`
                  flex
                  flex-col
                  gap-[10px]

                  ${isEditMode ? "mt-[20px]" : "mt-[12px]"}
                `}
              >
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    isEditMode={isEditMode}
                    isSelected={selectedTripIds.includes(trip.id)}
                    onSelect={handleTripSelect}
                  />
                ))}
              </div>
            ) : (
              <div
                className="
                mt-[12px]
                flex
                h-[180px]
                flex-col
                items-center
                justify-center
                rounded-xl
                border
                border-[#D9D9D9]
                px-[20px]
                "
              >
                <p
                  className="
                    text-[14px]
                    leading-[20px]
                    text-[#888888]
                "
                >
                  등록된 여행이 없습니다.
                </p>

                <Link
                  to="/trip-create"
                  className="
                    click-scale
                    mt-[16px]
                    flex
                    h-[42px]
                    items-center
                    justify-center
                    rounded-full
                    bg-[#3478F6]
                    px-[20px]
                    text-[14px]
                    leading-[20px]
                    text-white
      "
                >
                  새 여행 계획 만들기
                </Link>
              </div>
            )}
          </section>
        </div>

        {/* ====================
            Bottom Navigation
        ==================== */}

        <BottomNav />
      </div>
    </main>
  );
}
