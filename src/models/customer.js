const mongoose = require("mongoose");

const customerSchema = mongoose.Schema(
    {
        phone : {
            type: String,
            required: true
        },
        aadhaarNumber: {
            type: String
        },
        aadhaarFront : {    // it will be deleted
            type: String
        },
        aadhaarBack : {     // it will be deleted
            type: String,
        },
        aadhaarMerged: String,
        aadhaarMasked: String,
        aadhaarLinked : {
            type: String,
            required: true
        },
        secondaryID_type : {
            type: String,
            required: true
        },
        secondaryID : {
            type: String,
            required: true
        },
        creator : {
            type: String
        },
        dob : String,
        fullname : String,
        care_of : String,
        gender : String,
        avatar : String,
        address : {
            city: String,
            district: String,
            pin: String,
            state: String,
        },
        pan_no : String,
        driving_details: {
            driving_license_no: String,
            date_of_issue: String,
            validity_nt: String,
            validity_t: String,
            class_of_vehicle: String,
            address: String
        },
        voter_details: {
            voter_id: String,
            address: String
        },
        documents: {
            aadhaar_url: String,
            pan_url: String
        }
    }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;