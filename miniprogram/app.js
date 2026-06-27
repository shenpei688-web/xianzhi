App({
  globalData: {
    brand: {
      name: "纳指基金",
      subtitle: "行情速览",
      tagline: "纳指 · 标普 · 实时行情",
    },
  },
  onLaunch() {},
  // 兜底：访问到已删除/不存在的页面（旧分享、旧体验码、旧深链）时自动回行情首页
  onPageNotFound() {
    wx.reLaunch({ url: "/pages/fund/fund" });
  },
});
