import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import BottomNav from "../../components/common/BottomNav";

import TripDetailHeader from "../../components/trip/common/TripDetailHeader";
import TripDetailTabs from "../../components/trip/common/TripDetailTabs";
import TripHero from "../../components/trip/common/TripHero";

import TripPrepare from "../../components/trip/prepare/TripPrepare";
import TripSchedule from "../../components/trip/schedule/TripSchedule";
import TripExpense from "../../components/trip/expense/TripExpense";

import { getCurrentUser, getTripById } from "../../lib/storage";

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

  const trip = getTripById(id);

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
  // History State
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
  // 탭 변경
  // ====================

  const handleTabChange = (nextTab) => {
    if (nextTab === activeTab) {
      return;
    }

    if (topAreaTimerRef.current) {
      clearTimeout(topAreaTimerRef.current);
    }

    setAnimateTopArea(true);

    // ====================
    // 여행 준비
    // ====================

    if (nextTab === "prepare") {
      setIsHeroVisible(true);

      setHeroOffset(getPrepareHeroOffset());

      setTabsTop(getPrepareTabsTop());
    }

    // ====================
    // 일정 / 지출
    // ====================
    else {
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
  // Prepare 복귀
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
  // Navigation
  // ====================

  const handleHome = () => {
    navigate("/home");
  };

  const handleDelete = () => {
    console.log("여행 삭제");
  };

  // ====================
  // Panel Position
  //
  // 각 패널 자체가
  // 화면 100% 너비를 가진다.
  //
  // 현재 탭 = 0%
  // 왼쪽 탭 = -100%
  // 오른쪽 탭 = 100%
  // ====================

  const getPanelTransform = (panelIndex) => {
    const difference = panelIndex - activeIndex;

    return `translate3d(${difference * 100}%, 0, 0)`;
  };

  // ====================
  // Panel Interaction
  //
  // 현재 탭만 클릭 / 스크롤 가능
  // ====================

  const getPanelClassName = (panelIndex) => {
    const isActive = panelIndex === activeIndex;

    return `
      absolute
      inset-0
      h-full
      w-full
      overflow-hidden
      transition-transform
      ease-in-out
      will-change-transform

      ${isActive ? "z-10 pointer-events-auto" : "z-0 pointer-events-none"}
    `;
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
            pointer-events-none
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
            Tab Viewport
        ==================== */}

        <div
          className="
            relative
            h-full
            w-full
            overflow-hidden
          "
        >
          {/* ====================
              Prepare Panel
          ==================== */}

          <div
            className={getPanelClassName(0)}
            style={{
              transform: getPanelTransform(0),

              transitionDuration: `${SLIDE_TIME}ms`,
            }}
          >
            <TripPrepare
              trip={trip}
              containerRef={prepareScrollRef}
              onScroll={handlePrepareScroll}
            />
          </div>

          {/* ====================
              Schedule Panel
          ==================== */}

          <div
            className={getPanelClassName(1)}
            style={{
              transform: getPanelTransform(1),

              transitionDuration: `${SLIDE_TIME}ms`,
            }}
          >
            <TripSchedule
              trip={trip}
              containerRef={scheduleScrollRef}
              initialDate={returnScheduleDate}
            />
          </div>

          {/* ====================
              Expense Panel
          ==================== */}

          <div
            className={getPanelClassName(2)}
            style={{
              transform: getPanelTransform(2),

              transitionDuration: `${SLIDE_TIME}ms`,
            }}
          >
            <TripExpense containerRef={expenseScrollRef} />
          </div>
        </div>

        {/* ====================
            Bottom Navigation
        ==================== */}

        <BottomNav />
      </div>
    </main>
  );
}
