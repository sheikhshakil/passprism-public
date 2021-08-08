require("dotenv").config();
const express = require("express");
//custom libs
const router = require("./routes/routes.js");
const setMiddlewares = require("./middlewares/middlewares");

//creating app
const app = express();

//-----------------------start coding-----------------------------
app.set("view engine", "ejs");
app.set("views", "views");

//setting middlewares
setMiddlewares(app);

app.use("/", router);

const PORT = process.env.PORT;

app.listen(PORT, (req, res) => {
  console.log("App started!");
});
