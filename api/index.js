const express = require("express");
const cookieParser = require('cookie-parser');
// const session = require('express-session');
const cors = require('cors');
const connection = require("./config/database");
const userRoute = require("./routes/user.route.js");
const userAuth = require("./routes/auth.route.js");
const postRoute = require('./routes/post.route.js');
const commentRoute = require("./routes/comment.route.js");
const { handleError } = require("./middleware/error.handle.js");
require("dotenv").config();

const app = express();
const { PORT, FRONTEND_URL } = process.env;
connection
  .then(() => {
    console.log("Database Connected!");
  })
  .catch((err) => {
    console.log("Error Happened", err);
  });

app.use(express.json());
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}))

app.use(cookieParser());
/*app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true, // Set true if using HTTPS
    httpOnly: true,
    sameSite: 'None'
  }
}));*/

app.use("/api/user", userRoute);
app.use("/api/auth", userAuth);
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoute);

app.use(handleError);

app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
