Component({
  data: {
    selected: 0,
    hidden: false,
    list: [
      { pagePath: "/pages/fund/fund", text: "行情" },
      { pagePath: "/pages/market/market", text: "论坛" },
      { pagePath: "/pages/profile/profile", text: "我的" },
    ],
  },
  methods: {
    switchTab(e) {
      const idx = e.currentTarget.dataset.index;
      const item = this.data.list[idx];
      if (!item) return;
      this.setData({ selected: idx });
      wx.switchTab({ url: item.pagePath });
    },
  },
});
