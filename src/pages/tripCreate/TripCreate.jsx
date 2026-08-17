import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, MapPin } from "lucide-react";

import Header from "../../components/common/Header";
import SearchInput from "../../components/common/SearchInput";
import Calendar from "../../components/trip/common/Calendar";

import {
  getGooglePlaceImage,
  searchGoogleDestinations,
} from "../../api/googlePlaceApi";

import { getCurrentUser, saveTrip } from "../../lib/storage";

export default function TripCreate() {
  const navigate = useNavigate();

  const location = useLocation();

  const currentUser = getCurrentUser();

  // ====================
  // Map에서 넘어온 데이터
  // ====================

  const destinationFromMap = location.state?.destination || null;

  const sourcePlace = location.state?.sourcePlace || null;

  // ====================
  // Map Destination
  // ====================

  const createMapDestination = () => {
    if (!destinationFromMap) {
      return null;
    }

    const cityName = destinationFromMap.city || destinationFromMap.name || "";

    const countryName = destinationFromMap.country || "";

    const name = cityName || countryName;

    return {
      id: destinationFromMap.placeId || crypto.randomUUID(),

      googlePlaceId: destinationFromMap.placeId || "",

      type: cityName ? "city" : "country",

      name,

      country: countryName,

      countryCode: destinationFromMap.countryCode || "",

      city: cityName,

      admin1: "",

      lat: destinationFromMap.lat ?? null,

      lng: destinationFromMap.lng ?? null,
    };
  };

  // ====================
  // Step
  // ====================

  const [step, setStep] = useState(destinationFromMap ? 2 : 1);

  // ====================
  // Search
  // ====================

  const [keyword, setKeyword] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const [isSearching, setIsSearching] = useState(false);

  const [hasSearched, setHasSearched] = useState(false);

  const [showAllResults, setShowAllResults] = useState(false);

  // ====================
  // Destination
  // ====================

  const [selectedDestination, setSelectedDestination] =
    useState(createMapDestination);

  // ====================
  // Date
  // ====================

  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  // ====================
  // Create
  // ====================

  const [isCreating, setIsCreating] = useState(false);

  // ====================
  // Search
  //
  // Google API는
  // submit 시에만 호출
  // ====================

  const handleSearch = async (e) => {
    e.preventDefault();

    const searchKeyword = keyword.trim();

    if (!searchKeyword || isSearching) {
      return;
    }

    setIsSearching(true);

    setHasSearched(false);

    setSearchResults([]);

    setShowAllResults(false);

    try {
      const results = await searchGoogleDestinations(searchKeyword);

      setSearchResults(results || []);

      setHasSearched(true);
    } catch (error) {
      console.error("여행지 검색 오류:", error);

      setSearchResults([]);

      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  // ====================
  // Keyword
  //
  // 입력 중 API 호출 X
  // ====================

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);

    setSearchResults([]);

    setHasSearched(false);

    setShowAllResults(false);
  };

  // ====================
  // Destination Select
  //
  // Google API 호출 X
  // ====================

  const handleDestinationSelect = (destination) => {
    setSelectedDestination(destination);

    setStartDate(null);

    setEndDate(null);

    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));

    setStep(2);
  };

  // ====================
  // Date Format
  // ====================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ====================
  // Currency
  // ====================

  const getCurrencyByCountryCode = (countryCode) => {
    const currencyMap = {
      KR: "KRW",
      JP: "JPY",
      US: "USD",
      CN: "CNY",

      GB: "GBP",

      FR: "EUR",
      DE: "EUR",
      IT: "EUR",
      ES: "EUR",
      PT: "EUR",
      NL: "EUR",
      BE: "EUR",
      AT: "EUR",
      IE: "EUR",
      FI: "EUR",

      TH: "THB",
      VN: "VND",
      TW: "TWD",
      SG: "SGD",

      AU: "AUD",
      NZ: "NZD",

      CA: "CAD",
      CH: "CHF",

      HK: "HKD",

      PH: "PHP",
      ID: "IDR",
      MY: "MYR",
    };

    return currencyMap[countryCode] || "";
  };

  // ====================
  // Back
  // ====================

  const handleBack = () => {
    if (destinationFromMap && step === 2) {
      navigate(-1);

      return;
    }

    if (step === 2) {
      setStep(1);

      setSelectedDestination(null);

      setStartDate(null);

      setEndDate(null);

      return;
    }

    navigate(-1);
  };

  // ====================
  // Close
  // ====================

  const handleClose = () => {
    navigate("/home");
  };

  // ====================
  // Create Trip
  //
  // 대표 이미지 API는
  // 여기서만 호출
  // ====================

  const handleCreateTrip = async () => {
    if (isCreating) {
      return;
    }

    if (!selectedDestination) {
      return;
    }

    if (!startDate || !endDate) {
      return;
    }

    if (!currentUser) {
      navigate("/login");

      return;
    }

    setIsCreating(true);

    try {
      // ====================
      // Google 대표 이미지
      //
      // 검색에서 받은 Place ID를
      // 그대로 사용
      // ====================

      let googleImage = null;

      try {
        googleImage = await getGooglePlaceImage({
          placeId:
            selectedDestination.googlePlaceId || selectedDestination.id || "",

          name: selectedDestination.name,

          country: selectedDestination.country,
        });
      } catch (error) {
        console.error("대표 이미지 조회 오류:", error);
      }

      // ====================
      // Trip
      // ====================

      const destinationName = selectedDestination.name;

      const trip = {
        id: crypto.randomUUID(),

        userId: currentUser.id,

        title: `${destinationName} 여행`,

        destinationName,

        destinationType: selectedDestination.type,

        country: selectedDestination.country,

        countryCode: selectedDestination.countryCode,

        city:
          selectedDestination.type === "city" ? selectedDestination.name : "",

        lat: selectedDestination.lat,

        lng: selectedDestination.lng,

        startDate: formatDate(startDate),

        endDate: formatDate(endDate),

        currency: getCurrencyByCountryCode(selectedDestination.countryCode),

        budget: null,

        // ====================
        // Google
        // ====================

        googlePlaceId:
          googleImage?.googlePlaceId ||
          selectedDestination.googlePlaceId ||
          selectedDestination.id ||
          "",

        imageUrl: googleImage?.imageUrl || "",

        imageAuthorName: googleImage?.imageAuthorName || "",

        imageAuthorUrl: googleImage?.imageAuthorUrl || "",

        memo: "",

        sourcePlaceId: sourcePlace?.id || null,
      };

      // ====================
      // Save
      // ====================

      saveTrip(trip);

      navigate("/home");
    } catch (error) {
      console.error("여행 생성 오류:", error);

      alert("여행을 만들지 못했습니다.");
    } finally {
      setIsCreating(false);
    }
  };

  // ====================
  // Visible Results
  // ====================

  const visibleResults = showAllResults
    ? searchResults
    : searchResults.slice(0, 6);

  // ====================
  // Render
  // ====================

  return (
    <main className="min-h-dvh bg-white text-[#191919]">
      <div className="mx-auto min-h-dvh w-full max-w-[390px]">
        {/* ====================
            Header
        ==================== */}

        <Header showBack showClose onBack={handleBack} onClose={handleClose} />

        <div className="min-h-dvh pt-[calc(60px+env(safe-area-inset-top))]">
          {/* ====================
              STEP 1
              여행지
          ==================== */}

          {step === 1 && (
            <section className="px-5 pt-[36px] pb-[30px]">
              {/* ====================
                  Title
              ==================== */}

              <h1
                className="
                  text-[28px]
                  font-bold
                  leading-[36px]
                  tracking-[-0.02em]
                "
              >
                어디로 여행을 떠나시나요?
              </h1>

              <p
                className="
                  mt-[14px]
                  text-[14px]
                  leading-[22px]
                  text-[#777777]
                "
              >
                여행할 도시 또는 국가를 검색해주세요.
              </p>

              {/* ====================
                  Search
              ==================== */}

              <div className="mt-[22px]">
                <SearchInput
                  value={keyword}
                  onChange={handleKeywordChange}
                  onSubmit={handleSearch}
                  placeholder="도시 또는 국가를 검색하세요"
                />
              </div>

              {/* ====================
                  Loading
              ==================== */}

              {isSearching && (
                <div
                  className="
                    flex
                    min-h-[120px]
                    items-center
                    justify-center
                  "
                >
                  <p className="text-[13px] text-[#888888]">검색 중...</p>
                </div>
              )}

              {/* ====================
                  No Result
              ==================== */}

              {!isSearching && hasSearched && searchResults.length === 0 && (
                <div
                  className="
                      flex
                      min-h-[160px]
                      flex-col
                      items-center
                      justify-center
                      text-center
                    "
                >
                  <MapPin
                    size={26}
                    strokeWidth={1.5}
                    className="text-[#BBBBBB]"
                  />

                  <p
                    className="
                        mt-[10px]
                        text-[14px]
                        font-semibold
                        text-[#555555]
                      "
                  >
                    검색 결과가 없습니다.
                  </p>

                  <p
                    className="
                        mt-[4px]
                        text-[12px]
                        text-[#999999]
                      "
                  >
                    다른 도시 또는 국가를 검색해보세요.
                  </p>
                </div>
              )}

              {/* ====================
                  Results
              ==================== */}

              {!isSearching && searchResults.length > 0 && (
                <div className="mt-[4px]">
                  {visibleResults.map((destination) => (
                    <button
                      key={destination.id}
                      type="button"
                      onClick={() => handleDestinationSelect(destination)}
                      className="
                            click-scale
                            flex
                            min-h-[56px]
                            w-full
                            items-center
                            gap-[12px]
                            border-b
                            border-[#E5E5E5]
                            text-left
                          "
                    >
                      <MapPin
                        size={20}
                        strokeWidth={1.5}
                        className="
                              shrink-0
                              text-[#191919]
                            "
                      />

                      <div className="min-w-0 flex-1">
                        <p
                          className="
                                truncate
                                text-[14px]
                                font-semibold
                                leading-[20px]
                              "
                        >
                          {destination.name}
                        </p>

                        <p
                          className="
                                mt-[2px]
                                truncate
                                text-[11px]
                                leading-[16px]
                                text-[#777777]
                              "
                        >
                          {destination.type === "country"
                            ? "국가"
                            : [destination.country, destination.admin1]
                                .filter(Boolean)
                                .join(" · ")}
                        </p>
                      </div>
                    </button>
                  ))}

                  {/* ====================
                        More
                    ==================== */}

                  {searchResults.length > 6 && (
                    <button
                      type="button"
                      onClick={() => setShowAllResults((prev) => !prev)}
                      className="
                          click-scale-sm
                          mx-auto
                          flex
                          h-[38px]
                          items-center
                          justify-center
                          gap-[3px]
                          px-[12px]
                          text-[11px]
                          text-[#555555]
                        "
                    >
                      {showAllResults ? "접기" : "더보기"}

                      <ChevronDown
                        size={13}
                        strokeWidth={1.5}
                        className={`
                            transition-transform
                            duration-200

                            ${showAllResults ? "rotate-180" : ""}
                          `}
                      />
                    </button>
                  )}
                </div>
              )}
            </section>
          )}

          {/* ====================
              STEP 2
              날짜
          ==================== */}

          {step === 2 && (
            <section
              className="
                flex
                min-h-[calc(100dvh-60px-env(safe-area-inset-top))]
                flex-col
                px-5
                pt-[36px]
                pb-[calc(20px+env(safe-area-inset-bottom))]
              "
            >
              {/* ====================
                  Title
              ==================== */}

              <h1
                className="
                  text-[28px]
                  font-bold
                  leading-[36px]
                  tracking-[-0.02em]
                "
              >
                여행 기간을 선택해주세요.
              </h1>

              {/* ====================
                  Destination
              ==================== */}

              {selectedDestination && (
                <div
                  className="
                    mt-[18px]
                    flex
                    items-center
                    gap-[8px]
                    text-[14px]
                    text-[#555555]
                  "
                >
                  <MapPin size={16} strokeWidth={1.5} />

                  <span>{selectedDestination.name}</span>

                  {selectedDestination.type === "city" &&
                    selectedDestination.country && (
                      <span className="text-[#999999]">
                        · {selectedDestination.country}
                      </span>
                    )}
                </div>
              )}

              {/* ====================
                  Calendar
              ==================== */}

              <div className="mt-[28px]">
                <Calendar
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                />
              </div>

              {/* ====================
                  Create
              ==================== */}

              <button
                type="button"
                disabled={!startDate || !endDate || isCreating}
                onClick={handleCreateTrip}
                className={`
                  mt-auto
                  flex
                  h-[52px]
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  text-[16px]
                  font-semibold
                  text-white

                  ${
                    startDate && endDate && !isCreating
                      ? "click-scale bg-[#3478F6]"
                      : "cursor-default bg-[#AFCBFF]"
                  }
                `}
              >
                {isCreating ? "여행 만드는 중..." : "여행 만들기"}
              </button>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
