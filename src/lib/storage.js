// ====================
// User
// ====================

export const getUsers = () => {
  const users = localStorage.getItem("users");

  return users ? JSON.parse(users) : [];
};

export const saveUser = (user) => {
  const users = getUsers();

  users.push(user);

  localStorage.setItem("users", JSON.stringify(users));
};

export const findUserByEmail = (email) => {
  const users = getUsers();

  return users.find((user) => user.email === email);
};

// ====================
// Current User
// ====================

export const saveCurrentUser = (user) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

export const getCurrentUser = () => {
  const currentUser = localStorage.getItem("currentUser");

  return currentUser ? JSON.parse(currentUser) : null;
};

export const removeCurrentUser = () => {
  localStorage.removeItem("currentUser");
};

// ====================
// Trip
// ====================

export const getTrips = () => {
  const trips = localStorage.getItem("trips");

  return trips ? JSON.parse(trips) : [];
};

export const saveTrip = (trip) => {
  const trips = getTrips();

  trips.push(trip);

  localStorage.setItem("trips", JSON.stringify(trips));
};

export const getTripsByUserId = (userId) => {
  const trips = getTrips();

  return trips.filter((trip) => trip.userId === userId);
};

export const getTripById = (tripId) => {
  const trips = getTrips();

  return trips.find((trip) => trip.id === tripId);
};

export const updateTrip = (tripId, updatedData) => {
  const trips = getTrips();

  const updatedTrips = trips.map((trip) =>
    trip.id === tripId
      ? {
          ...trip,
          ...updatedData,
        }
      : trip,
  );

  localStorage.setItem("trips", JSON.stringify(updatedTrips));
};

// ====================
// Favorite Place
// ====================

export const getFavoritePlaces = () => {
  const favoritePlaces = localStorage.getItem("favoritePlaces");

  return favoritePlaces ? JSON.parse(favoritePlaces) : [];
};

export const saveFavoritePlace = (favoritePlace) => {
  const favoritePlaces = getFavoritePlaces();

  const alreadyExists = favoritePlaces.some(
    (place) =>
      place.tripId === favoritePlace.tripId &&
      place.placeId === favoritePlace.placeId,
  );

  if (alreadyExists) {
    return false;
  }

  favoritePlaces.push(favoritePlace);

  localStorage.setItem("favoritePlaces", JSON.stringify(favoritePlaces));

  return true;
};

export const getFavoritePlacesByTripId = (tripId) => {
  const favoritePlaces = getFavoritePlaces();

  return favoritePlaces.filter(
    (favoritePlace) => favoritePlace.tripId === tripId,
  );
};

// ====================
// Schedule
// ====================

export const getSchedules = () => {
  const schedules = localStorage.getItem("schedules");

  return schedules ? JSON.parse(schedules) : [];
};

export const saveSchedule = (schedule) => {
  const schedules = getSchedules();

  schedules.push(schedule);

  localStorage.setItem("schedules", JSON.stringify(schedules));
};

export const getSchedulesByTripId = (tripId) => {
  const schedules = getSchedules();

  return schedules.filter((schedule) => schedule.tripId === tripId);
};

export const updateSchedule = (scheduleId, updatedData) => {
  const schedules = getSchedules();

  const updatedSchedules = schedules.map((schedule) =>
    schedule.id === scheduleId
      ? {
          ...schedule,
          ...updatedData,
        }
      : schedule,
  );

  localStorage.setItem("schedules", JSON.stringify(updatedSchedules));
};

export const deleteSchedule = (scheduleId) => {
  const schedules = getSchedules();

  const updatedSchedules = schedules.filter(
    (schedule) => schedule.id !== scheduleId,
  );

  localStorage.setItem("schedules", JSON.stringify(updatedSchedules));
};

// ====================
// Schedule Memo
// ====================

export const getScheduleMemos = () => {
  const memos = localStorage.getItem("scheduleMemos");

  return memos ? JSON.parse(memos) : [];
};

export const getScheduleMemoByTripAndDate = (tripId, date) => {
  const memos = getScheduleMemos();

  return memos.find((memo) => memo.tripId === tripId && memo.date === date);
};

