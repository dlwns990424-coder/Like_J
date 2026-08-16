import { Link } from "react-router-dom";

const popularDestinations = [
  {
    id: "japan",
    name: "일본",
  },
  {
    id: "paris",
    name: "파리",
  },
  {
    id: "rome",
    name: "로마",
  },
  {
    id: "new-york",
    name: "뉴욕",
  },
];

export default function PopularDestinations() {
  return (
    <section className="overflow-hidden px-5 pt-[36px]">
      <h2 className="text-[24px] font-bold leading-[32px] tracking-[-0.02em]">
        인기 여행지
      </h2>

      <div className="mt-[16px] flex gap-[12px] overflow-x-auto pb-[10px]">
        {popularDestinations.map((destination) => (
          <Link
            key={destination.id}
            to={`/map?search=${encodeURIComponent(destination.name)}`}
            className="relative h-[120px] min-w-[100px] overflow-hidden rounded-xl bg-[#D9D9D9]"
          >
            <span className="absolute bottom-[10px] left-[10px] text-[16px] font-semibold leading-[24px] text-white">
              {destination.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
