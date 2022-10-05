const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = new express.Router();
const Applicant = require("./../models/applicant");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Create a new Applicant :
router.post("/applicants", (req, res) => {
    const newApplicant = new Applicant(req.body);
    newApplicant.save().then((result) => {
        console.log(result);
        res.send(result);
    }).catch((err) => {
        res.send(err);
    })
})

// view all applicants :
router.get("/applicants",  async (req,res)=>{
    Applicant.find({}).then((result) => {
        console.log("Applicants :-> ");
        console.log(result);
        res.send(result);
    }).catch((err) => {
        res.status(400).send({message: err});
    })
})

router.post("/existingApplicants",  async (req,res)=>{
    const {applicantPhone} = req.body;
    Applicant.find({applicantPhone: applicantPhone}).then((result) => {
        console.log("Existing Applicant :-> ");
        console.log(result);
        res.send(result);
    }).catch((err) => {
        res.status(400).send({message: "No Account Found"});
    })
})




// update a particular customer :




// Delete a particular customer :
router.delete("/applicants/:id", function (req, res) {
    var id = req.params.id;
    Applicant.deleteOne({ _id: id }).then((res) => {
        res.send(result);
    }).catch((err) => {
        res.send(err);
    })
})


module.exports = router;