export const saveScheduleMemo = ({ tripId, date, content }) => {
  const memos = getScheduleMemos();

  const existingIndex = memos.findIndex(
    (memo) => memo.tripId === tripId && memo.date === date,
  );

  const memoData = {
    id: existingIndex >= 0 ? memos[existingIndex].id : crypto.randomUUID(),

    tripId,

    date,

    content,

    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    memos[existingIndex] = memoData;
  } else {
    memos.push(memoData);
  }

  localStorage.setItem("scheduleMemos", JSON.stringify(memos));

  return memoData;
};

export const deleteScheduleMemo = (tripId, date) => {
  const memos = getScheduleMemos();

  const updatedMemos = memos.filter(
    (memo) => !(memo.tripId === tripId && memo.date === date),
  );

  localStorage.setItem("scheduleMemos", JSON.stringify(updatedMemos));
};

// ====================
// Accommodation
// ====================

export const getAccommodations = () => {
  const accommodations = localStorage.getItem("accommodations");

  return accommodations ? JSON.parse(accommodations) : [];
};

export const getAccommodationsByTripId = (tripId) => {
  const accommodations = getAccommodations();

  return accommodations.filter(
    (accommodation) => accommodation.tripId === tripId,
  );
};

export const isDateInAccommodation = (date, accommodation) => {
  if (!date || !accommodation?.checkInDate || !accommodation?.checkOutDate) {
    return false;
  }

  return (
    date >= accommodation.checkInDate && date <= accommodation.checkOutDate
  );
};

export const getAccommodationsByTripAndDate = (tripId, date) => {
  const accommodations = getAccommodationsByTripId(tripId);

  return accommodations
    .filter((accommodation) => isDateInAccommodation(date, accommodation))
    .slice(0, 2);
};

const getDateRange = (startDate, endDate) => {
  const start = new Date(`${startDate}T00:00:00`);

  const end = new Date(`${endDate}T00:00:00`);

  const dates = [];

  const current = new Date(start);

  while (current <= end) {
    const year = current.getFullYear();

    const month = String(current.getMonth() + 1).padStart(2, "0");

    const day = String(current.getDate()).padStart(2, "0");

    dates.push(`${year}-${month}-${day}`);

    current.setDate(current.getDate() + 1);
  }

  return dates;
};

export const canSaveAccommodation = (accommodation) => {
  const accommodations = getAccommodationsByTripId(accommodation.tripId);

  const newDates = getDateRange(
    accommodation.checkInDate,
    accommodation.checkOutDate,
  );

  for (const date of newDates) {
    const overlappingCount = accommodations.filter((savedAccommodation) => {
      if (accommodation.id && savedAccommodation.id === accommodation.id) {
        return false;
      }

      return isDateInAccommodation(date, savedAccommodation);
    }).length;

    if (overlappingCount >= 2) {
      return false;
    }
  }

  return true;
};

export const saveAccommodation = (accommodation) => {
  if (!canSaveAccommodation(accommodation)) {
    return false;
  }

  const accommodations = getAccommodations();

  const existingIndex = accommodations.findIndex(
    (item) => item.id === accommodation.id,
  );

  if (existingIndex >= 0) {
    accommodations[existingIndex] = accommodation;
  } else {
    accommodations.push(accommodation);
  }

  localStorage.setItem("accommodations", JSON.stringify(accommodations));

  return true;
};

export const deleteAccommodation = (accommodationId) => {
  const accommodations = getAccommodations();

  const updatedAccommodations = accommodations.filter(
    (accommodation) => accommodation.id !== accommodationId,
  );

  localStorage.setItem("accommodations", JSON.stringify(updatedAccommodations));
};

// ====================
// Expense
// ====================

export const getExpenses = () => {
  const expenses = localStorage.getItem("expenses");

  return expenses ? JSON.parse(expenses) : [];
};

export const saveExpense = (expense) => {
  const expenses = getExpenses();

  expenses.push(expense);

  localStorage.setItem("expenses", JSON.stringify(expenses));
};

export const getExpensesByTripId = (tripId) => {
  const expenses = getExpenses();

  return expenses.filter((expense) => expense.tripId === tripId);
};
