const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
    {
        userid: {
            type: String
        },
        phone: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    }
)


userSchema.statics.checkLoginCredentials = async (email,pass)=> {
    const registeredUser = await User.findOne({email : email});
    if(!registeredUser){
        throw new Error("Authentication Failed... User not registered");
    }
    const isMatch = await bcrypt.compare(pass, registeredUser.password);

    if(!isMatch){
        throw new Error("Authentication failed... Password mismatched");
    }

    return registeredUser;
}


// hashing password before saving user in db
userSchema.pre("save", async function(next){
    const user = this;

    if(user.isModified("password")){    // if user creates an account or change their password..only that time the pass should be hashed
        user.password = await bcrypt.hash(user.password, 8);    // salting round = 8
    }

    next();
})




const User = mongoose.model("User", userSchema);

module.exports = User;