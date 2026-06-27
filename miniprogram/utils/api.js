const { request } = require("./request");

module.exports = {
  fetchFundQuotes: (fresh) =>
    request(`/api/fund/quotes${fresh ? "?fresh=1" : ""}`),
};
