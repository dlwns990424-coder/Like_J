import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";

import Header from "../../components/common/Header";
import SearchInput from "../../components/common/SearchInput";
import Calendar from "../../components/trip/common/Calendar";

import { getCurrentUser, saveTrip } from "../../lib/storage";

export default function TripCreate() {
  const navigate = useNavigate();
  const places = useMapsLibrary("places");

  const currentUser = getCurrentUser();

  const [step, setStep] = useState(1);

  const [searchMode, setSearchMode] = useState("destination");

  const [keyword, setKeyword] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const [sessionToken, setSessionToken] = useState(null);

  const [selectedCountry, setSelectedCountry] = useState(null);

  const [selectedCity, setSelectedCity] = useState(null);

  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  // ====================
  // 여행지 검색
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

      if (searchMode === "city" && selectedCountry) {
        request.includedPrimaryTypes = ["(cities)"];

        request.includedRegionCodes = [
          selectedCountry.countryCode.toLowerCase(),
        ];
      }

      const { suggestions } =
        await places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
          request,
        );

      const predictions = suggestions
        .map((suggestion) => suggestion.placePrediction)
        .filter(Boolean);

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

      setSearchResults(predictions);
    } catch (error) {
      console.error("여행지 검색 오류:", error);

      alert("여행지 검색 중 오류가 발생했습니다.");
    }
  };

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setSearchResults([]);
  };

  // ====================
  // 여행지 선택
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
        ],
      });

      const countryComponent = place.addressComponents?.find((component) =>
        component.types.includes("country"),
      );

      const isCountry = prediction.types?.includes("country");

      if (searchMode === "destination" && isCountry) {
        const country = {
          placeId: place.id,

          country: countryComponent?.longText || place.displayName || "",

          countryCode: countryComponent?.shortText || "",

          address: place.formattedAddress || "",

          lat: place.location?.lat() ?? null,

          lng: place.location?.lng() ?? null,
        };

        setSelectedCountry(country);

        setSearchMode("city");

        setKeyword("");
        setSearchResults([]);

        return;
      }

      const localityComponent = place.addressComponents?.find((component) =>
        component.types.includes("locality"),
      );

      const adminAreaComponent = place.addressComponents?.find(
        (component) =>
          component.types.includes("administrative_area_level_1") ||
          component.types.includes("administrative_area_level_2"),
      );

      const city = {
        placeId: place.id,

        city:
          localityComponent?.longText ||
          adminAreaComponent?.longText ||
          place.displayName ||
          "",

        country: countryComponent?.longText || selectedCountry?.country || "",

        countryCode:
          countryComponent?.shortText || selectedCountry?.countryCode || "",

        address: place.formattedAddress || "",

        lat: place.location?.lat() ?? null,

        lng: place.location?.lng() ?? null,
      };

      setSelectedCity(city);

      setSessionToken(null);

      setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));

      setStartDate(null);
      setEndDate(null);

      setStep(2);
    } catch (error) {
      console.error("여행지 상세정보 오류:", error);

      alert("여행지 정보를 불러오지 못했습니다.");
    }
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
  // 날짜
  // ====================

  const formatDate = (date) => {
    if (!date) return "";

    const y = date.getFullYear();

    const m = String(date.getMonth() + 1).padStart(2, "0");

    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  // ====================
  // Navigation
  // ====================

  const handleBack = () => {
    if (step === 2) {
      setStep(1);

      if (selectedCountry) {
        setSearchMode("city");
      } else {
        setSearchMode("destination");
      }

      setKeyword("");
      setSearchResults([]);

      return;
    }

    if (searchMode === "city") {
      setSelectedCountry(null);

      setSearchMode("destination");

      setKeyword("");
      setSearchResults([]);

      return;
    }

    navigate(-1);
  };

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

    const trip = {
      id: crypto.randomUUID(),

      userId: currentUser.id,

      title: `${selectedCity.city} 여행`,

      country: selectedCity.country,

      city: selectedCity.city,

      startDate: formatDate(startDate),

      endDate: formatDate(endDate),

      currency: getCurrencyByCountryCode(selectedCity.countryCode),

      budget: null,

      imageUrl: "",

      memo: "",
    };

    saveTrip(trip);

    navigate("/home");
  };

  return (
    <main className="min-h-dvh bg-white text-[#191919]">
      <div className="mx-auto min-h-dvh w-full max-w-[390px]">
        <Header showBack showClose onBack={handleBack} onClose={handleClose} />

        <div className="min-h-dvh pt-[calc(60px+env(safe-area-inset-top))]">
          {step === 1 && (
            <section className="px-5 pt-[36px] pb-[calc(20px+env(safe-area-inset-bottom))]">
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

              {searchResults.length > 0 && (
                <div className="mt-[20px]">
                  {searchResults.map((prediction) => (
                    <button
                      key={prediction.placeId}
                      type="button"
                      onClick={() => handlePlaceSelect(prediction)}
                      className="flex w-full items-center gap-[16px] border-b border-[#D9D9D9] py-[14px] text-left"
                    >
                      <MapPin
                        size={22}
                        strokeWidth={1.5}
                        className="shrink-0"
                      />

                      <div>
                        <p className="text-[16px] leading-[24px]">
                          {prediction.mainText?.toString() ||
                            prediction.text?.toString()}
                        </p>

                        {prediction.secondaryText && (
                          <p className="mt-[2px] text-[12px] leading-[18px] text-[#888888]">
                            {prediction.secondaryText.toString()}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {step === 2 && (
            <section className="flex min-h-[calc(100dvh-60px-env(safe-area-inset-top))] flex-col px-5 pt-[36px] pb-[calc(20px+env(safe-area-inset-bottom))]">
              <h1 className="text-[28px] font-bold leading-[36px] tracking-[-0.02em]">
                여행 기간을 선택해주세요.
              </h1>

              <div className="mt-[24px] rounded-xl bg-[#F5F5F5] p-[10px]">
                <p className="text-[16px] font-semibold leading-[24px]">
                  {selectedCity?.city}
                </p>

                <p className="mt-[2px] text-[12px] leading-[18px] text-[#888888]">
                  {selectedCity?.country}
                </p>
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
                className="mt-auto flex h-[52px] w-full shrink-0 items-center justify-center rounded-xl bg-[#3478F6] text-[16px] font-semibold leading-[24px] text-white"
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
