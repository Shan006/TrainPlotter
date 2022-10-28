const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const LineRoutes = require("./Routes/LineRoutes");
const DelayRoutes = require("./Routes/DelayRoutes");
const UserRoutes = require("./Routes/UserRoutes");
const {PORT}  = require('./config/config')

// import postRoutes from './routes/posts.js';

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/api/v1", DelayRoutes);
app.use("/api/v1", LineRoutes);
app.use("/api/v1", UserRoutes);

const CONNECTION_URL =
  "mongodb+srv://train:niart@cluster0.37mrh84.mongodb.net/trainplotter?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));
