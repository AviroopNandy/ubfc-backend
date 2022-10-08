const express = require("express");
const app = express();
const crypto = require("crypto");

// Encryption of document -----------------------------------------------------------------------
const secret_key = "uB98XmWr8DJl6jXDEzEQ9y";
const password = "ckEA0FnUTH4rtGv!5F@ARnf";
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

// calling api ---------------------------------------------------------------------
app.get("/digilocker", async (req, res) => {
    let data = {
        s: "ubfc",
        k: "1DCV4E6767453Q876W3Q20DB655SW04S",
        request_id: "asASjkT5H",
        ip: "000.00.00.000",
        ts: await GetTs(new Date())
    }
    encryptData(JSON.stringify(data)).then((response) => {
        const URL = `https://l78q9zougd.execute-api.ap-south-1.amazonaws.com/default/Digilocker_request`;
        res.redirect(`${URL}?s=ubfc&data=${response}`);
    }).catch((err) => {
        res.send(err);
    });
});
async function GetTs(Date){
    let d = Date.toLocaleString("en-GB", {
        timeZone: "Asia/Kolkata"
    });
    let parts = d.split(',')[0].split('/');
    let partsNext = d.split(',')[1].split(':');
    return parts[2] + await twoDigits(parts[1]) + await twoDigits(parts[0])+await twoDigits(partsNext[0])  +await twoDigits(partsNext[1])  +await twoDigits(partsNext[2]);
};
async function twoDigits(d){
    d = parseInt(d);
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}


app.listen(5000);
