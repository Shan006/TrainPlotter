const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const LineRoutes = require("./Routes/LineRoutes");
const DelayRoutes = require("./Routes/DelayRoutes");
const UserRoutes = require("./Routes/UserRoutes");
<<<<<<< HEAD
const TrainRoutes = require("./Routes/TrainRoutes");
const StationRoutes = require("./Routes/StationRoutes");
=======
const ProtectedRoute = require('./Routes/ProtectedRoute')
const {PORT}  = require('./config/config')
const passport = require('passport')

const {setPassport} = require('./Middlewares/passport')
// import postRoutes from './routes/posts.js';
>>>>>>> main

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use(passport.initialize());

app.use("/api/v1", DelayRoutes);
app.use("/api/v1", LineRoutes);
<<<<<<< HEAD
app.use("/api/v1", UserRoutes);
app.use("/api/v1", TrainRoutes);
app.use("/api/v1", StationRoutes);
=======
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/protected", ProtectedRoute);


setPassport(passport)

>>>>>>> main

const CONNECTION_URL =
  "mongodb+srv://train:niart@cluster0.37mrh84.mongodb.net/trainplotter?retryWrites=true&w=majority";

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));
