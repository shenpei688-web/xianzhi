import {
  buildDemoFundQuotes,
  jitterFundQuotes,
  type FundQuotesData,
  type FundIndexQuote,
  type FundHeroQuote,
} from "../shared/data/funds.js";

const CACHE_TTL_MS = Number(process.env.FUND_CACHE_TTL_MS) || 30_000;
const FETCH_TIMEOUT_MS = 3_500;

const EM_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Referer: "https://quote.eastmoney.com/",
  Accept: "application/json, text/plain, */*",
};

let cache: { at: number; data: FundQuotesData } | null = null;
let refreshing = false;

interface QuoteRaw {
  changePercent: number;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** 东方财富指数当前价/涨跌幅；secid 形如 100.DJIA / 100.NDX */
async function fetchIndexChangePct(secid: string): Promise<QuoteRaw | null> {
  try {
    const url = `https://push2.eastmoney.com/api/qt/stock/get?secid=${encodeURIComponent(
      secid,
    )}&fields=f43,f60,f170&fltt=2`;
    const res = await fetch(url, {
      headers: EM_HEADERS,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      rc?: number;
      data?: { f43?: number; f60?: number; f170?: number };
    };
    if (json.rc !== 0 || json.data?.f43 == null) return null;
    let pct = Number(json.data.f170);
    if (!Number.isFinite(pct)) {
      const price = Number(json.data.f43);
      const prev = Number(json.data.f60 ?? price);
      if (!prev) return null;
      pct = ((price - prev) / prev) * 100;
    }
    if (Math.abs(pct) > 50) pct = pct / 100;
    return { changePercent: round2(pct) };
  } catch {
    return null;
  }
}

/** 东方财富开放式基金净值估算（jsonp 接口） */
async function fetchFundChangePct(code: string): Promise<QuoteRaw | null> {
  const id = code.replace(/^of/i, "");
  try {
    const url = `https://fundgz.1234567.com.cn/js/${id}.js?rt=${Date.now()}`;
    const res = await fetch(url, {
      headers: EM_HEADERS,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const text = await res.text();
    const m = text.match(/jsonpgz\(({[^}]+})\)/);
    if (!m?.[1]) return null;
    const obj = JSON.parse(m[1]) as { gszzl?: string };
    const pct = Number(obj.gszzl);
    if (!Number.isFinite(pct)) return null;
    return { changePercent: round2(pct) };
  } catch {
    return null;
  }
}

/** 抓取纳指大盘卡片所需的完整行情（现价/涨跌/最高最低/成交量） */
async function fetchIndexHero(
  secid: string,
): Promise<Pick<
  FundHeroQuote,
  "price" | "changePercent" | "changeAmount" | "high" | "low" | "volume"
> | null> {
  try {
    const url = `https://push2.eastmoney.com/api/qt/stock/get?secid=${encodeURIComponent(
      secid,
    )}&fields=f43,f44,f45,f47,f60,f169,f170&fltt=2`;
    const res = await fetch(url, {
      headers: EM_HEADERS,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      rc?: number;
      data?: {
        f43?: number;
        f44?: number;
        f45?: number;
        f47?: number;
        f60?: number;
        f169?: number;
        f170?: number;
      };
    };
    const d = json.data;
    if (json.rc !== 0 || d?.f43 == null) return null;
    const price = Number(d.f43);
    const prev = Number(d.f60 ?? price);
    let pct = Number(d.f170);
    if (!Number.isFinite(pct) && prev) pct = ((price - prev) / prev) * 100;
    if (Math.abs(pct) > 50) pct = pct / 100;
    let amount = Number(d.f169);
    if (!Number.isFinite(amount)) amount = price - prev;
    return {
      price: round2(price),
      changePercent: round2(pct),
      changeAmount: round2(amount),
      high: round2(Number(d.f44 ?? price)),
      low: round2(Number(d.f45 ?? price)),
      volume: Number(d.f47 ?? 0),
    };
  } catch {
    return null;
  }
}

const INDEX_SECID: Record<string, string> = {
  dji: "100.DJIA",
  ixic: "100.NDX",
  ndx: "100.NDX",
  spx: "100.SPX",
  sh: "1.000001",
  sz: "0.399001",
  cyb: "0.399006",
  hs300: "1.000300",
};

/** 每个 Tab 对应的大盘指数：海外基→纳指100 / 热门基→上证指数 */
const TAB_HERO_SECID: Record<string, string> = {
  overseas: "100.NDX",
  hot: "1.000001",
};

async function fetchLiveQuotes(): Promise<FundQuotesData | null> {
  const demo = buildDemoFundQuotes();
  let heroLiveCount = 0;
  try {
    const tabs = await Promise.all(
      demo.tabs.map(async (tab) => {
        const indices = await Promise.all(
          tab.indices.map(async (idx): Promise<FundIndexQuote> => {
            const secid = INDEX_SECID[idx.id];
            if (!secid) return idx;
            const live = await fetchIndexChangePct(secid);
            return live ? { ...idx, changePercent: live.changePercent } : idx;
          }),
        );
        const funds = await Promise.all(
          tab.funds.map(async (f) => {
            const live = await fetchFundChangePct(f.id);
            return live ? { ...f, changePercent: live.changePercent } : f;
          }),
        );
        const heroSecid = TAB_HERO_SECID[tab.key];
        const heroLive = heroSecid ? await fetchIndexHero(heroSecid) : null;
        if (heroLive) heroLiveCount += 1;
        const hero: FundHeroQuote = heroLive
          ? { ...tab.hero, ...heroLive }
          : tab.hero;
        return { ...tab, indices, funds, hero };
      }),
    );
    const anyLive =
      heroLiveCount > 0 ||
      tabs.some(
        (t, ti) =>
          t.indices.some(
            (idx, i) => idx.changePercent !== demo.tabs[ti].indices[i].changePercent,
          ) ||
          t.funds.some(
            (f, i) => f.changePercent !== demo.tabs[ti].funds[i].changePercent,
          ),
      );
    if (!anyLive) return null;
    return {
      updatedAt: new Date().toISOString(),
      source: "live",
      pageSize: demo.pageSize,
      tabs,
    };
  } catch {
    return null;
  }
}

async function refreshInBackground(): Promise<void> {
  if (refreshing) return;
  refreshing = true;
  try {
    const live = await fetchLiveQuotes();
    if (live) cache = { at: Date.now(), data: live };
  } finally {
    refreshing = false;
  }
}

export async function getFundQuotes(opts?: { fresh?: boolean }): Promise<FundQuotesData> {
  const now = Date.now();

  if (!opts?.fresh && cache && now - cache.at < CACHE_TTL_MS) {
    return cache.data;
  }

  if (cache) {
    void refreshInBackground();
    return cache.data;
  }

  const live = await fetchLiveQuotes();
  if (live) {
    cache = { at: now, data: live };
    return live;
  }

  const demo = jitterFundQuotes(buildDemoFundQuotes());
  cache = { at: now, data: demo };
  void refreshInBackground();
  return demo;
}
