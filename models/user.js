const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true, "Please enter the Contact Name"]
    },
    email:{
        type:String,
        required:[true, "Please enter the Contact email id"],
        unique: [true, "email address already taken"]
    },
    password:{
        type:String,
        required:[true, "Please enter the password"]
    },
    Isadmin: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true,
});

module.exports = mongoose.model("User" , userSchema); 