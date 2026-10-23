const mongoose = require ('mongoose')

const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true, },
    phonenumber: { type: String, default: "" },
    password: { type: String, required: true, select:false},
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    // isVerified : {type: Boolean, default: false},
    // verificationToken : {type: String},
    tag: {type: String, sparse:true, unique:true},
    role: { type: String, default: "user", enum: ["user", "driver", "admin"]},

}, {timestamps: true, strict: "throw" })

const UserModel = mongoose.model('user', UserSchema)
module.exports = UserModel