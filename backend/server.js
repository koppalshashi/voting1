const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ✅ Enable CORS for all origins (you can restrict later)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


mongoose.connect("mongodb+srv://shashistudy2125:shashi@cluster0.of0ap6g.mongodb.net/grocery_auth_app?retryWrites=true&w=majority")
// mongoose.connect("mongodb+srv://shashistudy2125:Shashi%402003@cluster0.of0ap6g.mongodb.net/grocery_auth_app?retryWrites=true&w=majority")
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/vote", require("./routes/voteRoutes"));
app.use("/api/results", require("./routes/resultRoutes"));
app.use("/api/candidates", require("./routes/candidateRoutes"));
app.use("/api/form-sync", require("./routes/formSyncRoutes"));

// ✅ Health check route (optional but useful for Render)
app.get("/", (req, res) => {
  res.send("Voting API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

