const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = new express.Router();
const User = require("../models/user");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// create user ------------------------------------
router.post("/users", (req, res)=>{
    const newUser = new User(req.body);
    newUser.save().then((result)=>{
        // res.send(result);
        res.redirect("/loginPage");
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


module.exports = router;