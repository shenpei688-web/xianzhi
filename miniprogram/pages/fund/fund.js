const api = require("../../utils/api");

const POLL_MS = 10_000;

// ── Local demo data fallback ──
const DEMO_INDICES = [
  { id: "dji", name: "道琼斯", changePercent: 1.52 },
  { id: "ixic", name: "纳斯达克", changePercent: -0.01 },
  { id: "ndx", name: "纳指100", changePercent: 0.81 },
  { id: "spx", name: "标普500", changePercent: 0.58 },
];

const DEMO_HOT_INDICES = [
  { id: "sh", name: "上证", changePercent: 0.46 },
  { id: "sz", name: "深证", changePercent: 0.92 },
  { id: "cyb", name: "创业板", changePercent: 1.21 },
  { id: "hs300", name: "沪深300", changePercent: 0.34 },
];

const DEMO_OVERSEAS_FUNDS = [
  { id: "of539003", name: "建信新兴市场混合", changePercent: 3.70 },
  { id: "of006881", name: "长城全球新能源车", changePercent: 2.36 },
  { id: "of012348", name: "天弘全球高端制造混合", changePercent: 2.10 },
  { id: "of270023", name: "广发全球精选", changePercent: 2.83 },
  { id: "of006308", name: "浦银安盛全球智能科技", changePercent: 1.28 },
  { id: "of000041", name: "华夏全球科技先锋混合", changePercent: 2.80 },
  { id: "of005156", name: "华宝致远混合", changePercent: 2.83 },
  { id: "of513300", name: "华宝纳斯达克精选", changePercent: -0.97 },
  { id: "of040046", name: "华安纳斯达克100", changePercent: 1.62 },
  { id: "of001092", name: "广发美国房地产", changePercent: -0.54 },
  { id: "of000834", name: "大成纳斯达克100", changePercent: 1.18 },
  { id: "of006075", name: "嘉实美国成长", changePercent: 0.74 },
  { id: "of486002", name: "工银全球精选", changePercent: 1.95 },
  { id: "of161116", name: "易方达标普500", changePercent: 0.58 },
  { id: "of050025", name: "博时标普500ETF联接", changePercent: 0.62 },
  { id: "of519981", name: "长信美国标普500", changePercent: 0.55 },
];

// 大盘卡片离线兜底：海外基→纳指 / 热门基→上证
const DEMO_HERO = {
  id: "ndx",
  name: "纳斯达克100",
  code: "NDX",
  price: 25297.62,
  changePercent: -0.24,
  changeAmount: -60.98,
  high: 25491.37,
  low: 25014.96,
  volume: 16299253248,
};

const DEMO_HOT_HERO = {
  id: "sh",
  name: "上证指数",
  code: "SH",
  price: 3382.46,
  changePercent: 0.46,
  changeAmount: 15.48,
  high: 3398.12,
  low: 3360.05,
  volume: 38500000000,
};

const DEMO_HOT_FUNDS = [
  { id: "of001875", name: "前海开源新经济", changePercent: 4.21 },
  { id: "of161725", name: "招商中证白酒", changePercent: 2.66 },
  { id: "of320007", name: "诺安成长混合", changePercent: 3.34 },
  { id: "of110011", name: "易方达优质精选", changePercent: 1.86 },
  { id: "of005827", name: "易方达蓝筹精选", changePercent: 2.18 },
  { id: "of001102", name: "前海开源国家比较优势", changePercent: -0.32 },
  { id: "of000961", name: "天弘沪深300ETF联接", changePercent: 0.43 },
  { id: "of003095", name: "中欧医疗健康", changePercent: -0.78 },
  { id: "of260108", name: "景顺长城新兴成长", changePercent: 1.92 },
  { id: "of519066", name: "汇添富蓝筹稳健", changePercent: 1.05 },
  { id: "of110022", name: "易方达消费行业", changePercent: 2.74 },
  { id: "of519005", name: "海富通精选", changePercent: 0.27 },
  { id: "of005176", name: "中欧时代先锋", changePercent: 3.05 },
  { id: "of005267", name: "广发双擎升级", changePercent: -1.13 },
  { id: "of519983", name: "长信量化中小盘", changePercent: 0.89 },
  { id: "of161024", name: "富国创业板指数", changePercent: 1.34 },
];

function buildDemoTabsData() {
  return {
    overseas: {
      key: "overseas",
      label: "海外基",
      indices: DEMO_INDICES,
      funds: DEMO_OVERSEAS_FUNDS,
      hero: DEMO_HERO,
    },
    hot: {
      key: "hot",
      label: "热门基",
      indices: DEMO_HOT_INDICES,
      funds: DEMO_HOT_FUNDS,
      hero: DEMO_HOT_HERO,
    },
  };
}

// ── Format helpers ──

function fmtPct(n) {
  const sign = n > 0 ? "" : n < 0 ? "−" : "";
  const abs = Math.abs(Number(n)).toFixed(2);
  return `${sign}${abs}%`;
}

