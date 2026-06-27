const auth = require("../../utils/auth");

function currentUserName() {
  try {
    const u = auth.getUser();
    return u && u.name ? u.name : "游客";
  } catch (_) {
    return "游客";
  }
}

// ── Demo posts ──
const DEMO_POSTS = [
  {
    id: "p1",
    title: "今天纳指暴涨3%，大家怎么看这波行情？",
    content:
      "昨晚美股三大指数全线上涨，纳指领涨超3%。科技股集体反弹，英伟达涨5%，特斯拉涨4%。感觉这波资金面驱动比较明显，但基本面是否支持继续上行？想听听大家的看法。",
    author: "投资达人",
    avatar: "",
    time: "10分钟前",
    likeCount: 128,
    commentCount: 56,
    tag: "行情",
    isHot: true,
  },
  {
    id: "p2",
    title: "分享一个基金配置思路：60%纳指+40%债基",
    content:
      "最近把自己的组合调整了一下，减少了A股比例，增加了纳指和标普500的配置。回测过去5年数据，60%纳指+30%债基+10%黄金的夏普比还不错。大家觉得这个配比合理吗？",
    author: "量化小散",
    avatar: "",
    time: "1小时前",
    likeCount: 95,
    commentCount: 34,
    tag: "策略",
  },
  {
    id: "p3",
    title: "有没有人关注最近黄金这波回调？",
    content:
      "黄金从高点回撤了大概5%，机构普遍认为这是技术性调整。但我觉得如果美联储降息预期进一步推迟，黄金可能还有下行空间。现在是不是建仓的好时机？",
    author: "金市观察",
    avatar: "",
    time: "2小时前",
    likeCount: 76,
    commentCount: 42,
    tag: "行情",
    isHot: true,
  },
  {
    id: "p4",
    title: "新手求问：QDII基金限购了怎么办？",
    content:
      "想买几只纳指相关的QDII，发现好几只都限购100元/天了。有没有什么替代方案？比如跨境ETF或者直接开美股账户？求大佬指点。",
    author: "新手上路",
    avatar: "",
    time: "3小时前",
    likeCount: 52,
    commentCount: 67,
    tag: "提问",
  },
  {
    id: "p5",
    title: "盘点2025上半年最赚钱的10只基金",
    content:
      "整理了上半年表现最好的基金：1. 建信新兴市场 +35%，2. 华夏全球科技 +32%，3. 广发全球精选 +30%... 大部分都是海外科技主题。不得不说，AI驱动的这波行情真的强。",
    author: "数据搬运工",
    avatar: "",
    time: "5小时前",
    likeCount: 203,
    commentCount: 89,
    tag: "干货",
    isHot: true,
  },
  {
    id: "p6",
    title: "大家好，我是刚入坑的小白",
    content:
      "之前一直存定期，朋友推荐我来关注基金。目前想先从指数基金开始，大家有没有适合新手入门的推荐？风险偏好中等，能接受10%左右的回撤。",
    author: "理财小白",
    avatar: "",
    time: "昨天 16:30",
    likeCount: 31,
    commentCount: 45,
    tag: "闲聊",
  },
  {
    id: "p7",
    title: "A股和美股现在哪个更有性价比？",
    content:
      "对比了一下PE估值：上证13x，沪深300 12x，标普500 24x，纳指100 31x。单纯看估值A股更便宜，但美股利润增速更快。从性价比角度看，大家投哪边多一些？",
    author: "价值猎人",
    avatar: "",
    time: "昨天 14:20",
    likeCount: 89,
    commentCount: 112,
    tag: "行情",
  },
  {
    id: "p8",
    title: "今日份提醒：记得定投",
    content:
      "又到周五了，今天是纳指100定投日。坚持了3年，体验就是：不用择时，不用焦虑，跌了多买点份额，涨了开心数钱。定投真的是懒人理财的最优解。",
    author: "佛系定投",
    avatar: "",
    time: "昨天 09:00",
    likeCount: 156,
    commentCount: 23,
    tag: "闲聊",
  },
];

const TAGS = ["全部", "行情", "闲聊"];

