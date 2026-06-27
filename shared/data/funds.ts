/** 基金行情 — 前后端共用类型与种子数据 */

export type FundTabKey = "overseas" | "hot";

export interface FundIndexQuote {
  id: string;
  name: string;
  /** 当前日内涨跌幅（百分比） */
  changePercent: number;
}

export interface FundQuoteItem {
  id: string;
  name: string;
  /** 日内涨跌幅（百分比） */
  changePercent: number;
}

export interface FundTabData {
  key: FundTabKey;
  label: string;
  indices: FundIndexQuote[];
  funds: FundQuoteItem[];
  /** 该 Tab 对应的大盘卡片（海外基→纳指 / 热门基→上证） */
  hero: FundHeroQuote;
}

/** 大盘『大盘卡片』：现价 / 涨跌 / 最高最低 / 成交量 */
export interface FundHeroQuote {
  id: string;
  name: string;
  code: string;
  /** 最新价 */
  price: number;
  /** 日内涨跌幅（百分比） */
  changePercent: number;
  /** 日内涨跌额 */
  changeAmount: number;
  high: number;
  low: number;
  /** 成交量（股） */
  volume: number;
}

export interface FundQuotesData {
  updatedAt: string;
  source: "live" | "demo";
  tabs: FundTabData[];
  /** 分页：每页条数（小程序按页切换显示） */
  pageSize: number;
}

export const FUND_PAGE_SIZE = 8;

export const FUND_TAB_LABELS: Record<FundTabKey, string> = {
  overseas: "海外基",
  hot: "热门基",
};

/** 顶部四大指数（海外、热门 Tab 当前共用同一组指数） */
const OVERSEAS_INDEX_SEED: FundIndexQuote[] = [
  { id: "dji", name: "道琼斯", changePercent: 1.52 },
  { id: "ixic", name: "纳斯达克", changePercent: -0.01 },
  { id: "ndx", name: "纳指100", changePercent: 0.81 },
  { id: "spx", name: "标普500", changePercent: 0.58 },
];

const HOT_INDEX_SEED: FundIndexQuote[] = [
  { id: "sh", name: "上证", changePercent: 0.46 },
  { id: "sz", name: "深证", changePercent: 0.92 },
  { id: "cyb", name: "创业板", changePercent: 1.21 },
  { id: "hs300", name: "沪深300", changePercent: 0.34 },
];

const OVERSEAS_FUND_SEED: FundQuoteItem[] = [
  { id: "of539003", name: "建信新兴市场混合", changePercent: 3.7 },
  { id: "of006881", name: "长城全球新能源车", changePercent: 2.36 },
  { id: "of012348", name: "天弘全球高端制造混合", changePercent: 2.1 },
  { id: "of270023", name: "广发全球精选", changePercent: 2.83 },
  { id: "of006308", name: "浦银安盛全球智能科技", changePercent: 1.28 },
  { id: "of000041", name: "华夏全球科技先锋混合", changePercent: 2.8 },
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

const HOT_FUND_SEED: FundQuoteItem[] = [
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

/** 海外基大盘：纳斯达克100 */
const OVERSEAS_HERO_SEED: FundHeroQuote = {
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

/** 热门基大盘：上证指数 */
const HOT_HERO_SEED: FundHeroQuote = {
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

export function buildDemoFundQuotes(): FundQuotesData {
  return {
    updatedAt: new Date().toISOString(),
    source: "demo",
    pageSize: FUND_PAGE_SIZE,
    tabs: [
      {
        key: "overseas",
        label: FUND_TAB_LABELS.overseas,
        indices: OVERSEAS_INDEX_SEED,
        funds: OVERSEAS_FUND_SEED,
        hero: { ...OVERSEAS_HERO_SEED },
      },
      {
        key: "hot",
        label: FUND_TAB_LABELS.hot,
        indices: HOT_INDEX_SEED,
        funds: HOT_FUND_SEED,
        hero: { ...HOT_HERO_SEED },
      },
    ],
  };
}

/** 给基础种子值加上一点随机浮动，模拟实时跳动 */
function jitterPercent(base: number): number {
  const noise = (Math.random() - 0.5) * 0.35;
  return Math.round((base + noise) * 100) / 100;
}

function jitterHero(h: FundHeroQuote): FundHeroQuote {
  const noise = (Math.random() - 0.5) * 0.3;
  const price = Math.round(h.price * (1 + noise / 100) * 100) / 100;
  return {
    ...h,
    price,
    changePercent: Math.round((h.changePercent + noise) * 100) / 100,
    changeAmount: Math.round((price - h.price + h.changeAmount) * 100) / 100,
  };
}

export function jitterFundQuotes(data: FundQuotesData): FundQuotesData {
  return {
    ...data,
    updatedAt: new Date().toISOString(),
    tabs: data.tabs.map((t) => ({
      ...t,
      hero: jitterHero(t.hero),
      indices: t.indices.map((i) => ({ ...i, changePercent: jitterPercent(i.changePercent) })),
      funds: t.funds.map((f) => ({ ...f, changePercent: jitterPercent(f.changePercent) })),
    })),
  };
}