function fmtNum(n, digits = 2) {
  const fixed = Number(n).toFixed(digits);
  const parts = fixed.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function fmtVolume(v) {
  const n = Number(v) || 0;
  if (n >= 1e8) return fmtNum(n / 1e8, 2) + "亿";
  if (n >= 1e4) return fmtNum(n / 1e4, 2) + "万";
  return fmtNum(n, 0);
}

function enrichHero(h) {
  if (!h) return null;
  const isUp = h.changePercent >= 0;
  const sign = isUp ? "+" : "−";
  const absAmt = Math.abs(Number(h.changeAmount)).toFixed(2);
  const absPct = Math.abs(Number(h.changePercent)).toFixed(2);
  return {
    name: h.name,
    code: h.code,
    isUp,
    priceText: fmtNum(h.price),
    changeText: `${sign}${absAmt}  ${sign}${absPct}%`,
    highText: fmtNum(h.high),
    lowText: fmtNum(h.low),
    volText: fmtVolume(h.volume),
  };
}

function fmtPctRow(n) {
  const sign = n > 0 ? "" : n < 0 ? "−" : "";
  const abs = Math.abs(Number(n)).toFixed(2);
  return `${sign}${abs} %`;
}

function fmtTime(iso) {
  const d = iso ? new Date(iso) : new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function enrichTab(tab) {
  return {
    ...tab,
    indices: tab.indices.map((idx) => ({
      ...idx,
      changeText: fmtPct(idx.changePercent),
      isUp: idx.changePercent >= 0,
    })),
    funds: tab.funds.map((f) => ({
      ...f,
      changeText: fmtPctRow(f.changePercent),
      isUp: f.changePercent >= 0,
    })),
  };
}

function paginate(funds, pageSize, page) {
  const total = Math.max(1, Math.ceil(funds.length / pageSize));
  const safe = Math.min(Math.max(page, 1), total);
  const start = (safe - 1) * pageSize;
  return {
    list: funds.slice(start, start + pageSize),
    page: safe,
    totalPages: total,
  };
}

Page({
  data: {
    loading: true,
    activeTab: "overseas",
    tabsData: null,
    hero: null,
    indices: [],
    fundList: [],
    pageSize: 8,
    page: 1,
    totalPages: 1,
    autoRefresh: true,
    updatedText: "",
  },

  onLoad() {
    this.loadAll(false);
  },

  onShow() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
    this.startTimer();
  },

  onTabItemTap() {
    // 点击底部 tab 时强制刷新
    this.loadAll(false);
  },

  onHide() {
    this.stopTimer();
  },

  onUnload() {
    this.stopTimer();
  },

  startTimer() {
    this.stopTimer();
    if (!this.data.autoRefresh) return;
    this._timer = setInterval(() => this.loadAll(true), POLL_MS);
  },

  stopTimer() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  },

  applyTabView(tabKey, page) {
    const tab = this.data.tabsData && this.data.tabsData[tabKey];
    if (!tab) return;
    const { list, page: safePage, totalPages } = paginate(
      tab.funds,
      this.data.pageSize,
      page || 1,
    );
    this.setData({
      activeTab: tabKey,
      indices: tab.indices,
      hero: enrichHero(tab.hero) || this.data.hero,
      fundList: list,
      page: safePage,
      totalPages,
    });
  },

  switchTab(e) {
    const key = e.currentTarget.dataset.key;
    if (key === this.data.activeTab) return;
    this.applyTabView(key, 1);
  },

  prevPage() {
    if (this.data.page <= 1) return;
    this.applyTabView(this.data.activeTab, this.data.page - 1);
  },

  nextPage() {
    if (this.data.page >= this.data.totalPages) return;
    this.applyTabView(this.data.activeTab, this.data.page + 1);
  },

  toggleAutoRefresh(e) {
    const on = !!(e.detail && e.detail.value);
    this.setData({ autoRefresh: on });
    if (on) this.startTimer();
    else this.stopTimer();
  },

  goSettings() {
    wx.showToast({ title: "设置", icon: "none" });
  },
  goLimit() {
    wx.showToast({ title: "限额", icon: "none" });
  },
  goSearch() {
    wx.showToast({ title: "搜索", icon: "none" });
  },
  goFavorites() {
    wx.showToast({ title: "自选", icon: "none" });
  },

  loadAll(silent) {
    if (!silent) this.setData({ loading: true });
    api
      .fetchFundQuotes(silent)
      .then((raw) => {
        const tabsData = {};
        raw.tabs.forEach((t) => {
          tabsData[t.key] = enrichTab(t);
        });
        this.setData({
          loading: false,
          tabsData,
          pageSize: raw.pageSize || 8,
          updatedText: fmtTime(raw.updatedAt),
        });
        this.applyTabView(this.data.activeTab, this.data.page);
      })
      .catch((err) => {
        console.warn("[fund] API 请求失败，使用本地 demo 数据", err);
        // 如果已有 tabsData（之前加载成功），保持现状
        if (this.data.tabsData) {
          if (!silent) this.setData({ loading: false });
          return;
        }
        // 使用本地 demo 数据
        const rawTabs = buildDemoTabsData();
        const tabsData = {};
        Object.keys(rawTabs).forEach((key) => {
          tabsData[key] = enrichTab(rawTabs[key]);
        });
        this.setData({
          loading: false,
          tabsData,
          pageSize: 8,
          updatedText: fmtTime(),
        });
        this.applyTabView(this.data.activeTab, this.data.page);
        if (!silent) {
          wx.showToast({ title: "离线数据", icon: "none", duration: 1500 });
        }
      });
  },

  onPullDownRefresh() {
    this.loadAll(false);
    wx.stopPullDownRefresh();
  },

  onShareAppMessage() {
    return {
      title: "基金行情 · 实时数据更新",
      path: "/pages/fund/fund",
    };
  },

  onShareTimeline() {
    return {
      title: "基金行情 · 实时数据更新",
    };
  },
});
