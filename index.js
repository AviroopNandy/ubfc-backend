const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userRouter = require("./src/routers/user");
const ejs = require("ejs");

app.set("view engine", "ejs");

require("./src/db/mongoose")

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/signupPage", (req, res)=>{
    res.render("signup");
})
app.get("/loginPage", (req, res)=>{
    res.render("login");
})

app.get("/", (req, res)=>{
    res.render("login");
})
app.get("/home", (req, res)=>{
    res.render("home");
})




app.use(userRouter);

app.listen(3000);