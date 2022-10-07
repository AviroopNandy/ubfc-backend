const mongoose = require("mongoose");

const applicantSchema = mongoose.Schema(
    {
        applicantPhone : {
            type: String,
            required: true
        },
        coapplicantPhone : {
            type: String,
        },
        interestedProducts : [
            {
                productName: String,
                productAmount: String
            }
        ],
        businessType : {
            type: String,
            required: true
        },
        occupationExtra : {
            type: String
        },
        noOfDependents : {
            type: String
        },
        creator : {
            type: String
        },
        status : String
    }
);

const Applicant = mongoose.model("Applicant", applicantSchema);

module.exports = Applicant;