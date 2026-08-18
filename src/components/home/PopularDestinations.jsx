import { useNavigate } from "react-router-dom";

const popularDestinations = [
  {
    id: "okinawa",
    name: "오키나와",
    type: "city",
    city: "오키나와",
    country: "일본",
    countryCode: "JP",
    lat: 26.2124,
    lng: 127.6809,
    imageUrl: "/img/popular/okinawa.jpg",
  },
  {
    id: "tokyo",
    name: "도쿄",
    type: "city",
    city: "도쿄",
    country: "일본",
    countryCode: "JP",
    lat: 35.6762,
    lng: 139.6503,
    imageUrl: "/img/popular/tokyo.jpg",
  },
  {
    id: "osaka",
    name: "오사카",
    type: "city",
    city: "오사카",
    country: "일본",
    countryCode: "JP",
    lat: 34.6937,
    lng: 135.5023,
    imageUrl: "/img/popular/osaka.jpg",
  },
  {
    id: "rome",
    name: "로마",
    type: "city",
    city: "로마",
    country: "이탈리아",
    countryCode: "IT",
    lat: 41.9028,
    lng: 12.4964,
    imageUrl: "/img/popular/rome.jpg",
  },
  {
    id: "london",
    name: "런던",
    type: "city",
    city: "런던",
    country: "영국",
    countryCode: "GB",
    lat: 51.5072,
    lng: -0.1276,
    imageUrl: "/img/popular/london.jpg",
  },
  {
    id: "new-york",
    name: "뉴욕",
    type: "city",
    city: "뉴욕",
    country: "미국",
    countryCode: "US",
    lat: 40.7128,
    lng: -74.006,
    imageUrl: "/img/popular/new-york.jpg",
  },
  {
    id: "busan",
    name: "부산",
    type: "city",
    city: "부산",
    country: "대한민국",
    countryCode: "KR",
    lat: 35.1796,
    lng: 129.0756,
    imageUrl: "/img/popular/busan.jpg",
  },
  {
    id: "seoul",
    name: "서울",
    type: "city",
    city: "서울",
    country: "대한민국",
    countryCode: "KR",
    lat: 37.5665,
    lng: 126.978,
    imageUrl: "/img/popular/seoul.jpg",
  },
  {
    id: "taiwan",
    name: "대만",
    type: "country",
    city: "",
    country: "대만",
    countryCode: "TW",
    lat: 23.6978,
    lng: 120.9605,
    imageUrl: "/img/popular/taiwan.jpg",
  },
  {
    id: "hawaii",
    name: "하와이",
    type: "city",
    city: "하와이",
    country: "미국",
    countryCode: "US",
    lat: 21.3069,
    lng: -157.8583,
    imageUrl: "/img/popular/hawaii.jpg",
  },
];

export default function PopularDestinations() {
  const navigate = useNavigate();

  // ====================
  // Destination Select
  // ====================

  const handleDestinationClick = (destination) => {
    navigate("/trip-create", {
      state: {
        destination: {
          id: destination.id,

          placeId: "",

          name: destination.name,

          type: destination.type,

          city: destination.city,

          country: destination.country,

          countryCode: destination.countryCode,

          lat: destination.lat,

          lng: destination.lng,

          imageUrl: destination.imageUrl,
        },
      },
    });
  };

  return (
    <section
      className="
        overflow-hidden
        px-5
        pt-[36px]
      "
    >
      {/* ====================
          Title
      ==================== */}

      <h2
        className="
          text-[24px]
          font-bold
          leading-[32px]
          tracking-[-0.02em]
        "
      >
        인기 여행지
      </h2>

      {/* ====================
          Destination List
      ==================== */}

      <div
        className="
          hide-scrollbar
          mt-[16px]
          flex
          snap-x
          snap-mandatory
          gap-[12px]
          overflow-x-auto
          pb-[10px]
        "
      >
        {popularDestinations.map((destination) => (
          <button
            key={destination.id}
            type="button"
            onClick={() => handleDestinationClick(destination)}
            className="
              click-scale
              relative
              block
              h-[140px]
              w-[calc((100%-24px)/3)]
              min-w-[calc((100%-24px)/3)]
              shrink-0
              snap-start
              overflow-hidden
              rounded-xl
              bg-[#D9D9D9]
              text-left
            "
          >
            {/* ====================
                Image
            ==================== */}

            <img
              src={destination.imageUrl}
              alt={destination.name}
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
              "
            />

            {/* ====================
                Gradient
            ==================== */}

            <div
              className="
                absolute
                inset-x-0
                bottom-0
                h-[75%]
                bg-gradient-to-t
                from-black/75
                via-black/25
                to-transparent
              "
            />

            {/* ====================
                Destination Name
            ==================== */}

            <span
              className="
                absolute
                bottom-[12px]
                left-[12px]
                z-10
                text-[16px]
                font-semibold
                leading-[24px]
                text-white
              "
            >
              {destination.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
