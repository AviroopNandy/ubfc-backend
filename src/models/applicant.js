const mongoose = require("mongoose");

const applicantSchema = mongoose.Schema(
    {
        applicantPhone : {
            type: String,
            required: true
        },
        coapplicantPhone : {
            type: String,
            required: true
        },
        interestedProducts : [
            {
                type: String
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
        }
    }
);

const Applicant = mongoose.model("Applicant", applicantSchema);

module.exports = Applicant;