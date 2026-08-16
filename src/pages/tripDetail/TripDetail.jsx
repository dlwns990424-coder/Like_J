import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

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

/*
  모든 탭 전환 애니메이션 시간

  Hero + Card
  Tabs
  Horizontal Page

  전부 300ms로 통일
*/
const SLIDE_TIME = 300;

export default function TripDetail() {
  const navigate = useNavigate();

  const { id } = useParams();

  const currentUser = getCurrentUser();

  const trip = getTripById(id);

  // ====================
  // State
  // ====================

  const [activeTab, setActiveTab] = useState("prepare");

  const [isPrepareHeaderSolid, setIsPrepareHeaderSolid] = useState(false);

  const [tabsTop, setTabsTop] = useState(HERO_HEIGHT);

  const [heroOffset, setHeroOffset] = useState(0);

  const [animateTopArea, setAnimateTopArea] = useState(false);

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
  // TripDetail Body Scroll Lock
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
  // Header 변경 기준점
  // ====================

  useLayoutEffect(() => {
    const title = titleRef.current;

    if (!title) {
      return;
    }

    const titleRect = title.getBoundingClientRect();

    const titleCenter = titleRect.top + titleRect.height / 2;

    const headerCenter = getSafeAreaTop() + HEADER_HEIGHT / 2;

    headerSwitchPointRef.current = Math.max(0, titleCenter - headerCenter);

    const prepareScroll = prepareScrollRef.current?.scrollTop || 0;

    setIsPrepareHeaderSolid(prepareScroll >= headerSwitchPointRef.current);

    setHeroOffset(getPrepareHeroOffset());

    setTabsTop(getPrepareTabsTop());
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

    // ====================
    // Header
    // ====================

    setIsPrepareHeaderSolid(scrollTop >= headerSwitchPointRef.current);

    // ====================
    // Hero + Tabs
    //
    // 직접 스크롤할 때는
    // transition 없이
    // 손가락을 그대로 따라감
    // ====================

    if (activeTab === "prepare") {
      setAnimateTopArea(false);

      setHeroOffset(Math.min(scrollTop, getHeroCollapsedOffset()));

      setTabsTop(Math.max(getHeaderBottom(), HERO_HEIGHT - scrollTop));
    }
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

    // ====================
    // Hero + Tabs 세로 이동
    // ====================

    setAnimateTopArea(true);

    if (nextTab === "prepare") {
      /*
        여행 준비로 돌아갈 때

        Prepare가 마지막으로 가지고 있던
        실제 scrollTop 기준으로

        Hero와 Tabs 위치를 복원
      */

      setHeroOffset(getPrepareHeroOffset());

      setTabsTop(getPrepareTabsTop());
    } else {
      /*
        일정 / 지출

        Hero + Card는 위로 이동

        Tabs는 Header 바로 아래까지 이동
      */

      setHeroOffset(getHeroCollapsedOffset());

      setTabsTop(getHeaderBottom());
    }

    // ====================
    // Horizontal Slide
    //
    // 각 Page의 scrollTop은
    // 절대 변경하지 않음
    // ====================

    setActiveTab(nextTab);

    topAreaTimerRef.current = setTimeout(() => {
      setAnimateTopArea(false);
    }, SLIDE_TIME);
  };

  // ====================
  // Prepare 복귀 시 Header
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
  // Not Found
  // ====================

  if (!trip) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-white px-5 text-[#191919]">
        <p className="text-[16px] leading-[24px]">
          여행 정보를 찾을 수 없어요.
        </p>
      </main>
    );
  }

  // ====================
  // Header 상태
  // ====================

  const isHeaderSolid = activeTab === "prepare" ? isPrepareHeaderSolid : true;

  // ====================
  // Render
  // ====================

  return (
    <main className="relative h-dvh overflow-hidden bg-white text-[#191919]">
      <div className="relative mx-auto h-dvh w-full max-w-[390px] overflow-hidden">
        {/* ====================
            Shared Hero

            좌우 이동 X
            세로 이동만

            탭 클릭 시 300ms
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

            좌우 이동 X
            세로 이동만

            탭 클릭 시 300ms
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
          {/* ====================
              Horizontal Track

              Prepare
              Schedule
              Expense

              모두 300ms
          ==================== */}

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
            {/* ====================
                Prepare
            ==================== */}

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
              />
            </div>

            {/* ====================
                Schedule
            ==================== */}

            <div
              className="h-full shrink-0"
              style={{
                width: "33.333333%",
              }}
            >
              <TripSchedule containerRef={scheduleScrollRef} />
            </div>

            {/* ====================
                Expense
            ==================== */}

            <div
              className="h-full shrink-0"
              style={{
                width: "33.333333%",
              }}
            >
              <TripExpense containerRef={expenseScrollRef} />
            </div>
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
