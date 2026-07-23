// IMPORTANT: In ES modules, all `import` statements are hoisted above regular code —
// so a later `import app from ...` would previously load aiController.js (and read
// process.env.GEMINI_API_KEY) BEFORE dotenv.config() had actually run.
// Using the side-effect import form below makes dotenv load synchronously as part of
// the hoisted import phase, in file order, before anything else executes.
import "dotenv/config";

import dns from "node:dns";
// Node's own DNS resolver can fail SRV lookups on some Windows/router/VPN setups
// even though the OS resolver (nslookup) works fine. Forcing a public resolver fixes it.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Server] ExpenseAI API running on port ${PORT} (${process.env.NODE_ENV || "development"})`);
  });
});