// WXSS 选择器不支持中文，标签统一映射成英文 class 后缀
const TAG_CLASS = {
  行情: "quote",
  策略: "strategy",
  干货: "tips",
  提问: "ask",
  闲聊: "chat",
};
// 预置示例评论（让评论数真实可见，进入后能看到内容）
const SEED_COMMENTS = {
  p1: [
    { id: "p1c1", author: "投机客", content: "资金面驱动明显，但要留意获利回吐。", time: "8分钟前" },
    { id: "p1c2", author: "科技多头", content: "英伟达带动整个板块，短期偏强。", time: "5分钟前" },
    { id: "p1c3", author: "趋势交易", content: "趋势没破，我继续持有。", time: "2分钟前" },
  ],
  p2: [
    { id: "p2c1", author: "稳健投资", content: "配置思路清晰，适合稳健型。", time: "50分钟前" },
    { id: "p2c2", author: "风控优先", content: "债基比例可以再高点防回撤。", time: "30分钟前" },
  ],
  p3: [
    { id: "p3c1", author: "贵金属研究", content: "降息预期反复，黄金短期震荡为主。", time: "1小时前" },
    { id: "p3c2", author: "定投党", content: "我分批建仓，不赌单边方向。", time: "40分钟前" },
  ],
  p4: [
    { id: "p4c1", author: "ETF玩家", content: "可以看看跨境ETF，流动性不错。", time: "2小时前" },
    { id: "p4c2", author: "海外党", content: "直接开美股账户更灵活。", time: "1小时前" },
    { id: "p4c3", author: "老基民", content: "限购就分散到多只基金买。", time: "50分钟前" },
  ],
  p5: [
    { id: "p5c1", author: "学习中", content: "整理得很用心，收藏了。", time: "4小时前" },
    { id: "p5c2", author: "趋势跟随", content: "海外科技确实是今年主线。", time: "3小时前" },
  ],
  p6: [
    { id: "p6c1", author: "老司机", content: "先从宽基指数开始最稳。", time: "昨天 17:00" },
    { id: "p6c2", author: "过来人", content: "控制好仓位，别一把梭。", time: "昨天 18:20" },
  ],
  p7: [
    { id: "p7c1", author: "价值派", content: "估值便宜不代表马上就涨。", time: "昨天 15:00" },
    { id: "p7c2", author: "全球配置", content: "我两边都配，分散风险。", time: "昨天 16:10" },
  ],
  p8: [
    { id: "p8c1", author: "懒人理财", content: "定投+1，省心。", time: "昨天 09:30" },
    { id: "p8c2", author: "长期主义", content: "坚持最重要，三年回头看很香。", time: "昨天 10:15" },
  ],
};

const COMMENTS_KEY = "discussion_comments";
function loadCommentsMap() {
  try {
    return wx.getStorageSync(COMMENTS_KEY) || {};
  } catch (_) {
    return {};
  }
}
function saveCommentsMap(map) {
  try {
    wx.setStorageSync(COMMENTS_KEY, map);
  } catch (_) {}
}

// 某帖的全部评论 = 预置评论 + 用户本地评论
function getComments(postId, cmap) {
  const seed = SEED_COMMENTS[postId] || [];
  const local = (cmap && cmap[postId]) || [];
  return [...seed, ...local];
}

const LIKES_KEY = "discussion_likes";
function loadLikesMap() {
  try {
    return wx.getStorageSync(LIKES_KEY) || {};
  } catch (_) {
    return {};
  }
}
function saveLikesMap(map) {
  try {
    wx.setStorageSync(LIKES_KEY, map);
  } catch (_) {}
}

function withTagClass(p, cmap, lmap) {
  const liked = !!(lmap && lmap[p.id]);
  const base = p.likeCount || 0;
  return {
    ...p,
    tagClass: TAG_CLASS[p.tag] || "chat",
    commentCount: getComments(p.id, cmap).length,
    liked,
    likeBase: base,
    likeCount: base + (liked ? 1 : 0),
  };
}

function fmtTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const COLORS = ["#4db8ff", "#f59e0b", "#10b981", "#7c3aed", "#ef4444", "#ec4899"];
function avatarStyle(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const color = COLORS[Math.abs(hash) % COLORS.length];
  return `background:${color};color:#fff;`;
}

