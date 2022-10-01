const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// create user ------------------------------------
router.post("/users", (req, res)=>{
    const newUser = new User(req.body);
    newUser.save().then((result)=>{
        // res.send(result);
        console.log(result);
        // res.redirect("/loginPage");
        res.send(result);
    }).catch((err)=>{
        res.send(err);
    })
})


// read all users ----------------------------------
router.get("/users", function (req, res) {
    User.find({}).then( (result) => {
        res.send(result);
    }).catch((err) => {
        res.send(err);
    })
})

// read a particular user --------------------------
router.get("/users/:id", (req, res) => {
    var id = req.params.id;
    User.find({ _id: id }).then(function (result) {

        if (!result) {
            res.send("User not found");
        }

        res.send(result);
    }).catch((err) => {
        res.send(err);
    })

})

// update a particular user -------------------------
router.patch("/users/:id", async function (req, res) {
    const updates = Object.keys(req.body);
    const allowedUpdates = [ "password"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Updates!" });
    }
    try {
        const updatedUser = await User.findById(req.params.id);
        updates.forEach((update) => updatedUser[update] = req.body[update]);
        await updatedUser.save();

        if (!updatedUser) {
            res.send("User not found in database");
        }
        res.send(updatedUser);
    }
    catch (error) {
        res.status(400).send(error);
    }

})

// delete a particular user --------------------------
router.delete("/users/:id", function (req, res) {
    var id = req.params.id;
    User.deleteOne({ _id: id }).then((res) => {
        res.send(result);
    }).catch((err) => {
        res.send(err);
    })
})

// Login a user ======================================
router.post("/users/login", async (req, res) => {
    try {
        console.log(req.body);
        const authenticatedUser = await User.checkLoginCredentials(req.body.userid, req.body.password);
        const token = await authenticatedUser.generateAuthTokens();

        res.cookie("UBFC", token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true
        })
        console.log("Logged in");
        // res.redirect("/home");
        res.send(token);
    }
    catch (err) {
        console.log(err);
        console.log("Error.. login failed");
        res.status(403).send("Error.... Login Failed");
    }
})

// logout a user :
router.get("/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((currElement) => {
            return currElement.token !== req.cookies.UBFC;
        })
        await req.user.save();
        res.clearCookie("UBFC");
        res.send({message: "Successfully Logged Out"});
    }
    catch (error) {
        res.status(400).send(error);
    }
})

//logout of all devices
router.get("/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.clearCookie("UBFC");
        res.redirect("/loginPage");
    }
    catch (error) {
        res.status(400).send(err);
    }
})

// // read profile :
// router.get("/user/:id", async (req, res) => {
//     const userId = req.params.id;
//     User.find({_id: userId}).then((response)=>{
//         if(!response){
//             res.send({message: "User Not Found"});
//         }
//         res.send(response);
//     }).catch((err)=>{
//         res.send(err);
//     })
// })

// find user id from token
router.get("/tokens/:id", async (req, res)=>{
    const tokenId = req.params.id;
    const JWT_SECRET = process.env.JWT_SECRET;

    try{
        const decoded = jwt.verify(tokenId, JWT_SECRET);

        const authUser = await User.findOne({_id: decoded._id, "tokens.token": tokenId});

        if(!authUser){
            throw new Error("Please Authenticate!... You are not logged in");
        }
        res.send(authUser._id);
    }
    catch(err){
        res.status(403).send({message: "Session Expired"});
    }
})










module.exports = router;