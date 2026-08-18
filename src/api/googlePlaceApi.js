// ====================
// Google Places
// ====================

// ====================
// Places Library
// ====================

const getPlacesLibrary = async () => {
  if (!window.google || !window.google.maps) {
    throw new Error("Google Maps JavaScript API가 로드되지 않았습니다.");
  }

  return await window.google.maps.importLibrary("places");
};

// ====================
// Address Component
// ====================

const getAddressComponent = (addressComponents = [], type) => {
  return (
    addressComponents.find((component) => component.types?.includes(type)) ||
    null
  );
};

// ====================
// Category
// ====================

const normalizeCategory = (category) => {
  if (!category) {
    return "장소";
  }

  const categoryMap = {
    치과의사: "치과",
    dentist: "치과",
    Dentist: "치과",
  };

  return categoryMap[category] || category;
};

// ====================
// Photo
//
// 여행 대표 이미지에서만 사용
// ====================

const getPhotoData = (photos, options = {}) => {
  if (!photos || photos.length === 0) {
    return {
      imageUrl: "",
      imageAuthorName: "",
      imageAuthorUrl: "",
    };
  }

  const photo = photos[0];

  const imageUrl = photo.getURI({
    maxWidth: options.maxWidth || 1200,
    maxHeight: options.maxHeight || 800,
  });

  const attribution = photo.authorAttributions?.[0] || null;

  return {
    imageUrl: imageUrl || "",

    imageAuthorName: attribution?.displayName || "",

    imageAuthorUrl: attribution?.uri || "",
  };
};

// ====================
// Map Place Normalize
//
// 장소 이미지 없음
// 실제 업체 Website만 사용
// ====================

const normalizeGooglePlace = (place) => {
  const location = place.location;

  const countryComponent = getAddressComponent(
    place.addressComponents,
    "country",
  );

  const cityComponent =
    getAddressComponent(place.addressComponents, "locality") ||
    getAddressComponent(place.addressComponents, "postal_town") ||
    getAddressComponent(place.addressComponents, "administrative_area_level_1");

  const category = place.primaryTypeDisplayName || place.primaryType || "장소";

  return {
    id: place.id || "",

    placeId: place.id || "",

    name: place.displayName || "",

    category: normalizeCategory(category),

    address: place.formattedAddress || "",

    roadAddress: place.formattedAddress || "",

    lat: location ? location.lat() : null,

    lng: location ? location.lng() : null,

    rating: place.rating ?? null,

    // ====================
    // Opening Hours
    // ====================

    openingHours: place.regularOpeningHours?.weekdayDescriptions || [],

    openNow: place.regularOpeningHours?.openNow ?? null,

    // ====================
    // 실제 업체 Website
    // Google Maps URI 사용 X
    // ====================

    url: place.websiteURI || "",

    phone: place.nationalPhoneNumber || "",

    country: countryComponent?.longText || "",

    countryCode: countryComponent?.shortText || "",

    city: cityComponent?.longText || "",
  };
};

// ====================
// Map 장소 검색
//
// 검색 submit 시에만 호출
// ====================

export const searchGooglePlaces = async (keyword, options = {}) => {
  const searchKeyword = keyword?.trim();

  if (!searchKeyword) {
    return [];
  }

  try {
    const { Place } = await getPlacesLibrary();

    const request = {
      textQuery: searchKeyword,

      fields: [
        "id",
        "displayName",
        "formattedAddress",
        "addressComponents",
        "location",
        "primaryType",
        "primaryTypeDisplayName",
        "rating",
        "regularOpeningHours",
        "websiteURI",
        "nationalPhoneNumber",
      ],

      maxResultCount: options.maxResultCount || 10,

      language: "ko",
    };

    // ====================
    // 현재 Map 중심 근처 우선
    // ====================

    if (options.lat != null && options.lng != null) {
      request.locationBias = {
        center: {
          lat: options.lat,

          lng: options.lng,
        },

        radius: options.radius || 50000,
      };
    }

    const { places } = await Place.searchByText(request);

    if (!places || places.length === 0) {
      return [];
    }

    return places.map(normalizeGooglePlace);
  } catch (error) {
    console.error("Google Places 검색 오류:", error);

    throw error;
  }
};

// ====================
// Place ID 상세 조회
//
// Map 기본 POI 클릭 시 사용
//
// 사진 요청 X
// ====================

export const getGooglePlaceById = async (placeId) => {
  if (!placeId) {
    return null;
  }

  try {
    const { Place } = await getPlacesLibrary();

    const place = new Place({
      id: placeId,
    });

    await place.fetchFields({
      fields: [
        "id",
        "displayName",
        "formattedAddress",
        "addressComponents",
        "location",
        "primaryType",
        "primaryTypeDisplayName",
        "rating",
        "regularOpeningHours",
        "websiteURI",
        "nationalPhoneNumber",
      ],
    });

    return normalizeGooglePlace(place);
  } catch (error) {
    console.error("Google Place 상세 조회 오류:", error);

    return null;
  }
};

