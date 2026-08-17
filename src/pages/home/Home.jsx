import { Search } from "lucide-react";

import { Link } from "react-router-dom";

import Header from "../../components/common/Header";
import BottomNav from "../../components/common/BottomNav";

import MyTrips from "../../components/home/MyTrips";
import NewTripSection from "../../components/home/NewTripSection";
import PopularDestinations from "../../components/home/PopularDestinations";

import { getCurrentUser, getTripsByUserId } from "../../lib/storage";

export default function Home() {
  // ====================
  // Current User
  // ====================

  const currentUser = getCurrentUser();

  // ====================
  // Trips
  // ====================

  const trips = currentUser ? getTripsByUserId(currentUser.id) : [];

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
          max-w-[390px]
        "
      >
        {/* ====================
            Header
        ==================== */}

        <Header
          left={
            <Link
              to="/home"
              className="
                text-[28px]
                font-bold
                leading-[36px]
                tracking-[-0.02em]
              "
            >
              LOGO
            </Link>
          }
          right={
            <Link
              to="/map"
              className="
                click-scale-sm
                flex
                flex-col
                items-center
                text-[#555555]
              "
            >
              <Search size={22} strokeWidth={1.5} />

              <span
                className="
                  text-[12px]
                  leading-[18px]
                "
              >
                도시검색
              </span>
            </Link>
          }
        />

        {/* ====================
            Content
        ==================== */}

        <div
          className="
            pt-[calc(60px+env(safe-area-inset-top))]
          "
        >
          <MyTrips currentUser={currentUser} trips={trips} />

          <NewTripSection />

          <PopularDestinations />
        </div>

        {/* ====================
            Bottom Navigation
        ==================== */}

        <BottomNav />
      </div>
    </main>
  );
}
