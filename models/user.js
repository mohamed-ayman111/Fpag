const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: {
        type : String ,
        required : [true ,"Username is required."] ,
        minlength : 3 ,
        maxlength : 20
    },
    email: {
        type : String ,
        required : [true ,"Email is reqired."],
        unique : true
    },
    password: {
        type : String ,
        required : [true,"password is required."]
    }
});
module.exports = mongoose.model("User", userSchema);