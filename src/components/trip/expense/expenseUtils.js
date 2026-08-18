// ====================
// Date Utils
// ====================

export const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
};

export const formatDateKey = (date) => {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getTripDates = (startDate, endDate) => {
  const start = parseDate(startDate);

  const end = parseDate(endDate);

  if (!start || !end) {
    return [];
  }

  const dates = [];

  const current = new Date(start);

  while (current <= end) {
    dates.push(new Date(current));

    current.setDate(current.getDate() + 1);
  }

  return dates;
};

// ====================
// Currency
// ====================

export const getTripCurrency = (trip) => {
  const countryCode = String(
    trip?.countryCode || trip?.destinationCountryCode || "",
  ).toUpperCase();

  const country = String(
    trip?.country ||
      trip?.destinationCountry ||
      trip?.destination ||
      trip?.title ||
      "",
  ).toLowerCase();

  // ====================
  // Korea
  // ====================

  if (
    countryCode === "KR" ||
    country.includes("한국") ||
    country.includes("서울") ||
    country.includes("부산")
  ) {
    return {
      code: "KRW",
      symbol: "₩",
    };
  }

  // ====================
  // Japan
  // ====================

  if (
    countryCode === "JP" ||
    country.includes("일본") ||
    country.includes("도쿄") ||
    country.includes("오사카") ||
    country.includes("오키나와")
  ) {
    return {
      code: "JPY",
      symbol: "¥",
    };
  }

  // ====================
  // USA
  // ====================

  if (
    countryCode === "US" ||
    country.includes("미국") ||
    country.includes("뉴욕") ||
    country.includes("하와이")
  ) {
    return {
      code: "USD",
      symbol: "$",
    };
  }

  // ====================
  // UK
  // ====================

  if (
    countryCode === "GB" ||
    countryCode === "UK" ||
    country.includes("영국") ||
    country.includes("런던")
  ) {
    return {
      code: "GBP",
      symbol: "£",
    };
  }

  // ====================
  // Taiwan
  // ====================

  if (
    countryCode === "TW" ||
    country.includes("대만") ||
    country.includes("타이베이")
  ) {
    return {
      code: "TWD",
      symbol: "NT$",
    };
  }

  // ====================
  // Europe
  // ====================

  if (
    ["IT", "FR", "DE", "ES", "PT", "NL", "BE", "AT", "IE", "FI", "GR"].includes(
      countryCode,
    ) ||
    country.includes("이탈리아") ||
    country.includes("로마") ||
    country.includes("프랑스") ||
    country.includes("파리")
  ) {
    return {
      code: "EUR",
      symbol: "€",
    };
  }

  // ====================
  // Default
  // ====================

  return {
    code: "USD",
    symbol: "$",
  };
};

// ====================
// Money
// ====================

export const formatMoney = (value, currency) => {
  const number = Number(value) || 0;

  return `${currency.symbol}${number.toLocaleString()}`;
};
