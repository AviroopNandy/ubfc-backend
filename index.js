require("dotenv").config();
const express = require("express");
const app = express();
require("./src/db/mongoose")
const bodyParser = require("body-parser");
const userRouter = require("./src/routers/user");
const customerRouter = require("./src/routers/customer");
const applicantRouter = require("./src/routers/applicant");
const cookieParser = require("cookie-parser");
const auth = require("./src/middleware/auth");
const cors = require('cors');
const crypto = require("crypto");
const imageToBase64 = require('image-to-base64');
const mergeImages = require("merge-base64");


const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

const corsOptions_digilocker = {
    origin: 'https://l78q9zougd.execute-api.ap-south-1.amazonaws.com/default/Digilocker_request',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions_digilocker));

const corsOptions_digilocker2 = {
    origin: 'https://main.d4313hpymcmxh.amplifyapp.com/digilocker',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions_digilocker2));

const corsOptions2 = {
    origin: 'https://l78q9zougd.execute-api.ap-south-1.amazonaws.com/default/Digilocker_request/',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions2));

app.all('*', function (req, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(cookieParser());


app.get("/signupPage", (req, res) => {
    res.render("signup");
})
app.get("/loginPage", (req, res) => {
    res.render("login");
})

app.get("/", (req, res) => {
    res.render("login");
})
app.get("/home", auth, (req, res) => {
    res.render("home");
})

// image document convert to base64 -------------------------------
app.get("/form", (req, res) => {
    res.render("form");
})

app.post("/document", (req, res) => {
    let imageUrl = req.body.imageUrl;
    imageToBase64(imageUrl) // Image URL of cloudinary
        .then((response) => {
            res.send(response);     // base64 encoded image data
        })
        .catch((error) => {
            res.send(error);
        })
})

// Encryption of document =======================================================
const secret_key = "jgfhP1W9kR5BTmQ3nEoYwy";
const password = "6gKu7o5EeQb7SkM7v2!$MUf";
async function encryptData(data) {
    try {
        let derived = await deriveKeyAndIv(secret_key, password);
        const cipher = crypto.createCipheriv('aes-256-cbc', derived.key, derived.iv);
        let encrpted = cipher.update(data, 'utf16le', 'base64');
        encrpted += cipher.final('base64');
        return encrpted;
    } catch (error) {
        return error;
    }
}
async function deriveKeyAndIv(secret, hex_pwd) {
    let hex_Arr = await convertToHex(hex_pwd);
    const derivedBytes = crypto.pbkdf2Sync(Buffer.from(secret), Buffer.from(hex_Arr), 1000, 48, 'sha1');
    return {
        key: derivedBytes.slice(0, 32),
        iv: derivedBytes.slice(32, 48)
    }
}
async function convertToHex(str) {
    let hexArr = [];
    try {
        if (str && str.length > 0) {
            for (let i = 0; i < str.length; i++) {
                hexArr.push(String(str[i]).charCodeAt(0))
            }
        }
    } catch (error) {
        console.log(error);
    }
    return hexArr;
}

app.get("/hi", async (req, res) => {
    let data = {
        s: "ubfc",
        k: "1DCV4E6767453Q876W3Q20DB655SW04S",
        request_id: "asASjkT5H",
        ip: "000.00.00.000",
        ts: "20220620121212"
    }
    encryptData(JSON.stringify(data)).then((response) => {
        res.send({ data: response });
    }).catch((err) => {
        res.send(err);
    });

})


// ============================================================================
// :::::::::::::::::::::::::::::::::: OCRs ::::::::::::::::::::::::::::::::::::

/*
// PAN OCR --------------------------------------------------------------------
// const panOcrURL = "https://mv0gthimo7.execute-api.ap-south-1.amazonaws.com/default/panocrservice";
const panOcrURL = "https://thisispanOcrURL.com";
let panData = "hello";    // in base64 byte array
const panOcrParams = {
    headers: {
        "content-type": "application/json",
        "x-api-key": "CWq7uhWC24517Svd51ZRx10gjlV9YohfitQ4ytee",
        "authorizationToken": "Y9K8mqTyY8sSgHy2"
    },
    body: JSON.stringify({
        Imagebyte: panData
    }),
    method: "POST"
}

fetch(panOcrURL, panOcrParams)
    .then(data => { return data.json() })
    .then(response => {
        console.log(response);

        // we need to verify response.name with fullname, response.date_of_birth with dob

        fetch(`/customers/${customer._id}`, {   // we need to pass the _id of customer
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pan_no: response.pan_no
            })
        })

    }).catch(err => {
        console.log(err);
    })
// -----------------------------------------------------------------------------


// Aadhaar OCR --------------------------------------------------------------------
// const aadhaarOcrURL = "https://pwkmxo0g2d.execute-api.ap-south-1.amazonaws.com/default/aadharocrservice";
const aadhaarOcrURL = "https://thisisaadhaarOcrURL.com";
let aadhaarData="hello";    // in base64 byte array
const aadhaarOcrParams = {
    headers: {
        "content-type": "application/json",
        "x-api-key": "qnrDTEsg1p7AXXON0GAvz6z8XDIAMMiw2FLgCdYM",
        "authorizationToken": "zzaHo7HsRl5x9NMR"
    },
    body: JSON.stringify({
        Imagebyte: aadhaarData
    }),
    method: "POST"
}

fetch(aadhaarOcrURL, aadhaarOcrParams)
    .then(data => { return data.json() })
    .then(response => {
        console.log(response);
        let aadhaarAddress = "";
        if(response.item.details.address.house_number && response.item.details.address.house_number.trim() !== ""){
            aadhaarAddress += " "+response.item.details.address.house_number.trim()+" ";
        }
        if(response.item.details.address.line1 && response.item.details.address.line1.trim() !== ""){
            aadhaarAddress += " "+response.item.details.address.line1.trim()+" ";
        }
        if(response.item.details.address.line2 && response.item.details.address.line2.trim() !== ""){
            aadhaarAddress += " "+response.item.details.address.line2.trim()+" ";
        }
        if(response.item.details.address.landmark && response.item.details.address.landmark.trim() !== ""){
            aadhaarAddress += " "+response.item.details.address.landmark.trim()+" ";
        }
        if(response.item.details.address.city && response.item.details.address.city.trim() !== ""){
            aadhaarAddress += " "+response.item.details.address.city.trim()+" ";
        }
        if(response.item.details.address.district && response.item.details.address.district.trim() !== ""){
            aadhaarAddress += " "+response.item.details.address.district.trim()+" ";
        }
        if(response.item.details.address.state && response.item.details.address.state.trim() !== ""){
            aadhaarAddress += " "+response.item.details.address.state.trim()+" ";
        }
        if(response.item.details.address.pin && response.item.details.address.pin.trim() !== ""){
            aadhaarAddress += " "+response.item.details.address.pin.trim()+" ";
        }

        // we need to store this avatar base64, aadhaar_url in AWS
        fetch(`/customers/${customer._id}`, {   // we need to pass the _id of customer
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullname: response.item.details.name.value,
                dob: response.item.details.dob,
                care_of: response.item.details.address.care_of,
                gender: response.item.details.gender.value,
                avatar: response.item.details.face.faceString,
                address: aadhaarAddress,
                documents: {
                    aadhaar_url: response.item.details.aadhaar.masked_value
                },
                //  should we store the aadhaar value?
            })
        })
    }).catch(err => {
        console.log(err)
    })
// -----------------------------------------------------------------------------
// Driving License OCR --------------------------------------------------------------------
// const drivingOcrURL = "https://0gpvsrcho2.execute-api.ap-south-1.amazonaws.com/default/DrivingLicenseService-API";
const drivingOcrURL = "https://thisisdrivingOcrURL.com";
let drivingData="hello";    // in base64 byte array
const drivingOcrParams = {
    headers: {
        "content-type": "application/json",
        "x-api-key": "gmVwHvdl2u3udNOtYC6eIFKciUUKFTP7usvxIS07",
        "authorizationToken": "vED0Abl2N513c5PI"
    },
    body: JSON.stringify({
        Imagebyte: drivingData
    }),
    method: "POST"
}

fetch(drivingOcrURL, drivingOcrParams)
    .then(data => { return data.json() })
    .then(response => {
        console.log(response);

        // we need to verify respponse.Name with fullname, response.DOB with dob

        let drivingAddress = "";
        if(response.Address && response.Address.trim() !== ""){
            drivingAddress += " "+response.Address.trim()+" ";
        }
        if(response.Pincode && response.Pincode.trim() !== ""){
            drivingAddress += " "+response.Pincode.trim()+" ";
        }
        if(response.District_Name && response.District_Name.trim() !== ""){
            drivingAddress += " "+response.District_Name.trim()+" ";
        }
        if(response.Statename && response.Statename.trim() !== ""){
            drivingAddress += " "+response.Statename.trim()+" ";
        }

        fetch(`/customers/${customer._id}`, {   // we need to pass the _id of customer
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                driving_details: {
                    driving_license_no: response.Driving_License_No,
                    date_of_issue: response.Date_of_Issue,
                    validity_nt: response.Validity_NT,
                    validity_t: response.Validity_T,
                    class_of_vehicle: response.Class_Of_Vehicle,
                    address: drivingAddress
                }
            })
        })
    }).catch(err => {
        console.log(err);
    })
// -----------------------------------------------------------------------------

// VoterID OCR --------------------------------------------------------------------
// const voterOcrURL = "https://w9et7fvjeg.execute-api.ap-south-1.amazonaws.com/default/VoterId_Ocr_Service";
const voterOcrURL = "https://thisisvoterOcrURL.com";
let voterData="hello";    // in base64 byte array
const voterOcrParams = {
    headers: {
        "content-type": "application/json",
        "x-api-key": "0wUkJbGlMl2jJiwa6g2322ceBvicUnEE5zF70Oqm",
        "authorizationToken": "1c2j312ZOgLGJf4v"
    },
    body: JSON.stringify({
        Imagebyte: voterData
    }),
    method: "POST"
}

fetch(voterOcrURL, voterOcrParams)
    .then(data => { return data.json() })
    .then(response => {
        console.log(response);

        // we need to verify respponse.Name with fullname, response.Gender with gender, response.DOB with dob

        let voterAddress = "";
        if(response.Address && response.Address.trim() !== ""){
            voterAddress += " "+response.Address.trim()+" ";
        }
        if(response.District && response.District.trim() !== ""){
            voterAddress += " "+response.District.trim()+" ";
        }
        if(response.State && response.State.trim() !== ""){
            voterAddress += " "+response.State.trim()+" ";
        }
        if(response.Pin_Code && response.Pin_Code.trim() !== ""){
            voterAddress += " "+response.Pin_Code.trim()+" ";
        }

        fetch(`/customers/${customer._id}`, {   // we need to pass the _id of customer
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                voter_details: {
                    voter_id: response.Voter_ID,
                    address: voterAddress
                }
            })
        })
    }).catch(err => {
        console.log(err);
    })
*/
// -----------------------------------------------------------------------------

// Join aadhaar front and back ------------------------------------------------
// so just create a post request with aadhaarFront url & aadhaarBack url in "/join" route, you will get merged aadhaar_front, aadhaar_back as response
app.post("/join", async (req, res) => {
    const aadhaarFront = req.body.imageFront;
    const aadhaarBack = req.body.imageBack;

    let base64Image1 = ``;
    let base64Image2 = ``;
    imageToBase64(aadhaarFront) // Image URL of cloudinary
        .then((response) => {
            base64Image1 = response;     // base64 encoded image data
        })
    imageToBase64(aadhaarBack) // Image URL of cloudinary
        .then((response) => {
            base64Image2 = response;     // base64 encoded image data
        })

    setTimeout(() => {
        const mergedImage = mergeImages([base64Image1, base64Image2], { direction: true }).then((response) => {
            // res.render("result", {RESULT: response});
            res.send(response);
        }).catch((err) => {
            res.send(err);
        });
    }, 2000);

})

app.use(userRouter);
app.use(customerRouter);
app.use(applicantRouter);

app.listen(5000);