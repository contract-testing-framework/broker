import express from "express";
import "express-async-errors";
import sseResponses from "../../services/sse.js";

const router = express.Router();

const headers = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
};

router.get("/", async (req, res) => {
  res.writeHead(200, headers);
  sseResponses.add(res);

  req.on("close", () => {
    sseResponses.remove(res);
  });
});

export default router;
export { sseResponses };
