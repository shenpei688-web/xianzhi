import { Router } from "express";
import { getFundQuotes } from "./fundService.js";

const router = Router();

/** 基金行情：海外基 / 热门基（公开只读，前端可轮询） */
router.get("/quotes", async (req, res, next) => {
  try {
    const fresh =
      req.query.fresh === "1" ||
      req.query.fresh === "true" ||
      req.query.nocache === "1";
    res.setHeader("Cache-Control", "no-store");
    res.json(await getFundQuotes({ fresh }));
  } catch (e) {
    next(e);
  }
});

export default router;