// ====================
// Destination Type
// ====================

const getDestinationType = (types = []) => {
  if (types.includes("country")) {
    return "country";
  }

  if (
    types.includes("locality") ||
    types.includes("postal_town") ||
    types.includes("administrative_area_level_1")
  ) {
    return "city";
  }

  return null;
};

// ====================
// 여행 도시 / 국가 Normalize
// ====================

const normalizeGoogleDestination = (place) => {
  const types = place.types || [];

  const type = getDestinationType(types);

  if (!type) {
    return null;
  }

  const location = place.location;

  const countryComponent = getAddressComponent(
    place.addressComponents,
    "country",
  );

  const localityComponent =
    getAddressComponent(place.addressComponents, "locality") ||
    getAddressComponent(place.addressComponents, "postal_town");

  const admin1Component = getAddressComponent(
    place.addressComponents,
    "administrative_area_level_1",
  );

  // ====================
  // 국가
  // ====================

  if (type === "country") {
    return {
      id: place.id || "",

      googlePlaceId: place.id || "",

      type: "country",

      name: place.displayName || countryComponent?.longText || "",

      country: countryComponent?.longText || place.displayName || "",

      countryCode: countryComponent?.shortText || "",

      city: "",

      admin1: "",

      lat: location ? location.lat() : null,

      lng: location ? location.lng() : null,
    };
  }

  // ====================
  // 도시
  // ====================

  return {
    id: place.id || "",

    googlePlaceId: place.id || "",

    type: "city",

    name:
      place.displayName ||
      localityComponent?.longText ||
      admin1Component?.longText ||
      "",

    country: countryComponent?.longText || "",

    countryCode: countryComponent?.shortText || "",

    city: place.displayName || localityComponent?.longText || "",

    admin1: admin1Component?.longText || "",

    lat: location ? location.lat() : null,

    lng: location ? location.lng() : null,
  };
};

// ====================
// Destination 중복 제거
// ====================

const removeDuplicateDestinations = (destinations) => {
  const map = new Map();

  destinations.forEach((destination) => {
    const key =
      destination.type === "country"
        ? `country-${destination.countryCode}`
        : `city-${destination.name}-${destination.countryCode}`;

    if (!map.has(key)) {
      map.set(key, destination);
    }
  });

  return Array.from(map.values());
};

// ====================
// 여행 도시 / 국가 검색
// ====================

export const searchGoogleDestinations = async (keyword) => {
  const searchKeyword = keyword?.trim();

  if (!searchKeyword) {
    return [];
  }

  try {
    const { Place } = await getPlacesLibrary();

    const { places } = await Place.searchByText({
      textQuery: searchKeyword,

      fields: [
        "id",
        "displayName",
        "formattedAddress",
        "addressComponents",
        "location",
        "types",
      ],

      maxResultCount: 20,

      language: "ko",
    });

    if (!places || places.length === 0) {
      return [];
    }

    const destinations = places.map(normalizeGoogleDestination).filter(Boolean);

    return removeDuplicateDestinations(destinations).slice(0, 10);
  } catch (error) {
    console.error("Google 여행지 검색 오류:", error);

    throw error;
  }
};

// ====================
// 여행 대표 이미지
//
// 여기에서만 Photo API 데이터 사용
// ====================

const getGooglePlaceImageById = async (placeId) => {
  if (!placeId) {
    return null;
  }

  const { Place } = await getPlacesLibrary();

  const place = new Place({
    id: placeId,
  });

  await place.fetchFields({
    fields: ["displayName", "photos"],
  });

  if (!place.photos || place.photos.length === 0) {
    return null;
  }

  const photoData = getPhotoData(place.photos, {
    maxWidth: 1200,

    maxHeight: 800,
  });

  return {
    googlePlaceId: place.id || placeId,

    imageUrl: photoData.imageUrl,

    imageAuthorName: photoData.imageAuthorName,

    imageAuthorUrl: photoData.imageAuthorUrl,
  };
};

// ====================
// 여행 대표 이미지
//
// 여행 생성 시에만 호출
// ====================

export const getGooglePlaceImage = async ({ placeId, name, country }) => {
  try {
    // ====================
    // Place ID 우선
    // ====================

    if (placeId) {
      const result = await getGooglePlaceImageById(placeId);

      if (result) {
        return result;
      }
    }

    // ====================
    // Fallback
    // ====================

    if (!name) {
      return null;
    }

    const { Place } = await getPlacesLibrary();

    const textQuery = [name, country].filter(Boolean).join(" ");

    const { places } = await Place.searchByText({
      textQuery,

      fields: ["id", "displayName"],

      maxResultCount: 5,

      language: "ko",
    });

    if (!places || places.length === 0) {
      return null;
    }

    for (const place of places) {
      const image = await getGooglePlaceImageById(place.id);

      if (image) {
        return image;
      }
    }

    return null;
  } catch (error) {
    console.error("Google Places 대표 이미지 오류:", error);

    return null;
  }
};