Page(
  Object.assign(
    {
      data: {
        activeTag: "全部",
        tags: TAGS,
        allPosts: [],
        posts: [],
        // publish modal
        showPublish: false,
        pubTitle: "",
        pubContent: "",
        pubTag: "闲聊",
        scrollTop: 0,
        // 评论
        showComments: false,
        activePost: null,
        comments: [],
        commentInput: "",
      },

      onLoad(options) {
        this.initPosts();
        // 从分享卡片进入：定位到对应帖子并展开评论
        if (options && options.postId) {
          this._pendingPostId = options.postId;
          this.tryOpenPending();
        }
      },

      tryOpenPending() {
        const id = this._pendingPostId;
        if (!id) return;
        const post = (this.data.allPosts || []).find((p) => p.id === id);
        if (post) {
          this._pendingPostId = null;
          this.openCommentsForPost(post);
        }
      },

      // 弹窗打开时隐藏自定义 TabBar（否则会盖住底部输入栏）
      setTabBarHidden(hidden) {
        if (typeof this.getTabBar === "function" && this.getTabBar()) {
          this.getTabBar().setData({ hidden });
        }
      },

      onShow() {
        if (typeof this.getTabBar === "function" && this.getTabBar()) {
          this.getTabBar().setData({ selected: 1, hidden: false });
        }
        // 每次回到页面刷新时间
        this.refreshDelta();
      },

      initPosts() {
        const cmap = loadCommentsMap();
        const lmap = loadLikesMap();
        const decorate = (p) => withTagClass(p, cmap, lmap);
        const base = DEMO_POSTS.map(decorate);
        const localKey = "discussion_local_posts";
        let local = [];
        try {
          local = wx.getStorageSync(localKey) || [];
        } catch (_) {}
        // 合并本地新帖（置顶）+ demo 帖
        const allPosts = [...local.map(decorate), ...base];
        // 最多保留50条本地帖
        if (local.length > 50) {
          local = local.slice(0, 50);
          wx.setStorageSync(localKey, local);
        }
        this.setData({ allPosts });
        this.applyFilter();
      },

      refreshDelta() {
        const { allPosts } = this.data;
        if (!allPosts.length) return;
        const updated = allPosts.map((p) => {
          if (p._isLocal) {
            const delta = Date.now() - p._ts;
            const mins = Math.floor(delta / 60000);
            if (mins < 1) p.time = "刚刚";
            else if (mins < 60) p.time = `${mins}分钟前`;
            else if (mins < 1440) p.time = `${Math.floor(mins / 60)}小时前`;
            else p.time = `${Math.floor(mins / 1440)}天前`;
          }
          return p;
        });
        this.setData({ allPosts: updated });
        this.applyFilter();
      },

      applyFilter() {
        const { allPosts, activeTag } = this.data;
        const posts =
          activeTag === "全部"
            ? [...allPosts]
            : allPosts.filter((p) => p.tag === activeTag);
        // 热门帖排前面
        posts.sort((a, b) => {
          if (a.isHot && !b.isHot) return -1;
          if (!a.isHot && b.isHot) return 1;
          return (b.likeCount || 0) - (a.likeCount || 0);
        });
        this.setData({ posts });
      },

      onTag(e) {
        this.setData({ activeTag: e.currentTarget.dataset.tag });
        this.applyFilter();
      },

      // ── 点赞 ──
      onLike(e) {
        const id = e.currentTarget.dataset.id;
        if (!id) return;
        const lmap = loadLikesMap();
        const nowLiked = !lmap[id];
        if (nowLiked) lmap[id] = true;
        else delete lmap[id];
        saveLikesMap(lmap);
        // 仅更新该帖，避免列表重排跳动
        const bump = (arr) =>
          arr.map((p) =>
            p.id !== id
              ? p
              : { ...p, liked: nowLiked, likeCount: (p.likeBase || 0) + (nowLiked ? 1 : 0) }
          );
        this.setData({
          allPosts: bump(this.data.allPosts),
          posts: bump(this.data.posts),
        });
        wx.vibrateShort && wx.vibrateShort({ type: "light" });
      },

      onTapPost(e) {
        const post = e.currentTarget.dataset.post;
        wx.showModal({
          title: post.title,
          content: post.content || "暂无详细内容",
          showCancel: false,
          confirmText: "知道了",
          confirmColor: "#4db8ff",
        });
      },

      // ── 评论 ──
      openComments(e) {
        this.openCommentsForPost(e.currentTarget.dataset.post);
      },

      openCommentsForPost(post) {
        if (!post) return;
        const cmap = loadCommentsMap();
        this.setData({
          showComments: true,
          activePost: post,
          comments: getComments(post.id, cmap),
          commentInput: "",
        });
        this.setTabBarHidden(true);
      },

      closeComments() {
        this.setData({ showComments: false });
        this.setTabBarHidden(false);
      },

      onCommentInput(e) {
        this.setData({ commentInput: e.detail.value });
      },

      sendComment() {
        const text = (this.data.commentInput || "").trim();
        if (!text) {
          wx.showToast({ title: "请输入评论", icon: "none" });
          return;
        }
        const post = this.data.activePost;
        if (!post) return;
        const cmap = loadCommentsMap();
        const list = cmap[post.id] || [];
        list.push({
          id: "c_" + Date.now(),
          author: currentUserName(),
          content: text,
          time: "刚刚",
          ts: Date.now(),
        });
        cmap[post.id] = list;
        saveCommentsMap(cmap);
        // 评论区展示「预置评论 + 用户评论」，并把 activePost 计数同步
        const merged = getComments(post.id, cmap);
        this.setData({
          comments: merged,
          commentInput: "",
          "activePost.commentCount": merged.length,
        });
        // 刷新列表里的评论数
        this.initPosts();
        wx.showToast({ title: "评论成功", icon: "success" });
      },

      onCommentOverlayTouch() {
        // 阻止评论弹窗底层滚动穿透
      },

      // ── 发布 ──
      openPublish() {
        this.setData({
          showPublish: true,
          pubTitle: "",
          pubContent: "",
          pubTag: "闲聊",
        });
        this.setTabBarHidden(true);
      },

      closePublish() {
        this.setData({ showPublish: false });
        this.setTabBarHidden(false);
      },

      onPubTitle(e) {
        this.setData({ pubTitle: e.detail.value });
      },

      onPubContent(e) {
        this.setData({ pubContent: e.detail.value });
      },

      onPubTag(e) {
        this.setData({ pubTag: e.currentTarget.dataset.tag });
      },

      doPublish() {
        const { pubTitle, pubContent, pubTag } = this.data;
        if (!pubTitle.trim()) {
          wx.showToast({ title: "请输入标题", icon: "none" });
          return;
        }
        if (!pubContent.trim()) {
          wx.showToast({ title: "请输入内容", icon: "none" });
          return;
        }

        const newPost = {
          id: "local_" + Date.now(),
          title: pubTitle.trim(),
          content: pubContent.trim(),
          author: currentUserName(),
          avatar: "",
          time: "刚刚",
          likeCount: 0,
          commentCount: 0,
          tag: pubTag,
          _isLocal: true,
          _ts: Date.now(),
        };

        const localKey = "discussion_local_posts";
        let local = [];
        try {
          local = wx.getStorageSync(localKey) || [];
        } catch (_) {}
        local.unshift(newPost);
        if (local.length > 50) local = local.slice(0, 50);
        wx.setStorageSync(localKey, local);

        // 重新初始化帖子列表
        this.initPosts();
        this.setData({ showPublish: false });
        this.setTabBarHidden(false);
        wx.showToast({ title: "发布成功", icon: "success" });
        // 滚动到顶部显示新帖
        this.setData({ scrollTop: 0 });
      },

      onPublishOverlayTouch() {
        // 阻止弹窗底层滚动穿透
      },

      noop() {},

      onPullDownRefresh() {
        this.initPosts();
        wx.stopPullDownRefresh();
      },

      // 转发给好友/群：带上该帖标题、跳转参数和自定义封面
      onShareAppMessage(res) {
        const imageUrl = "/images/share-cover.png";
        if (res && res.from === "button" && res.target && res.target.dataset.post) {
          const post = res.target.dataset.post;
          return {
            title: post.title,
            path: "/pages/market/market?postId=" + post.id,
            imageUrl,
          };
        }
        return { title: "讨论广场 · 投资交流", path: "/pages/market/market", imageUrl };
      },

      // 分享到朋友圈
      onShareTimeline() {
        return { title: "讨论广场 · 投资交流", imageUrl: "/images/share-cover.png" };
      },
    }
  ),
);
