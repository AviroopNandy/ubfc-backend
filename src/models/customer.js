const mongoose = require("mongoose");

const customerSchema = mongoose.Schema(
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
        loanAmount : {
            type: String
        },
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
        applicant_aadhaarFront : {
            type: String,
            required: true
        },
        applicant_aadhaarBack : {
            type: String,
            required: true
        },
        applicant_aadhaarLinked : {
            type: String,
            required: true
        },
        applicant_secondaryID_type : {
            type: String,
            required: true
        },
        applicant_secondaryID : {
            type: String,
            required: true
        },
        coapplicant_aadhaarFront : {
            type: String,
            required: true
        },
        coapplicant_aadhaarLinked : {
            type: String,
            required: true
        },
        coapplicant_aadhaarBack : {
            type: String,
            required: true
        },
        coapplicant_secondaryID_type : {
            type: String,
            required: true
        },
        coapplicant_secondaryID : {
            type: String,
            required: true
        }
    }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;