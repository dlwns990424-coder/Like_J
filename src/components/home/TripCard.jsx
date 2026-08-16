import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

export default function TripCard({ trip }) {
  return (
    <Link
      to={`/trip/${trip.id}`}
      className="flex h-[120px] w-full gap-[20px] overflow-hidden rounded-xl border border-[#D9D9D9]"
    >
      {trip.imageUrl ? (
        <img
          src={trip.imageUrl}
          alt={trip.title}
          className="h-[120px] w-[100px] shrink-0 rounded-md object-cover"
        />
      ) : (
        <div className="flex h-[120px] w-[100px] shrink-0 items-center justify-center rounded-md bg-[#D9D9D9] text-[12px] leading-[18px] text-[#888888]">
          여행지 img
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <h2 className="truncate text-[18px] font-semibold leading-[26px] tracking-[-0.01em]">
          {trip.title}
        </h2>

        <p className="mt-[4px] text-[14px] leading-[20px] tracking-[-0.01em] text-[#555555]">
          {trip.country} · {trip.city}
        </p>

        <div className="mt-[8px] flex items-center gap-[6px] text-[14px] leading-[20px] text-[#555555]">
          <CalendarDays size={16} strokeWidth={1.5} />

          <span>
            {trip.startDate} ~ {trip.endDate}
          </span>
        </div>
      </div>
    </Link>
  );
}
