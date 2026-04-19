export default async function handler(req, res) {
  if (req.url === "/api/version" || req.url === "/version") {
    return res.status(200).json({
      status: "ok",
      version: "smtp-lazy-load-2026-04-19",
      timestamp: new Date().toISOString(),
    });
  }

  if (req.url === "/api/health" || req.url === "/health" || req.url === "/") {
    return res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  }

  try {
    const [{ default: app }, { connectDb, getDbStatus }] = await Promise.all([
      import("../src/app.js"),
      import("../src/config/db.js"),
    ]);

    await connectDb();

    if (req.url === "/api/health/db" || req.url === "/health/db") {
      return res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        database: getDbStatus(),
      });
    }

    return app(req, res);
  } catch (error) {
    console.error("Backend function failed", error);
    return res.status(500).json({
      message: "Backend function failed",
      error: error?.message || "Unknown server error",
    });
  }
}
