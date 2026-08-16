import { CalendarDays } from "lucide-react";

export default function TripHero({ trip, userName, titleRef }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${month}.${day}`;
  };

  const getNightCount = () => {
    const start = new Date(trip.startDate);

    const end = new Date(trip.endDate);

    const difference = end.getTime() - start.getTime();

    return Math.round(difference / (1000 * 60 * 60 * 24));
  };

  const fullTitle = `${userName} 님의 ${trip.title}`;

  return (
    <section className="relative h-[320px] shrink-0">
      {/* Hero Image */}
      <div className="relative h-[240px] w-full overflow-hidden bg-[#D9D9D9]">
        {trip.imageUrl ? (
          <img
            src={trip.imageUrl}
            alt={trip.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[#D9D9D9]" />
        )}

        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Trip Information */}
      <div
        className="
          absolute
          top-[190px]
          right-5
          left-5
          rounded-xl
          bg-white
          px-[20px]
          py-[18px]
          shadow-lg
        "
      >
        <h1
          ref={titleRef}
          className="text-center text-[18px] font-semibold leading-[26px] tracking-[-0.02em]"
        >
          {fullTitle}
        </h1>

        <div className="mt-[8px] flex items-center justify-center gap-[6px] text-[12px] leading-[18px] text-[#777777]">
          <CalendarDays size={14} strokeWidth={1.5} />

          <span>
            {formatDate(trip.startDate)}
            {" ~ "}
            {formatDate(trip.endDate)}
            {" / "}
            {getNightCount()}박
          </span>
        </div>
      </div>
    </section>
  );
}
