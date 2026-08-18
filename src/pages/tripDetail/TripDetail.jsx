import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import BottomNav from "../../components/common/BottomNav";
import ConfirmModal from "../../components/common/ConfirmModal";

import TripDetailHeader from "../../components/trip/common/TripDetailHeader";
import TripDetailTabs from "../../components/trip/common/TripDetailTabs";
import TripHero from "../../components/trip/common/TripHero";
import TripDateEditModal from "../../components/trip/common/TripDateEditModal";

import TripPrepare from "../../components/trip/prepare/TripPrepare";
import TripSchedule from "../../components/trip/schedule/TripSchedule";
import TripExpense from "../../components/trip/expense/TripExpense";

import {
  cleanupTripDataOutsideRange,
  deleteTripWithRelatedData,
  getCurrentUser,
  getTripById,
  updateTrip,
} from "../../lib/storage";

const HEADER_HEIGHT = 60;
const HERO_HEIGHT = 320;

const TAB_INDEX = {
  prepare: 0,
  schedule: 1,
  expense: 2,
};

const SLIDE_TIME = 300;

export default function TripDetail() {
  const navigate = useNavigate();

  const location = useLocation();

  const { id } = useParams();

  const currentUser = getCurrentUser();

  // ====================
  // Trip
  // ====================

  const [trip, setTrip] = useState(() => getTripById(id));

  // ====================
  // Delete
  // ====================

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // ====================
  // Trip Date Edit
  // ====================

  const [isDateEditOpen, setIsDateEditOpen] = useState(false);

  const [pendingDateRange, setPendingDateRange] = useState(null);

  const [isDateConfirmOpen, setIsDateConfirmOpen] = useState(false);

  // ====================
  // Trip Title Save
  // ====================

  const handleTripTitleSave = (title) => {
    if (!trip) {
      return;
    }

    updateTrip(trip.id, {
      title,
    });

    setTrip((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        title,
      };
    });
  };

  // ====================
  // Trip Date Edit Open
  // ====================

  const handleTripDateEditOpen = () => {
    setIsDateEditOpen(true);
  };

  // ====================
  // Trip Date Edit Close
  // ====================

  const handleTripDateEditClose = () => {
    setIsDateEditOpen(false);
  };

  // ====================
  // Trip Date Selected
  // ====================

  const handleTripDateSelected = ({ startDate, endDate }) => {
    if (!trip) {
      return;
    }

    if (startDate === trip.startDate && endDate === trip.endDate) {
      setIsDateEditOpen(false);

      return;
    }

    setPendingDateRange({
      startDate,
      endDate,
    });

    setIsDateEditOpen(false);

    setIsDateConfirmOpen(true);
  };

  // ====================
  // Trip Date Confirm Cancel
  // ====================

  const handleTripDateConfirmCancel = () => {
    setIsDateConfirmOpen(false);

    setPendingDateRange(null);
  };

  // ====================
  // Trip Date Save
  // ====================

  const handleTripDateSave = () => {
    if (!trip || !pendingDateRange) {
      return;
    }

    const { startDate, endDate } = pendingDateRange;

    cleanupTripDataOutsideRange(trip.id, startDate, endDate);

    updateTrip(trip.id, {
      startDate,
      endDate,
    });

    setTrip((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        startDate,
        endDate,
      };
    });

    setScheduleVersion((prev) => prev + 1);

    setIsDateConfirmOpen(false);

    setPendingDateRange(null);
  };

  // ====================
  // Initial Tab
  // ====================

  const initialTab =
    location.state?.tab === "schedule"
      ? "schedule"
      : location.state?.tab === "expense"
        ? "expense"
        : "prepare";

  const returnScheduleDate = location.state?.date || null;

  // ====================
  // State
  // ====================

  const [activeTab, setActiveTab] = useState(initialTab);

  const [isPrepareHeaderSolid, setIsPrepareHeaderSolid] = useState(false);

  const [tabsTop, setTabsTop] = useState(HERO_HEIGHT);

  const [heroOffset, setHeroOffset] = useState(0);

  const [animateTopArea, setAnimateTopArea] = useState(false);

  const [isHeroVisible, setIsHeroVisible] = useState(initialTab === "prepare");

  const [scheduleVersion, setScheduleVersion] = useState(0);

  // ====================
  // Refs
  // ====================

  const prepareScrollRef = useRef(null);

  const scheduleScrollRef = useRef(null);

  const expenseScrollRef = useRef(null);

  const titleRef = useRef(null);

  const headerSwitchPointRef = useRef(0);

  const topAreaTimerRef = useRef(null);

  // ====================
  // Data
  // ====================

  const fullTitle = trip ? `${currentUser?.name || ""} 님의 ${trip.title}` : "";

  const activeIndex = TAB_INDEX[activeTab];

  // ====================
  // Body Scroll Lock
  // ====================

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;

    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";

    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;

      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  // ====================
  // Schedule Added
  // ====================

  const handleScheduleAdded = () => {
    setScheduleVersion((prev) => prev + 1);
  };

  // ====================
  // Safe Area
  // ====================

  const getSafeAreaTop = () => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(
      "--safe-area-top",
    );

    return parseFloat(value) || 0;
  };

  const getHeaderBottom = () => {
    return getSafeAreaTop() + HEADER_HEIGHT;
  };

  // ====================
  // Hero 접힌 위치
  // ====================

  const getHeroCollapsedOffset = () => {
    return Math.max(0, HERO_HEIGHT - getHeaderBottom());
  };

  // ====================
  // Prepare Hero 위치
  // ====================

  const getPrepareHeroOffset = () => {
    const scrollTop = prepareScrollRef.current?.scrollTop || 0;

    return Math.min(scrollTop, getHeroCollapsedOffset());
  };

  // ====================
  // Prepare Tabs 위치
  // ====================

  const getPrepareTabsTop = () => {
    const scrollTop = prepareScrollRef.current?.scrollTop || 0;

    return Math.max(getHeaderBottom(), HERO_HEIGHT - scrollTop);
  };

  // ====================
  // 초기 위치 설정
  // ====================

  useLayoutEffect(() => {
    const title = titleRef.current;

    if (title) {
      const titleRect = title.getBoundingClientRect();

      const titleCenter = titleRect.top + titleRect.height / 2;

      const headerCenter = getSafeAreaTop() + HEADER_HEIGHT / 2;

      headerSwitchPointRef.current = Math.max(0, titleCenter - headerCenter);
    }

    const prepareScroll = prepareScrollRef.current?.scrollTop || 0;

    setIsPrepareHeaderSolid(prepareScroll >= headerSwitchPointRef.current);

    if (initialTab === "prepare") {
      setHeroOffset(getPrepareHeroOffset());

      setTabsTop(getPrepareTabsTop());

      setIsHeroVisible(true);

      return;
    }

    setHeroOffset(getHeroCollapsedOffset());

    setTabsTop(getHeaderBottom());

    setIsHeroVisible(false);
  }, [trip?.id]);

  // ====================
  // 여행 준비 Scroll
  // ====================

  const handlePrepareScroll = () => {
    const container = prepareScrollRef.current;

    if (!container) {
      return;
    }

    const scrollTop = container.scrollTop;

    setIsPrepareHeaderSolid(scrollTop >= headerSwitchPointRef.current);

    if (activeTab === "prepare") {
      setAnimateTopArea(false);

      setHeroOffset(Math.min(scrollTop, getHeroCollapsedOffset()));

      setTabsTop(Math.max(getHeaderBottom(), HERO_HEIGHT - scrollTop));
    }
  };

  // ====================
  // 현재 탭 History State 저장
  // ====================

  const syncTabState = (nextTab) => {
    const nextState = {
      ...(location.state || {}),
      tab: nextTab,
    };

    if (nextTab !== "schedule") {
      delete nextState.date;
    }

    navigate(location.pathname, {
      replace: true,
      state: nextState,
    });
  };

  // ====================
  // Tab Change
  // ====================

  const handleTabChange = (nextTab) => {
    if (nextTab === activeTab) {
      return;
    }

    if (topAreaTimerRef.current) {
      clearTimeout(topAreaTimerRef.current);
    }

    setAnimateTopArea(true);

    if (nextTab === "prepare") {
      setIsHeroVisible(true);

      setHeroOffset(getPrepareHeroOffset());

      setTabsTop(getPrepareTabsTop());
    } else {
      setHeroOffset(getHeroCollapsedOffset());

      setTabsTop(getHeaderBottom());
    }

    setActiveTab(nextTab);

    syncTabState(nextTab);

    topAreaTimerRef.current = setTimeout(() => {
      setAnimateTopArea(false);

      if (nextTab !== "prepare") {
        setIsHeroVisible(false);
      }
    }, SLIDE_TIME);
  };

  // ====================
  // Prepare 복귀 Header
  // ====================

  useEffect(() => {
    if (activeTab !== "prepare") {
      return;
    }

    const scrollTop = prepareScrollRef.current?.scrollTop || 0;

    setIsPrepareHeaderSolid(scrollTop >= headerSwitchPointRef.current);
  }, [activeTab]);

  // ====================
  // Cleanup
  // ====================

  useEffect(() => {
    return () => {
      if (topAreaTimerRef.current) {
        clearTimeout(topAreaTimerRef.current);
      }
    };
  }, []);

  // ====================
  // Home
  // ====================

  const handleHome = () => {
    navigate("/home");
  };

  // ====================
  // Delete Open
  // ====================

  const handleDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  // ====================
  // Delete Cancel
  // ====================

  const handleDeleteCancel = () => {
    setIsDeleteConfirmOpen(false);
  };

  // ====================
  // Delete Confirm
  // ====================

  const handleDeleteConfirm = () => {
    if (!trip) {
      return;
    }

    deleteTripWithRelatedData(trip.id);

    setIsDeleteConfirmOpen(false);

    navigate("/home", {
      replace: true,
    });
  };

  // ====================
  // Not Found
  // ====================

  if (!trip) {
    return (
      <main
        className="
          flex
          min-h-dvh
          items-center
          justify-center
          bg-white
          px-5
          text-[#191919]
        "
      >
        <p className="text-[16px] leading-[24px]">
          여행 정보를 찾을 수 없어요.
        </p>
      </main>
    );
  }

  // ====================
  // Header
  // ====================

  const isHeaderSolid = activeTab === "prepare" ? isPrepareHeaderSolid : true;

  // ====================
  // Render
  // ====================

  return (
    <main
      className="
        relative
        h-dvh
        overflow-hidden
        bg-white
        text-[#191919]
      "
    >
      <div
        className="
          relative
          mx-auto
          h-dvh
          w-full
          max-w-[390px]
          overflow-hidden
        "
      >
        {/* ====================
            Shared Hero
        ==================== */}

        <div
          className={`
            absolute
            top-0
            left-0
            z-20
            w-full
            will-change-transform

            ${isHeroVisible ? "visible" : "invisible"}

            ${animateTopArea ? "transition-transform ease-in-out" : ""}
          `}
          style={{
            transform: `translateY(-${heroOffset}px)`,

            transitionDuration: animateTopArea ? `${SLIDE_TIME}ms` : "0ms",
          }}
        >
          <TripHero
            trip={trip}
            userName={currentUser?.name || ""}
            titleRef={titleRef}
            onTitleSave={handleTripTitleSave}
            onDateEdit={handleTripDateEditOpen}
          />
        </div>

        {/* ====================
            Header
        ==================== */}

        <TripDetailHeader
          title={fullTitle}
          isSolid={isHeaderSolid}
          onHome={handleHome}
          onDelete={handleDelete}
        />

        {/* ====================
            Tabs
        ==================== */}

        <TripDetailTabs
          activeTab={activeTab}
          onChange={handleTabChange}
          top={tabsTop}
          animateTop={animateTopArea}
          duration={SLIDE_TIME}
        />

        {/* ====================
            Horizontal Viewport
        ==================== */}

        <div className="h-full w-full overflow-hidden">
          <div
            className="
              flex
              h-full
              items-stretch
              transition-transform
              ease-in-out
              will-change-transform
            "
            style={{
              width: "300%",

              transform: `translateX(-${activeIndex * (100 / 3)}%)`,

              transitionDuration: `${SLIDE_TIME}ms`,
            }}
          >
            {/* Prepare */}

            <div
              className="h-full shrink-0"
              style={{
                width: "33.333333%",
              }}
            >
              <TripPrepare
                trip={trip}
                containerRef={prepareScrollRef}
                onScroll={handlePrepareScroll}
                onScheduleAdded={handleScheduleAdded}
              />
            </div>

            {/* Schedule */}

            <div
              className="h-full shrink-0"
              style={{
                width: "33.333333%",
              }}
            >
              <TripSchedule
                trip={trip}
                containerRef={scheduleScrollRef}
                initialDate={returnScheduleDate}
                scheduleVersion={scheduleVersion}
              />
            </div>

            {/* Expense */}

            <div
              className="h-full shrink-0"
              style={{
                width: "33.333333%",
              }}
            >
              <TripExpense trip={trip} containerRef={expenseScrollRef} />
            </div>
          </div>
        </div>

        <BottomNav />
      </div>

      {/* ====================
          Date Edit Modal
      ==================== */}

      <TripDateEditModal
        isOpen={isDateEditOpen}
        trip={trip}
        onClose={handleTripDateEditClose}
        onSave={handleTripDateSelected}
      />

      {/* ====================
          Date Change Confirm
      ==================== */}

      <ConfirmModal
        isOpen={isDateConfirmOpen}
        title="여행 일정을 변경할까요?"
        message="변경된 여행 기간을 벗어나는 일정과 관련 데이터는 삭제돼요."
        confirmText="변경"
        cancelText="취소"
        onConfirm={handleTripDateSave}
        onCancel={handleTripDateConfirmCancel}
      />

      {/* ====================
          Trip Delete Confirm
      ==================== */}

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        title="여행 계획을 삭제할까요?"
        message="삭제한 여행 계획과 관련된 일정 및 지출 정보는 다시 복구할 수 없어요."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        danger
      />
    </main>
  );
}
