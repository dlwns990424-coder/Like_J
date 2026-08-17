import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";

import Header from "../../components/common/Header";
import SearchInput from "../../components/common/SearchInput";
import Calendar from "../../components/trip/common/Calendar";
import SelectCard from "../../components/trip/create/SelectCard";

import { getCurrentUser, saveTrip } from "../../lib/storage";

export default function TripCreate() {
  const navigate = useNavigate();
  const location = useLocation();

  const places = useMapsLibrary("places");

  const currentUser = getCurrentUser();

  // ====================
  // Map에서 넘어온 여행지
  // ====================

  const destinationFromMap = location.state?.destination || null;

  const sourcePlace = location.state?.sourcePlace || null;

  // ====================
  // Step
  //
  // 1 = 여행지
  // 2 = 날짜
  // ====================

  const [step, setStep] = useState(destinationFromMap ? 2 : 1);

  // ====================
  // Search Mode
  //
  // destination = 국가
  // city = 도시
  // ====================

  const [searchMode, setSearchMode] = useState("destination");

  const [keyword, setKeyword] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const [sessionToken, setSessionToken] = useState(null);

  // ====================
  // 국가
  // ====================

  const [selectedCountry, setSelectedCountry] = useState(
    destinationFromMap
      ? {
          placeId: destinationFromMap.placeId,
          country: destinationFromMap.country,
          countryCode: destinationFromMap.countryCode,
          address: destinationFromMap.address,
          lat: destinationFromMap.lat,
          lng: destinationFromMap.lng,
          imageUrl: null,
        }
      : null,
  );

  // ====================
  // 도시
  // ====================

  const [selectedCity, setSelectedCity] = useState(
    destinationFromMap
      ? {
          placeId: destinationFromMap.placeId,
          city: destinationFromMap.city,
          country: destinationFromMap.country,
          countryCode: destinationFromMap.countryCode,
          address: destinationFromMap.address,
          lat: destinationFromMap.lat,
          lng: destinationFromMap.lng,
          imageUrl: null,
        }
      : null,
  );

  // ====================
  // 날짜
  // ====================

  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  // ====================
  // Google Place Photo
  // ====================

  const getPlacePhoto = (place) => {
    const photo = place.photos?.[0];

    if (!photo) {
      return null;
    }

    try {
      return photo.getURI({
        maxWidth: 900,
        maxHeight: 700,
      });
    } catch (error) {
      console.error("장소 이미지 오류:", error);

      return null;
    }
  };

  // ====================
  // 검색
  // ====================

  const handleSearch = async (e) => {
    e.preventDefault();

    const searchKeyword = keyword.trim();

    if (!searchKeyword) {
      setSearchResults([]);
      return;
    }

    if (!places) {
      alert("Google 장소 검색을 불러오는 중입니다.");
      return;
    }

    try {
      const token = sessionToken || new places.AutocompleteSessionToken();

      setSessionToken(token);

      const request = {
        input: searchKeyword,
        sessionToken: token,
        language: "ko",
      };

      // 도시 검색
      if (searchMode === "city" && selectedCountry) {
        request.includedPrimaryTypes = ["(cities)"];

        if (selectedCountry.countryCode) {
          request.includedRegionCodes = [
            selectedCountry.countryCode.toLowerCase(),
          ];
        }
      }

      const { suggestions } =
        await places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
          request,
        );

      const predictions = suggestions
        .map((suggestion) => suggestion.placePrediction)
        .filter(Boolean);

      // 국가 검색
      if (searchMode === "destination") {
        const destinationResults = predictions.filter((prediction) =>
          prediction.types?.some((type) =>
            [
              "country",
              "locality",
              "administrative_area_level_1",
              "administrative_area_level_2",
            ].includes(type),
          ),
        );

        setSearchResults(destinationResults);

        return;
      }

      // 도시 검색
      setSearchResults(predictions);
    } catch (error) {
      console.error("여행지 검색 오류:", error);

      alert("여행지 검색 중 오류가 발생했습니다.");
    }
  };

  // ====================
  // 검색어 변경
  // ====================

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);

    setSearchResults([]);

    // 국가를 다시 검색하면 기존 선택 해제
    if (searchMode === "destination") {
      setSelectedCountry(null);
      setSelectedCity(null);
    }

    // 도시를 다시 검색하면 도시만 해제
    if (searchMode === "city") {
      setSelectedCity(null);
    }
  };

  // ====================
  // 장소 선택
  // ====================

  const handlePlaceSelect = async (prediction) => {
    if (!places) return;

    try {
      const place = prediction.toPlace();

      await place.fetchFields({
        fields: [
          "displayName",
          "formattedAddress",
          "location",
          "addressComponents",
          "photos",
        ],
      });

      const countryComponent = place.addressComponents?.find((component) =>
        component.types.includes("country"),
      );

      const localityComponent = place.addressComponents?.find((component) =>
        component.types.includes("locality"),
      );

      const adminAreaComponent = place.addressComponents?.find(
        (component) =>
          component.types.includes("administrative_area_level_1") ||
          component.types.includes("administrative_area_level_2"),
      );

      const imageUrl = getPlacePhoto(place);

      // ====================
      // 국가 선택
      // ====================

      if (searchMode === "destination") {
        const country = {
          placeId: place.id,

          country:
            countryComponent?.longText ||
            place.displayName ||
            prediction.mainText?.toString() ||
            "",

          countryCode: countryComponent?.shortText || "",

          address: place.formattedAddress || "",

          lat: place.location?.lat() ?? null,

          lng: place.location?.lng() ?? null,

          imageUrl,
        };

        setSelectedCountry(country);

        setSelectedCity(null);

        setKeyword("");

        setSearchResults([]);

        setSessionToken(null);

        return;
      }

      // ====================
      // 도시 선택
      // ====================

      const city = {
        placeId: place.id,

        city:
          localityComponent?.longText ||
          adminAreaComponent?.longText ||
          place.displayName ||
          prediction.mainText?.toString() ||
          "",

        country: countryComponent?.longText || selectedCountry?.country || "",

        countryCode:
          countryComponent?.shortText || selectedCountry?.countryCode || "",

        address: place.formattedAddress || "",

        lat: place.location?.lat() ?? null,

        lng: place.location?.lng() ?? null,

        imageUrl,
      };

      setSelectedCity(city);

      setKeyword("");

      setSearchResults([]);

      setSessionToken(null);
    } catch (error) {
      console.error("여행지 상세정보 오류:", error);

      alert("여행지 정보를 불러오지 못했습니다.");
    }
  };

  // ====================
  // 국가 선택 취소
  // ====================

  const handleRemoveCountry = () => {
    setSelectedCountry(null);

    setSelectedCity(null);

    setKeyword("");

    setSearchResults([]);

    setSessionToken(null);
  };

  // ====================
  // 도시 선택 취소
  // ====================

  const handleRemoveCity = () => {
    setSelectedCity(null);

    setKeyword("");

    setSearchResults([]);

    setSessionToken(null);
  };

  // ====================
  // 국가 계속
  // ====================

  const handleCountryContinue = () => {
    if (!selectedCountry) return;

    setSearchMode("city");

    setKeyword("");

    setSearchResults([]);

    setSelectedCity(null);

    setSessionToken(null);
  };

  // ====================
  // 도시 계속
  // ====================

  const handleCityContinue = () => {
    if (!selectedCity) return;

    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));

    setStartDate(null);
    setEndDate(null);

    setStep(2);
  };

  // ====================
  // 도시 건너뛰기
  // ====================

  const handleSkipCity = () => {
    if (!selectedCountry) return;

    setSelectedCity({
      placeId: selectedCountry.placeId,

      city: "",

      country: selectedCountry.country,

      countryCode: selectedCountry.countryCode,

      address: selectedCountry.address,

      lat: selectedCountry.lat,

      lng: selectedCountry.lng,

      imageUrl: selectedCountry.imageUrl,
    });

    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));

    setStartDate(null);
    setEndDate(null);

    setStep(2);
  };

  // ====================
  // 통화
  // ====================

  const getCurrencyByCountryCode = (countryCode) => {
    const currencyMap = {
      KR: "KRW",
      JP: "JPY",
      US: "USD",

      FR: "EUR",
      IT: "EUR",
      DE: "EUR",
      ES: "EUR",
      PT: "EUR",
      NL: "EUR",
      BE: "EUR",
    };

    return currencyMap[countryCode] || "";
  };

  // ====================
  // 날짜 포맷
  // ====================

  const formatDate = (date) => {
    if (!date) return "";

    const y = date.getFullYear();

    const m = String(date.getMonth() + 1).padStart(2, "0");

    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  // ====================
  // 뒤로가기
  // ====================

  const handleBack = () => {
    // Map에서 여행 계획 만들기로 들어온 경우
    if (destinationFromMap && step === 2) {
      navigate(-1);
      return;
    }

    // 날짜 → 도시
    if (step === 2) {
      setStep(1);

      setSearchMode("city");

      setKeyword("");

      setSearchResults([]);

      return;
    }

    // 도시 → 국가
    if (searchMode === "city") {
      setSearchMode("destination");

      setSelectedCity(null);

      setKeyword("");

      setSearchResults([]);

      return;
    }

    navigate(-1);
  };

  // ====================
  // 닫기
  // ====================

  const handleClose = () => {
    navigate("/home");
  };

  // ====================
  // 여행 생성
  // ====================

  const handleCreateTrip = () => {
    if (!selectedCity) {
      alert("여행지를 선택해주세요.");
      return;
    }

    if (!startDate || !endDate) {
      alert("여행 기간을 선택해주세요.");
      return;
    }

    if (!currentUser) {
      navigate("/login");
      return;
    }

    const destinationName = selectedCity.city || selectedCity.country;

    const trip = {
      id: crypto.randomUUID(),

      userId: currentUser.id,

      title: `${destinationName} 여행`,

      country: selectedCity.country,

      city: selectedCity.city,

      startDate: formatDate(startDate),

      endDate: formatDate(endDate),

      currency: getCurrencyByCountryCode(selectedCity.countryCode),

      budget: null,

      imageUrl: "",

      memo: "",

      sourcePlaceId: sourcePlace?.id || null,
    };

    saveTrip(trip);

    navigate("/home");
  };

  return (
    <main className="min-h-dvh bg-white text-[#191919]">
      <div className="mx-auto min-h-dvh w-full max-w-[390px]">
        <Header showBack showClose onBack={handleBack} onClose={handleClose} />

        <div className="min-h-dvh pt-[calc(60px+env(safe-area-inset-top))]">
          {/* ====================
              STEP 1
          ==================== */}

          {step === 1 && (
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
              {/* 제목 */}

              {searchMode === "destination" ? (
                <>
                  <h1 className="text-[28px] font-bold leading-[36px] tracking-[-0.02em]">
                    어디로 여행을 떠나시나요?
                  </h1>

                  <p className="mt-[16px] text-[16px] leading-[24px] tracking-[-0.01em] text-[#555555]">
                    여행할 국가 또는 지역을 검색해주세요.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-[28px] font-bold leading-[36px] tracking-[-0.02em]">
                    어느 도시로 여행하시나요?
                  </h1>

                  <p className="mt-[16px] text-[16px] leading-[24px] tracking-[-0.01em] text-[#555555]">
                    {selectedCountry?.country}에서 여행할 도시를 검색해주세요.
                  </p>
                </>
              )}

              {/* 검색 */}

              {!(
                (searchMode === "destination" && selectedCountry) ||
                (searchMode === "city" && selectedCity)
              ) && (
                <div className="mt-[28px]">
                  <SearchInput
                    value={keyword}
                    onChange={handleKeywordChange}
                    onSubmit={handleSearch}
                    placeholder={
                      searchMode === "destination"
                        ? "국가 또는 지역을 검색하세요"
                        : "도시를 검색하세요"
                    }
                  />
                </div>
              )}

              {/* 검색 결과 */}

              {searchResults.length > 0 && (
                <div className="mt-[20px]">
                  {searchResults.map((prediction) => (
                    <button
                      key={prediction.placeId}
                      type="button"
                      onClick={() => handlePlaceSelect(prediction)}
                      className="
                        click-scale
                        flex
                        w-full
                        items-center
                        gap-[16px]
                        border-b
                        border-[#D9D9D9]
                        py-[14px]
                        text-left
                      "
                    >
                      <MapPin
                        size={22}
                        strokeWidth={1.5}
                        className="shrink-0"
                      />

                      <div className="min-w-0">
                        <p className="truncate text-[16px] leading-[24px]">
                          {prediction.mainText?.toString() ||
                            prediction.text?.toString()}
                        </p>

                        {prediction.secondaryText && (
                          <p className="mt-[2px] truncate text-[12px] leading-[18px] text-[#888888]">
                            {prediction.secondaryText.toString()}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* ====================
                  국가 선택 카드
              ==================== */}

              {searchMode === "destination" && selectedCountry && (
                <div className="mt-[28px]">
                  <SelectCard
                    name={selectedCountry.country}
                    imageUrl={selectedCountry.imageUrl}
                    onRemove={handleRemoveCountry}
                  />

                  <button
                    type="button"
                    onClick={handleRemoveCountry}
                    className="
                      click-scale
                      mx-auto
                      mt-[20px]
                      flex
                      items-center
                      justify-center
                      text-[14px]
                      font-semibold
                      leading-[24px]
                      text-[#888888]
                    "
                  >
                    + 다른 곳 선택하기
                  </button>
                </div>
              )}

              {/* ====================
                  도시 선택 카드
              ==================== */}

              {searchMode === "city" && selectedCity && (
                <div className="mt-[28px]">
                  <SelectCard
                    name={selectedCity.city}
                    subName={selectedCity.country}
                    imageUrl={selectedCity.imageUrl}
                    onRemove={handleRemoveCity}
                  />

                  <button
                    type="button"
                    onClick={handleRemoveCity}
                    className="
                      click-scale
                      mx-auto
                      mt-[20px]
                      flex
                      items-center
                      justify-center
                      text-[14px]
                      font-semibold
                      leading-[24px]
                      text-[#888888]
                    "
                  >
                    + 다른 곳 선택하기
                  </button>
                </div>
              )}

              {/* ====================
                  하단 버튼
              ==================== */}

              <div className="mt-auto pt-[32px]">
                {/* 국가 */}

                {searchMode === "destination" && (
                  <button
                    type="button"
                    disabled={!selectedCountry}
                    onClick={handleCountryContinue}
                    className={`
                      flex
                      h-[52px]
                      w-full
                      items-center
                      justify-center
                      rounded-xl
                      text-[16px]
                      font-semibold
                      leading-[24px]
                      text-white

                      ${
                        selectedCountry
                          ? "click-scale bg-[#3478F6]"
                          : "cursor-default bg-[#AFCBFF]"
                      }
                    `}
                  >
                    계속하세요
                  </button>
                )}

                {/* 도시 */}

                {searchMode === "city" && (
                  <>
                    <button
                      type="button"
                      disabled={!selectedCity}
                      onClick={handleCityContinue}
                      className={`
                        flex
                        h-[52px]
                        w-full
                        items-center
                        justify-center
                        rounded-xl
                        text-[16px]
                        font-semibold
                        leading-[24px]
                        text-white

                        ${
                          selectedCity
                            ? "click-scale bg-[#3478F6]"
                            : "cursor-default bg-[#AFCBFF]"
                        }
                      `}
                    >
                      계속하세요
                    </button>

                    <button
                      type="button"
                      onClick={handleSkipCity}
                      className="
                        click-scale
                        mt-[12px]
                        flex
                        h-[40px]
                        w-full
                        items-center
                        justify-center
                        text-[14px]
                        font-semibold
                        leading-[20px]
                        text-[#555555]
                      "
                    >
                      건너뛰기
                    </button>
                  </>
                )}
              </div>
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
              <h1 className="text-[28px] font-bold leading-[36px] tracking-[-0.02em]">
                여행 기간을 선택해주세요.
              </h1>

              <div className="mt-[24px] rounded-xl border border-[#D9D9D9] bg-white p-[10px]">
                <p className="text-[16px] font-semibold leading-[24px]">
                  {selectedCity?.city || selectedCity?.country}
                </p>

                {selectedCity?.city && (
                  <p className="mt-[2px] text-[12px] leading-[18px] text-[#888888]">
                    {selectedCity.country}
                  </p>
                )}
              </div>

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

              <button
                type="button"
                onClick={handleCreateTrip}
                className="
                  click-scale
                  mt-auto
                  flex
                  h-[52px]
                  w-full
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#3478F6]
                  text-[16px]
                  font-semibold
                  leading-[24px]
                  text-white
                "
              >
                여행 만들기
              </button>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
