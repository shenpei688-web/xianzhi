const TOKEN_KEY = "swap_token";
const USER_KEY = "swap_user";

function getToken() {
  return wx.getStorageSync(TOKEN_KEY) || "";
}

function setAuth(token, user) {
  wx.setStorageSync(TOKEN_KEY, token);
  wx.setStorageSync(USER_KEY, user);
}

function getUser() {
  return wx.getStorageSync(USER_KEY) || null;
}

function clearAuth() {
  wx.removeStorageSync(TOKEN_KEY);
  wx.removeStorageSync(USER_KEY);
}

function isLoggedIn() {
  return !!getToken();
}

module.exports = { getToken, setAuth, getUser, clearAuth, isLoggedIn };
