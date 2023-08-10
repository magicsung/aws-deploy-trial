const express = require("express");
const app = express();

const { engine } = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// console.log(process.env.SESSION_SECRET)
const passport = require("./config/passport");//有設置環境變數 要放在設置環境變數後面
const router = require("./routes");
const messageHandler = require("./middlewares/message-handler");
const errorHandlerMiddleware = require("./middlewares/error-handler middleware");

app.engine(".hbs", engine({ extname: ".hbs" }));

app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(messageHandler);

app.use(router);

app.use(errorHandlerMiddleware);

app.listen(process.env.PORT, () => {
  console.log("Click : http://localhost:3000/");
});
