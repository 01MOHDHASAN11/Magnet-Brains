const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    Name:String,
    Email:String,
    Number:String,
    Password:String,
    tokenExpiry:{type:Date,default:null},
    resetToken:{type:String,default:null}
})

const admindb = mongoose.model('admin',userSchema)

module.exports=admindb