require("dotenv").config();
const express = require("express");
const app = express();
require("./src/db/mongoose")
const bodyParser = require("body-parser");
const userRouter = require("./src/routers/user");
const cookieParser = require("cookie-parser");
const auth = require("./src/middleware/auth");


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(cookieParser());


app.get("/signupPage", (req, res)=>{
    res.render("signup");
})
app.get("/loginPage", (req, res)=>{
    res.render("login");
})

app.get("/", (req, res)=>{
    res.render("login");
})
app.get("/home", auth, (req, res)=>{
    res.render("home");
})




app.use(userRouter);

app.listen(3000);