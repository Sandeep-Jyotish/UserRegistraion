const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", (error) =>
  console.error("MongoDB connection error:", error)
);
mongoose.connection.once("open", () =>
  console.log("MongoDB connected successfully.")
);

// Routes
app.use("/api", require("./routes/userRoutes"));
app.use("/api", require("./routes/authRoutes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
