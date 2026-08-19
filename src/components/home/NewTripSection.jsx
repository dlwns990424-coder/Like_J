import { Link } from "react-router-dom";

export default function NewTripSection() {
  return (
    <section
      className="
        relative
        mt-[48px]
        flex
        aspect-square
        w-full
        flex-col
        justify-end
        overflow-hidden
        px-5
        pb-[30px]
      "
    >
      {/* ====================
          Background
      ==================== */}

      <img
        src={`/${import.meta.env.BASE_URL}img/TripCreate_bg.jpg`}
        alt="TripCreate Background"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
        "
      />

      {/* ====================
          Overlay
      ==================== */}

      <div className="absolute inset-0 bg-black/30" />

      {/* ====================
          Content
      ==================== */}

      <div className="relative z-10">
        <h2
          className="
            text-[28px]
            font-semibold
            leading-[36px]
            tracking-[-0.02em]
            text-white
          "
        >
          다음 여행을 계획하세요
        </h2>

        <Link
          to="/trip-create"
          className="
            click-scale
            mt-[16px]
            inline-flex
            w-fit
            items-center
            justify-center
            rounded-full
            bg-[#3478F6]
            px-[16px]
            py-[8px]
            text-[14px]
            leading-[24px]
            text-white
          "
        >
          새 여행 계획 만들기
        </Link>
      </div>
    </section>
  );
}
