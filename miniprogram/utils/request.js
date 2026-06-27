const { apiBase } = require("../config/env");
const { getToken } = require("./auth");

function request(path, options = {}) {
  const method = options.method || "GET";
  const headers = {
    "content-type": "application/json",
    ...options.header,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${apiBase}${path}`,
      method,
      data: options.data,
      header: headers,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          const msg =
            (res.data && res.data.error) || `HTTP ${res.statusCode}`;
          reject(new Error(msg));
        }
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

module.exports = { request };
