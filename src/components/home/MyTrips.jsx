import { Link } from "react-router-dom";

import TripCard from "./TripCard";

export default function MyTrips({ currentUser, trips }) {
  const trip = trips[0];

  return (
    <section className="px-5 pt-[36px]">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-bold leading-[32px] tracking-[-0.02em]">
          {currentUser?.name} 님의 여행
        </h1>

        {trips.length > 0 && (
          <Link
            to="/mypage"
            className="click-scale inline-block text-[14px] leading-[20px] tracking-[-0.01em] text-[#555555]"
          >
            더보기 →
          </Link>
        )}
      </div>

      {trips.length === 0 ? (
        <div className="mt-[16px]">
          <div className="flex items-center justify-between">
            <p className="text-[16px] leading-[24px] tracking-[-0.01em] text-[#555555]">
              아직 등록된 여행이 없어요
            </p>

            <Link
              to="/trip-create"
              className="click-scale inline-block text-[16px] font-semibold leading-[24px] text-[#3478F6]"
            >
              + 여행 만들기
            </Link>
          </div>

          <p className="mt-[20px] text-[16px] leading-[24px] tracking-[-0.01em] text-[#555555]">
            새로운 여행계획을 만들어보세요.
          </p>
        </div>
      ) : (
        <div className="mt-[20px]">
          <TripCard trip={trip} />
        </div>
      )}
    </section>
  );
}
