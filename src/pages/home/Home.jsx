import BottomNav from "../../components/common/BottomNav";
import MainHeader from "../../components/common/MainHeader";

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
