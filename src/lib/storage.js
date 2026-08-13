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
