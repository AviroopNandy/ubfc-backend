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


const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

const corsOptions2 ={
    origin:'https://l78q9zougd.execute-api.ap-south-1.amazonaws.com/default/Digilocker_request', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions2));

app.all('*',function(req, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
})

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(cookieParser());


app.get("/signupPage", (req, res)=>{
    res.render("signup");
})
app.get("/loginPage", (req, res)=>{
    res.render("login");
})

app.get("/", (req, res)=>{
    res.render("login");
})
app.get("/home", auth, (req, res)=>{
    res.render("home");
})

// image document convert to base64 -------------------------------
app.get("/form", (req, res)=>{
    res.render("form");
})

app.post("/document", (req,res)=>{
    let imageUrl = req.body.imageUrl;
    imageToBase64(imageUrl) // Image URL of cloudinary
    .then((response)=>{
        res.send(response);     // base64 encoded image data
    })
    .catch((error) => {
        res.send(error);
    })
})

// Encryption of document =======================================================
const secret_key = "jgfhP1W9kR5BTmQ3nEoYwy";
const password = "6gKu7o5EeQb7SkM7v2!$MUf";
async function encryptData(data){
    try {
        let derived = await deriveKeyAndIv(secret_key ,password );
        const cipher = crypto.createCipheriv('aes-256-cbc', derived.key, derived.iv);
        let encrpted = cipher.update(data, 'utf16le', 'base64');
        // encrpted = cipher;
        encrpted += cipher.final('base64');
	    return encrpted;
    } catch (error) {
        return "";
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
    }
    return hexArr;
}

app.get("/hi", (req, res)=>{
    console.log("/hi called");
    encryptData("https://voteridcard.org.in/wp-content/uploads/2015/06/aadhaar-card-850x1024.jpg").then((response)=>{
        // console.log(response);
        res.send(response);
    });  
})

// ============================================================================
/*
// :::::::::::::::::::::::::::::::::: OCRs ::::::::::::::::::::::::::::::::::::

// PAN OCR --------------------------------------------------------------------
// const panOcrURL = "https://mv0gthimo7.execute-api.ap-south-1.amazonaws.com/default/panocrservice";
const panOcrURL = "https://thisispanOcrURL.com";
let panData="hello";    // in base64 byte array
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
    .then(res => { console.log(res) })
    .catch(err => { console.log(err) })
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
    .then(res => { console.log(res) })
    .catch(err => { console.log(err) })
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
    .then(res => { console.log(res) })
    .catch(err => { console.log(err) })
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
        Imagebyte: aadhaarData
    }),
    method: "POST"
}

fetch(voterOcrURL, voterOcrParams)
    .then(data => { return data.json() })
    .then(res => { console.log(res) })
    .catch(err => { console.log(err) })
// -----------------------------------------------------------------------------
*/


// Join aadhaar front and back ------------------------------------------------
// so just create a post request with aadhaarFront url & aadhaarBack url in "/join" route, you will get merged aadhaar_front, aadhaar_back as response
app.post("/join", async (req, res)=>{
    const aadhaarFront = req.body.imageFront;
    const aadhaarBack = req.body.imageBack;

    let base64Image1 = ``;
    let base64Image2 = ``;
    imageToBase64(aadhaarFront) // Image URL of cloudinary
    .then((response)=>{
        base64Image1 = response;     // base64 encoded image data
    })
    imageToBase64(aadhaarBack) // Image URL of cloudinary
    .then((response)=>{
        base64Image2 = response;     // base64 encoded image data
    })

    setTimeout(() => {
        const mergedImage = mergeImages([base64Image1, base64Image2], {direction: true}).then((response)=>{
            // res.render("result", {RESULT: response});
            res.send(response);
        }).catch((err)=>{
            res.send(err);
        });
    }, 2000);

})

app.use(userRouter);
app.use(customerRouter);
app.use(applicantRouter);

app.listen(5000);