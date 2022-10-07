const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = new express.Router();
// const auth = require("../middleware/auth");
const Customer = require("./../models/customer");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Create a new Customer :
router.post("/customers", (req, res) => {
    const newCustomer = new Customer(req.body);
    newCustomer.save().then((result) => {
        console.log(result);
        // res.send({message: "New Customer created successfully"});
        res.send(result);
    }).catch((err) => {
        res.send(err);
    })
})

// view all customers :
router.get("/customers",  async (req,res)=>{
    Customer.find({}).then((result) => {
        console.log("Result :-> ");
        console.log(result);
        res.send(result);
    }).catch((err) => {
        res.status(400).send({message: err});
    })
})

router.post("/existingCustomers",  async (req,res)=>{
    const {applicantPhone} = req.body;
    Customer.find({applicantPhone: applicantPhone}).then((result) => {
        console.log("Result :-> ");
        console.log(result);
        res.send(result);
    }).catch((err) => {
        res.status(400).send({message: "No Account Found"});
    })
})




// update a particular customer :
router.patch("/customers/:id", async function (req, res) {
    const updates = Object.keys(req.body);
    const allowedUpdates = [ "aadhaarFront", "aadhaarBack", "aadhaarLinked", "secondaryID_type", "secondaryID", "dob", "fullname", "care_of", "gender", "avatar", "address", "pan_no", "driving_details", "voter_details", "documents"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Updates!" });
    }
    try {
        const updatedCustomer = await Customer.findById(req.params.id);
        if (!updatedCustomer) {
            res.send("Customer not found in database");
        }

        updates.forEach((update) => updatedCustomer[update] = req.body[update]);
        await updatedCustomer.save();
        res.send(updatedCustomer);
    }
    catch (err) {
        res.status(400).send(err);
    }

})



// Delete a particular customer :
router.delete("/customers/:id", function (req, res) {
    var id = req.params.id;
    Customer.deleteOne({ _id: id }).then((res) => {
        res.send(result);
    }).catch((err) => {
        res.send(err);
    })
})


module.exports = router;