import { useEffect, useRef, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { LocateFixed } from "lucide-react";

import BottomNav from "../../components/common/BottomNav";

import MapHeader from "../../components/map/MapHeader";
import PlaceCard from "../../components/map/PlaceCard";
import TripSelectModal from "../../components/map/TripSelectModal";
import FavoriteAddSuccessModal from "../../components/map/FavoriteAddSuccessModal";

import AccommodationPeriodModal from "../../components/trip/schedule/AccommodationPeriodModal";

import {
  getGooglePlaceById,
  searchGooglePlaces,
} from "../../api/googlePlaceApi";

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

export default function Map() {
  const navigate = useNavigate();

  const location = useLocation();

  // ====================
  // Google Map
  // ====================

  const mapContainerRef = useRef(null);

  const mapRef = useRef(null);

  const selectedMarkerRef = useRef(null);

  const currentLocationMarkerRef = useRef(null);

  const AdvancedMarkerElementRef = useRef(null);

  // ====================
  // 진입 Mode
  // ====================

  const mode = location.state?.mode || null;

  const targetTripId = location.state?.tripId || null;

  const targetDate = location.state?.date || null;

  // ====================
  // User / Trip
  // ====================

  const currentUser = getCurrentUser();

  const targetTrip = targetTripId ? getTripById(targetTripId) : null;

  const trips = currentUser ? getTripsByUserId(currentUser.id) : [];

  // ====================
  // Today
  // ====================

  const getTodayDateString = () => {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = getTodayDateString();

  // ====================
  // 관심장소 추가 가능 여행
  // ====================

  const availableTrips = trips.filter((trip) => {
    if (!trip.endDate) {
      return false;
    }

    return trip.endDate >= today;
  });

  // ====================
  // Search
  // ====================

  const [isSearchMode, setIsSearchMode] = useState(false);

  const [keyword, setKeyword] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const [selectedPlace, setSelectedPlace] = useState(null);

  const [isSearching, setIsSearching] = useState(false);

  // ====================
  // Current Location
  // ====================

  const [currentPosition, setCurrentPosition] = useState(null);

  const [isLocating, setIsLocating] = useState(false);

  // ====================
  // Card Height
  // ====================

  const [placeCardHeight, setPlaceCardHeight] = useState(0);

  // ====================
  // Trip Select
  // ====================

  const [isTripSelectOpen, setIsTripSelectOpen] = useState(false);

  // ====================
  // Favorite Success
  // ====================

  const [isFavoriteSuccessOpen, setIsFavoriteSuccessOpen] = useState(false);

  const [favoriteSuccessTripTitle, setFavoriteSuccessTripTitle] = useState("");

  const [favoriteSuccessPlaceName, setFavoriteSuccessPlaceName] = useState("");

  // ====================
  // Accommodation
  // ====================

  const [isAccommodationPeriodOpen, setIsAccommodationPeriodOpen] =
    useState(false);

  // ====================
  // Google Map Init
  // ====================

  useEffect(() => {
    let isCancelled = false;

    const initMap = async () => {
      if (!mapContainerRef.current) {
        return;
      }

      if (!window.google?.maps) {
        console.error("Google Maps JavaScript API가 로드되지 않았습니다.");

        return;
      }

      try {
        const [{ Map: GoogleMap }, { AdvancedMarkerElement }] =
          await Promise.all([
            window.google.maps.importLibrary("maps"),

            window.google.maps.importLibrary("marker"),
          ]);

        if (isCancelled || !mapContainerRef.current) {
          return;
        }

        AdvancedMarkerElementRef.current = AdvancedMarkerElement;

        const map = new GoogleMap(mapContainerRef.current, {
          center: DEFAULT_CENTER,

          zoom: 13,

          mapId: "DEMO_MAP_ID",

          disableDefaultUI: true,

          gestureHandling: "greedy",

          keyboardShortcuts: true,
        });

        mapRef.current = map;

        // ====================
        // POI Click
        // ====================

        map.addListener("click", async (event) => {
          if (!event.placeId) {
            return;
          }

          event.stop?.();

          try {
            const place = await getGooglePlaceById(event.placeId);

            if (!place) {
              return;
            }

            setSelectedPlace(place);

            setKeyword(place.name);

            setSearchResults([]);

            showSelectedPlace(place);
          } catch (error) {
            console.error("지도 장소 선택 오류:", error);
          }
        });

        moveToCurrentLocation();
      } catch (error) {
        console.error("Google Map 초기화 오류:", error);
      }
    };

    initMap();

    return () => {
      isCancelled = true;

      if (selectedMarkerRef.current) {
        selectedMarkerRef.current.map = null;

        selectedMarkerRef.current = null;
      }

      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.map = null;

        currentLocationMarkerRef.current = null;
      }

      mapRef.current = null;
    };
  }, []);

  // ====================
  // Current Location
  // ====================

  const moveToCurrentLocation = () => {
    const map = mapRef.current;

    const AdvancedMarkerElement = AdvancedMarkerElementRef.current;

    if (!map || !AdvancedMarkerElement) {
      return;
    }

    if (!navigator.geolocation) {
      alert("현재 위치 기능을 지원하지 않는 브라우저입니다.");

      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const current = {
          lat: position.coords.latitude,

          lng: position.coords.longitude,
        };

        setCurrentPosition(current);

        map.panTo(current);

        map.setZoom(15);

        if (currentLocationMarkerRef.current) {
          currentLocationMarkerRef.current.position = current;

          currentLocationMarkerRef.current.map = map;
        } else {
          currentLocationMarkerRef.current = new AdvancedMarkerElement({
            map,

            position: current,

            title: "현재 위치",
          });
        }

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

  // ====================
  // Current Location Button
  // ====================

  const handleCurrentLocation = () => {
    if (isLocating) {
      return;
    }

    if (currentPosition && mapRef.current) {
      mapRef.current.panTo(currentPosition);

      mapRef.current.setZoom(15);

      return;
    }

    moveToCurrentLocation();
  };

  // ====================
  // Back
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

  const handleSearchChange = (e) => {
    setKeyword(e.target.value);

    setSearchResults([]);
  };

  const handleSearchClose = () => {
    setKeyword("");

    setSearchResults([]);

    setSelectedPlace(null);

    setPlaceCardHeight(0);

    setIsSearchMode(false);

    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.map = null;

      selectedMarkerRef.current = null;
    }
  };

  // ====================
  // Selected Place
  // ====================

  const showSelectedPlace = (place) => {
    const map = mapRef.current;

    const AdvancedMarkerElement = AdvancedMarkerElementRef.current;

    if (!map || !AdvancedMarkerElement) {
      return;
    }

    if (place.lat == null || place.lng == null) {
      return;
    }

    const position = {
      lat: place.lat,

      lng: place.lng,
    };

    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.position = position;

      selectedMarkerRef.current.map = map;
    } else {
      const marker = new AdvancedMarkerElement({
        map,

        position,

        title: place.name,

        gmpClickable: true,
      });

      marker.addListener("click", () => {
        setSelectedPlace(place);
      });

      selectedMarkerRef.current = marker;
    }

    map.panTo(position);

    map.setZoom(16);
  };

  // ====================
  // Search Submit
  // ====================

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    const searchKeyword = keyword.trim();

    if (!searchKeyword || isSearching) {
      return;
    }

    const map = mapRef.current;

    if (!map) {
      return;
    }

    setIsSearching(true);

    setSearchResults([]);

    try {
      const center = map.getCenter();

      const results = await searchGooglePlaces(searchKeyword, {
        lat: center?.lat(),

        lng: center?.lng(),

        radius: 50000,

        maxResultCount: 10,
      });

      if (!results || results.length === 0) {
        alert("검색 결과가 없습니다.");

        return;
      }

      setSearchResults(results);

      if (results.length === 1) {
        const place = results[0];

        setSelectedPlace(place);

        setKeyword(place.name);

        setSearchResults([]);

        showSelectedPlace(place);
      }
    } catch (error) {
      console.error("Google 장소 검색 오류:", error);

      alert("장소 검색 중 오류가 발생했습니다.");
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);

    setKeyword(place.name);

    setSearchResults([]);

    showSelectedPlace(place);
  };

  // ====================
  // Favorite Data
  //
  // 이미지 저장 X
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

    url: selectedPlace.url,

    phone: selectedPlace.phone,

    openingHours: selectedPlace.openingHours || [],

    openNow: selectedPlace.openNow ?? null,
  });

  // ====================
  // Favorite Add
  // ====================

  const handleFavoriteAdd = () => {
    if (!selectedPlace) {
      return;
    }

    // ====================
    // 특정 Trip에서 진입
    // ====================

    if (mode === "favorite" && targetTripId) {
      const saved = saveFavoritePlace(createFavoritePlace(targetTripId));

      if (saved === false) {
        alert("이미 관심 장소에 추가된 장소입니다.");

        return;
      }

      navigate(-1);

      return;
    }

    setIsTripSelectOpen(true);
  };

  // ====================
  // Trip Select
  // ====================

  const handleTripSelect = (tripId) => {
    if (!selectedPlace) {
      return;
    }

    const selectedTrip = availableTrips.find((trip) => trip.id === tripId);

    if (!selectedTrip) {
      alert("관심 장소를 추가할 수 없는 여행입니다.");

      return;
    }

    const saved = saveFavoritePlace(createFavoritePlace(tripId));

    if (saved === false) {
      alert("이미 해당 여행의 관심 장소에 추가된 장소입니다.");

      return;
    }

    setIsTripSelectOpen(false);

    setFavoriteSuccessTripTitle(selectedTrip.title);

    setFavoriteSuccessPlaceName(selectedPlace.name);

    setIsFavoriteSuccessOpen(true);
  };

  const handleFavoriteSuccessClose = () => {
    setIsFavoriteSuccessOpen(false);

    setFavoriteSuccessTripTitle("");

    setFavoriteSuccessPlaceName("");
  };

  // ====================
  // Schedule Add
  //
  // 이미지 저장 X
  // ====================

  const handleScheduleAdd = () => {
    if (!selectedPlace || !targetTripId || !targetDate) {
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

      url: selectedPlace.url,

      phone: selectedPlace.phone,

      openingHours: selectedPlace.openingHours || [],

      openNow: selectedPlace.openNow ?? null,

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
    if (!selectedPlace || !targetTripId || !targetTrip) {
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
  // Position
  // ====================

  const currentLocationBottom = selectedPlace
    ? 100 + placeCardHeight + 12
    : 110;

  const isModalOpen =
    isTripSelectOpen || isFavoriteSuccessOpen || isAccommodationPeriodOpen;

  return (
    <main className="relative h-dvh overflow-hidden bg-white text-[#191919]">
      <div className="relative mx-auto h-dvh w-full max-w-[390px] overflow-hidden">
        {/* Map */}

        <div
          ref={mapContainerRef}
          className="
            absolute
            inset-0
            h-full
            w-full
          "
        />

        {/* Header */}

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

        {/* Current Location */}

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

        {/* Place Card */}

        {selectedPlace && (
          <PlaceCard
            place={selectedPlace}
            mode={mode}
            onFavoriteAdd={handleFavoriteAdd}
            onScheduleAdd={handleScheduleAdd}
            onAccommodationAdd={handleAccommodationAdd}
            onHeightChange={setPlaceCardHeight}
          />
        )}

        {!isModalOpen && <BottomNav />}

        <TripSelectModal
          isOpen={isTripSelectOpen}
          trips={availableTrips}
          onClose={() => setIsTripSelectOpen(false)}
          onSelect={handleTripSelect}
        />

        <FavoriteAddSuccessModal
          isOpen={isFavoriteSuccessOpen}
          tripTitle={favoriteSuccessTripTitle}
          placeName={favoriteSuccessPlaceName}
          onClose={handleFavoriteSuccessClose}
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
      </div>
    </main>
  );
}
