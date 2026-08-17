import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { LocateFixed } from "lucide-react";

import {
  AdvancedMarker,
  Map as GoogleMap,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

import BottomNav from "../../components/common/BottomNav";

import MapHeader from "../../components/map/MapHeader";
import PlaceCard from "../../components/map/PlaceCard";
import TripSelectModal from "../../components/map/TripSelectModal";

import AccommodationPeriodModal from "../../components/trip/schedule/AccommodationPeriodModal";

import {
  getCurrentUser,
  getSchedulesByTripId,
  getTripById,
  getTripsByUserId,
  saveAccommodation,
  saveFavoritePlace,
  saveSchedule,
} from "../../lib/storage";

const DEFAULT_CENTER = {
  lat: 37.5665,
  lng: 126.978,
};

function MapContent() {
  const navigate = useNavigate();

  const location = useLocation();

  const map = useMap();

  const places = useMapsLibrary("places");

  const currentUser = getCurrentUser();

  // ====================
  // Context
  // ====================

  const mode = location.state?.mode || null;

  const targetTripId = location.state?.tripId || null;

  const targetDate = location.state?.date || null;

  const targetTrip = targetTripId ? getTripById(targetTripId) : null;

  const trips = currentUser ? getTripsByUserId(currentUser.id) : [];

  // ====================
  // State
  // ====================

  const [isSearchMode, setIsSearchMode] = useState(false);

  const [keyword, setKeyword] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const [selectedPlace, setSelectedPlace] = useState(null);

  const [sessionToken, setSessionToken] = useState(null);

  const [currentPosition, setCurrentPosition] = useState(null);

  const [isLocating, setIsLocating] = useState(false);

  const [placeCardHeight, setPlaceCardHeight] = useState(0);

  const [isTripSelectModalOpen, setIsTripSelectModalOpen] = useState(false);

  const [isAccommodationPeriodOpen, setIsAccommodationPeriodOpen] =
    useState(false);

  // ====================
  // Current Location
  // ====================

  const moveToCurrentLocation = () => {
    if (!map) {
      return;
    }

    if (!navigator.geolocation) {
      alert("현재 위치 기능을 지원하지 않는 브라우저입니다.");

      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,

          lng: position.coords.longitude,
        };

        setCurrentPosition(location);

        map.panTo(location);

        map.setZoom(15);

        setIsLocating(false);
      },

      (error) => {
        console.error("현재 위치 조회 오류:", error);

        setIsLocating(false);
      },

      {
        enableHighAccuracy: true,

        timeout: 10000,

        maximumAge: 60000,
      },
    );
  };

  useEffect(() => {
    if (!map) {
      return;
    }

    moveToCurrentLocation();
  }, [map]);

  const handleCurrentLocation = () => {
    if (isLocating) {
      return;
    }

    moveToCurrentLocation();
  };

  // ====================
  // Navigation
  // ====================

  const handleBack = () => {
    navigate(-1);
  };

  // ====================
  // Search
  // ====================

  const handleSearchOpen = () => {
    setIsSearchMode(true);
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;

    setKeyword(value);

    const searchKeyword = value.trim();

    if (!searchKeyword) {
      setSearchResults([]);

      return;
    }

    if (!places) {
      return;
    }

    try {
      const token = sessionToken || new places.AutocompleteSessionToken();

      if (!sessionToken) {
        setSessionToken(token);
      }

      const { suggestions } =
        await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: searchKeyword,

          sessionToken: token,

          language: "ko",
        });

      setSearchResults(
        suggestions
          .map((suggestion) => suggestion.placePrediction)
          .filter(Boolean)
          .slice(0, 5),
      );
    } catch (error) {
      console.error("장소 자동완성 오류:", error);

      setSearchResults([]);
    }
  };

  const handleSearchClose = () => {
    setKeyword("");

    setSearchResults([]);

    setSelectedPlace(null);

    setSessionToken(null);

    setPlaceCardHeight(0);

    setIsSearchMode(false);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (searchResults.length === 0) {
      return;
    }

    await handlePlaceSelect(searchResults[0]);
  };

  // ====================
  // Place Data
  // ====================

  const getPlacePhoto = (place) => {
    const photo = place.photos?.[0];

    if (!photo) {
      return null;
    }

    try {
      return photo.getURI({
        maxWidth: 500,
        maxHeight: 500,
      });
    } catch {
      return null;
    }
  };

  const getOpeningHours = (place) => {
    const openingHours = place.regularOpeningHours;

    if (!openingHours) {
      return "영업시간 정보 없음";
    }

    return openingHours.weekdayDescriptions?.[0] || "영업시간 정보 있음";
  };

  const createPlaceData = (place) => {
    const country = place.addressComponents?.find((component) =>
      component.types.includes("country"),
    );

    const locality = place.addressComponents?.find((component) =>
      component.types.includes("locality"),
    );

    const admin = place.addressComponents?.find(
      (component) =>
        component.types.includes("administrative_area_level_1") ||
        component.types.includes("administrative_area_level_2"),
    );

    return {
      id: place.id,

      name: place.displayName || "",

      category: place.primaryTypeDisplayName || "장소",

      address: place.formattedAddress || "",

      country: country?.longText || "",

      countryCode: country?.shortText || "",

      city: locality?.longText || admin?.longText || "",

      lat: place.location?.lat() ?? null,

      lng: place.location?.lng() ?? null,

      rating: place.rating ?? null,

      openingHours: getOpeningHours(place),

      url: place.websiteURI || "",

      phone: place.nationalPhoneNumber || "",

      imageUrl: getPlacePhoto(place),
    };
  };

  const fetchPlaceDetails = async (place) => {
    await place.fetchFields({
      fields: [
        "displayName",
        "formattedAddress",
        "location",
        "addressComponents",
        "primaryTypeDisplayName",
        "rating",
        "regularOpeningHours",
        "websiteURI",
        "nationalPhoneNumber",
        "photos",
      ],
    });

    return createPlaceData(place);
  };

  const showPlace = (placeData) => {
    setSelectedPlace(placeData);

    setKeyword(placeData.name);

    setSearchResults([]);

    setSessionToken(null);

    if (map && placeData.lat !== null && placeData.lng !== null) {
      map.panTo({
        lat: placeData.lat,

        lng: placeData.lng,
      });

      map.setZoom(16);
    }
  };

  const handlePlaceSelect = async (prediction) => {
    if (!places) {
      return;
    }

    try {
      const place = prediction.toPlace();

      const data = await fetchPlaceDetails(place);

      showPlace(data);
    } catch (error) {
      console.error("장소 상세 오류:", error);
    }
  };

  // ====================
  // Map POI
  // ====================

  const handleMapClick = async (event) => {
    if (event.stoppable) {
      event.stop();
    }

    const placeId = event.detail?.placeId;

    if (!placeId || !places) {
      return;
    }

    try {
      const place = new places.Place({
        id: placeId,

        requestedLanguage: "ko",
      });

      const data = await fetchPlaceDetails(place);

      showPlace(data);
    } catch (error) {
      console.error("지도 장소 오류:", error);
    }
  };

  // ====================
  // Favorite
  // ====================

  const createFavoritePlace = (tripId) => ({
    id: crypto.randomUUID(),

    tripId,

    placeId: selectedPlace.id,

    name: selectedPlace.name,

    category: selectedPlace.category,

    address: selectedPlace.address,

    country: selectedPlace.country,

    countryCode: selectedPlace.countryCode,

    city: selectedPlace.city,

    lat: selectedPlace.lat,

    lng: selectedPlace.lng,

    rating: selectedPlace.rating,

    imageUrl: selectedPlace.imageUrl,
  });

  const handleFavoriteAdd = () => {
    if (!selectedPlace) {
      return;
    }

    if (mode === "favorite" && targetTripId) {
      const saved = saveFavoritePlace(createFavoritePlace(targetTripId));

      if (!saved) {
        alert("이미 관심 장소에 추가된 장소입니다.");

        return;
      }

      navigate(-1);

      return;
    }

    setIsTripSelectModalOpen(true);
  };

  const handleTripSelect = (tripId) => {
    const saved = saveFavoritePlace(createFavoritePlace(tripId));

    if (!saved) {
      alert("이미 관심 장소에 추가된 장소입니다.");

      return;
    }

    setIsTripSelectModalOpen(false);

    navigate(`/trip/${tripId}`);
  };

  // ====================
  // Schedule
  // ====================

  const handleScheduleAdd = () => {
    if (!selectedPlace || mode !== "schedule" || !targetTripId || !targetDate) {
      return;
    }

    const schedules = getSchedulesByTripId(targetTripId);

    const sameDate = schedules.filter(
      (schedule) => schedule.date === targetDate,
    );

    const nextOrder =
      sameDate.length > 0
        ? Math.max(...sameDate.map((schedule) => schedule.order ?? 0)) + 1
        : 0;

    saveSchedule({
      id: crypto.randomUUID(),

      tripId: targetTripId,

      date: targetDate,

      placeId: selectedPlace.id,

      name: selectedPlace.name,

      category: selectedPlace.category,

      address: selectedPlace.address,

      country: selectedPlace.country,

      countryCode: selectedPlace.countryCode,

      city: selectedPlace.city,

      lat: selectedPlace.lat,

      lng: selectedPlace.lng,

      rating: selectedPlace.rating,

      imageUrl: selectedPlace.imageUrl,

      startTime: null,

      endTime: null,

      memo: "",

      order: nextOrder,
    });

    navigate(`/trip/${targetTripId}`, {
      state: {
        tab: "schedule",

        date: targetDate,
      },
    });
  };

  // ====================
  // Accommodation
  // ====================

  const handleAccommodationAdd = () => {
    if (
      !selectedPlace ||
      mode !== "accommodation" ||
      !targetTripId ||
      !targetTrip
    ) {
      return;
    }

    setIsAccommodationPeriodOpen(true);
  };

  const handleAccommodationSave = (period) => {
    if (!selectedPlace || !targetTripId) {
      return;
    }

    const saved = saveAccommodation({
      id: crypto.randomUUID(),

      tripId: targetTripId,

      placeId: selectedPlace.id,

      name: selectedPlace.name,

      category: selectedPlace.category,

      address: selectedPlace.address,

      country: selectedPlace.country,

      countryCode: selectedPlace.countryCode,

      city: selectedPlace.city,

      lat: selectedPlace.lat,

      lng: selectedPlace.lng,

      imageUrl: selectedPlace.imageUrl,

      checkInDate: period.checkInDate,

      checkInTime: period.checkInTime,

      checkOutDate: period.checkOutDate,

      checkOutTime: period.checkOutTime,
    });

    if (!saved) {
      alert("해당 기간에는 숙소를 최대 2개까지 지정할 수 있어요.");

      return;
    }

    setIsAccommodationPeriodOpen(false);

    navigate(`/trip/${targetTripId}`, {
      state: {
        tab: "schedule",

        date: targetDate,
      },
    });
  };

  // ====================
  // Trip Create
  // ====================

  const handleCreateTrip = () => {
    if (!selectedPlace) {
      return;
    }

    navigate("/trip-create", {
      state: {
        destination: {
          placeId: selectedPlace.id,

          country: selectedPlace.country,

          countryCode: selectedPlace.countryCode,

          city: selectedPlace.city,

          address: selectedPlace.address,

          lat: selectedPlace.lat,

          lng: selectedPlace.lng,
        },

        sourcePlace: selectedPlace,
      },
    });
  };

  const currentLocationBottom = selectedPlace
    ? 100 + placeCardHeight + 12
    : 110;

  return (
    <>
      <GoogleMap
        mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={13}
        gestureHandling="greedy"
        disableDefaultUI
        className="h-full w-full"
        onClick={handleMapClick}
      >
        {currentPosition && (
          <AdvancedMarker position={currentPosition}>
            <div className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-white">
              <div className="h-[12px] w-[12px] rounded-full bg-[#3478F6]" />
            </div>
          </AdvancedMarker>
        )}

        {selectedPlace &&
          selectedPlace.lat !== null &&
          selectedPlace.lng !== null && (
            <AdvancedMarker
              position={{
                lat: selectedPlace.lat,

                lng: selectedPlace.lng,
              }}
            />
          )}
      </GoogleMap>

      <MapHeader
        isSearchMode={isSearchMode}
        keyword={keyword}
        searchResults={searchResults}
        onBack={handleBack}
        onSearchOpen={handleSearchOpen}
        onSearchChange={handleSearchChange}
        onSearchClose={handleSearchClose}
        onSearchSubmit={handleSearchSubmit}
        onPlaceSelect={handlePlaceSelect}
      />

      <button
        type="button"
        onClick={handleCurrentLocation}
        disabled={isLocating}
        className="
          click-scale-sm
          absolute
          left-5
          z-30
          flex
          h-[44px]
          w-[44px]
          items-center
          justify-center
          rounded-full
          border
          border-[#D9D9D9]
          bg-white
        "
        style={{
          bottom: `${currentLocationBottom}px`,
        }}
      >
        <LocateFixed size={22} strokeWidth={1.5} />
      </button>

      {selectedPlace && (
        <PlaceCard
          place={selectedPlace}
          mode={mode}
          onFavoriteAdd={handleFavoriteAdd}
          onScheduleAdd={handleScheduleAdd}
          onAccommodationAdd={handleAccommodationAdd}
          onCreateTrip={handleCreateTrip}
          onHeightChange={setPlaceCardHeight}
        />
      )}

      <BottomNav />

      <TripSelectModal
        isOpen={isTripSelectModalOpen}
        trips={trips}
        onClose={() => setIsTripSelectModalOpen(false)}
        onSelect={handleTripSelect}
        onCreateTrip={handleCreateTrip}
      />

      {targetTrip && (
        <AccommodationPeriodModal
          isOpen={isAccommodationPeriodOpen}
          place={selectedPlace}
          trip={targetTrip}
          initialDate={targetDate}
          onClose={() => setIsAccommodationPeriodOpen(false)}
          onSave={handleAccommodationSave}
        />
      )}
    </>
  );
}

export default function Map() {
  return (
    <main className="relative h-dvh overflow-hidden bg-white text-[#191919]">
      <div className="relative mx-auto h-dvh w-full max-w-[390px] overflow-hidden">
        <MapContent />
      </div>
    </main>
  );
}
