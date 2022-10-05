const mongoose = require("mongoose");

const customerSchema = mongoose.Schema(
    {
        phone : {
            type: String,
            required: true
        },
        aadhaarFront : {
            type: String,
            required: true
        },
        aadhaarBack : {
            type: String,
            required: true
        },
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
        }
    }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;