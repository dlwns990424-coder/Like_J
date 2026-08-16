import { ChevronDown, MapPin, MoreHorizontal, Plus } from "lucide-react";

import { getFavoritePlacesByTripId } from "../../../lib/storage";

export default function FavoritePlaces({ tripId }) {
  const favoritePlaces = getFavoritePlacesByTripId(tripId);

  return (
    <section>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[6px]">
          <ChevronDown size={20} strokeWidth={1.5} />

          <h2 className="text-[18px] font-semibold leading-[26px] tracking-[-0.01em]">
            관심 장소
          </h2>
        </div>

        <button
          type="button"
          className="flex h-[32px] w-[32px] items-center justify-center"
        >
          <MoreHorizontal size={22} strokeWidth={1.5} />
        </button>
      </div>

      {favoritePlaces.length > 0 && (
        <div className="mt-[12px] flex flex-col gap-[10px]">
          {favoritePlaces.map((place) => (
            <div
              key={place.id}
              className="w-full rounded-xl border border-[#D9D9D9] p-[10px]"
            >
              <div className="flex items-start gap-[10px]">
                <MapPin
                  size={20}
                  strokeWidth={1.5}
                  className="mt-[2px] shrink-0 text-[#555555]"
                />

                <div>
                  <p className="text-[16px] font-semibold leading-[24px]">
                    {place.name}
                  </p>

                  <p className="mt-[2px] text-[12px] leading-[18px] text-[#888888]">
                    {place.address}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        className="mt-[12px] flex h-[38px] w-full items-center gap-[10px] rounded-xl bg-[#F5F5F5] px-[10px] text-[14px] leading-[20px] text-[#888888]"
      >
        <Plus size={18} strokeWidth={1.5} />

        <span>장소 추가</span>
      </button>
    </section>
  );
}
