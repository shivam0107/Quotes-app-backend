const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const app = express();


const userRoute = require("./routes/userRoute");

const database = require("./config/database");
const cors = require("cors");
//db connect
database.connect();

// app.use(cors({ origin: "http://localhost:3000", credentials: true }));


app.use(express.json());

app.use("/api/v1/auth", userRoute);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
