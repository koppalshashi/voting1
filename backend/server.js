const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

// ✅ Load env variables from project root
dotenv.config({ path: path.join(__dirname, "../.env") });

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Enable CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/vote", require("./routes/voteRoutes"));
app.use("/api/results", require("./routes/resultRoutes"));
app.use("/api/candidates", require("./routes/candidateRoutes"));
app.use("/api/form-sync", require("./routes/formSyncRoutes"));

// ✅ Serve frontend (if you put files in /public)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Health check route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Catch-all (for React/SPA routing support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
