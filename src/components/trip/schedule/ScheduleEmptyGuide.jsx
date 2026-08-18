import { MapPin, Plus } from "lucide-react";

export default function ScheduleEmptyGuide({ onAddPlace }) {
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
          아직 일정이 없어요.
        </p>

        <p
          className="
            mt-[2px]
            text-[12px]
            leading-[18px]
            text-[#888888]
          "
        >
          장소를 추가해서 일정을 만들어보세요.
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
          h-[38px]
          w-full
          items-center
          gap-[8px]
          rounded-lg
          bg-white
          px-[12px]
          text-[13px]
          font-medium
          text-[#555555]
        "
      >
        <MapPin size={16} strokeWidth={1.5} />

        <span>장소 추가</span>

        <Plus size={15} strokeWidth={1.5} className="ml-auto" />
      </button>
    </div>
  );
}
