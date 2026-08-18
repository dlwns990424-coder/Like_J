import { MapPin, Plus } from "lucide-react";

export default function FavoritePlaceEmptyGuide({ onAddPlace }) {
  return (
    <div
      className="
        w-full
        rounded-xl
        bg-[#EAF2FF]
        px-[14px]
        py-[12px]
      "
    >
      {/* ====================
          Guide
      ==================== */}

      <div>
        <p
          className="
            text-[13px]
            font-semibold
            leading-[20px]
            text-[#191919]
          "
        >
          아직 관심 장소가 없어요.
        </p>

        <p
          className="
            mt-[2px]
            text-[12px]
            leading-[18px]
            text-[#888888]
          "
        >
          가고 싶은 장소를 추가해보세요.
        </p>
      </div>

      {/* ====================
          Add Place
      ==================== */}

      <button
        type="button"
        onClick={onAddPlace}
        className="
          click-scale
          mt-[10px]
          flex
          h-[44px]
          w-full
          items-center
          justify-between
          rounded-xl
          bg-white
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
    </div>
  );
}
