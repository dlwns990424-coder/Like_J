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

  favoritePlaces.push(favoritePlace);

  localStorage.setItem("favoritePlaces", JSON.stringify(favoritePlaces));
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
