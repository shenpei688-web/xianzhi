const auth = require("../../utils/auth");

const GUEST_PROFILE = {
  name: "未登录",
  avatar: "",
  id: "点击右侧「微信登录」授权",
  desc: "登录后参与讨论将显示你的昵称",
};

function buildProfile(user) {
  if (user && user.name) {
    return {
      name: user.name,
      avatar: user.avatar || "",
      id: user.id || "ID: 纳指用户",
      desc: "Deepseek AI · 智能投顾",
    };
  }
  return GUEST_PROFILE;
}

Page({
  data: {
    isLogged: false,
    avatarText: "纳",
    profile: GUEST_PROFILE,
    // 登录弹窗
    showLogin: false,
    draftName: "",
    draftAvatar: "",
    stats: [
      { label: "自选", value: 12 },
      { label: "持仓", value: 5 },
      { label: "浏览", value: 268 },
    ],
    menus: [
      { id: "fav", icon: "★", label: "我的自选", desc: "12 只" },
      { id: "hold", icon: "▤", label: "持仓分析", desc: "" },
      { id: "limit", icon: "¥", label: "限额设置", desc: "" },
      { id: "msg", icon: "✉", label: "消息通知", desc: "" },
      { id: "help", icon: "?", label: "帮助中心", desc: "" },
      { id: "about", icon: "ⓘ", label: "关于我们", desc: "v1.0.0" },
    ],
  },

  onShow() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2, hidden: false });
    }
    this.syncUser();
  },

  setTabBarHidden(hidden) {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({ hidden });
    }
  },

  syncUser() {
    const user = auth.getUser();
    const isLogged = auth.isLoggedIn() && !!user;
    const profile = buildProfile(user);
    this.setData({
      isLogged,
      profile,
      avatarText: (profile.name || "纳").charAt(0),
    });
  },

  // 头像/昵称按钮 → 打开登录弹窗；已登录则退出
  onAuthTap() {
    if (this.data.isLogged) {
      wx.showModal({
        title: "退出登录",
        content: "确定要退出当前账号吗？",
        confirmColor: "#1f7cff",
        success: (r) => {
          if (r.confirm) {
            auth.clearAuth();
            this.syncUser();
            wx.showToast({ title: "已退出", icon: "none" });
          }
        },
      });
    } else {
      const user = auth.getUser();
      this.setData({
        showLogin: true,
        draftName: (user && user.name) || "",
        draftAvatar: (user && user.avatar) || "",
      });
      this.setTabBarHidden(true);
    }
  },

  closeLogin() {
    this.setData({ showLogin: false });
    this.setTabBarHidden(false);
  },

  noop() {},

  // 微信头像选择能力
  onChooseAvatar(e) {
    const url = e.detail && e.detail.avatarUrl ? e.detail.avatarUrl : "";
    if (url) this.setData({ draftAvatar: url });
  },

  // 微信昵称填写能力
  onNickInput(e) {
    this.setData({ draftName: e.detail.value });
  },

  confirmLogin() {
    const name = (this.data.draftName || "").trim();
    if (!name) {
      wx.showToast({ title: "请填写昵称", icon: "none" });
      return;
    }
    const avatar = this.data.draftAvatar || "";
    wx.login({
      success: (login) => this.saveLogin(name, avatar, (login && login.code) || ""),
      fail: () => this.saveLogin(name, avatar, ""),
    });
  },

  saveLogin(name, avatar, code) {
    const user = {
      name,
      avatar,
      id: "ID: " + (code ? code.slice(0, 8).toUpperCase() : String(Date.now()).slice(-8)),
    };
    auth.setAuth(code || "t_" + Date.now(), user);
    this.setData({ showLogin: false });
    this.setTabBarHidden(false);
    this.syncUser();
    wx.showToast({ title: "登录成功", icon: "success" });
  },

  onMenu() {
    if (!this.data.isLogged) {
      wx.showToast({ title: "请先登录", icon: "none" });
      return;
    }
    wx.showToast({ title: "功能开发中", icon: "none" });
  },

  onShareAppMessage() {
    return { title: "纳指基金 · 实时数据", path: "/pages/fund/fund" };
  },
});
