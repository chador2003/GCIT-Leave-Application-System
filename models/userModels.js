const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide your email'],
    },
    email:{
        type:String,
        required: [true, 'please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide your email']
    },
    password:{
        type:String,
        required: [true, 'please provide your password!'],
        minlength: 8,
        select: false,
    },
    passwordConfirm:{
            type:String,
            required: [true, "please confirm your password"],
            //This only works on SAVE!!!
            validate: function (el){
                return el === this.password
            },
            message: 'Passwords are not the same',
    },
    gender: {
        type:String,
    },
    verified:{
        type: Boolean,
        default:false
    }
})

userSchema.pre('save', async function(next){
    // Only run this function oif password was actually modified
    if (!this.isModified('password'))return next()

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12)

    //Delete passwordConfirm field
    this.passwordConfirm = undefined
})
userSchema.pre('findOneAndUpdate', async function (next){
    const update = this.getUpdate();
    if (update.passowrd !== '' &&
        update.password !== undefined &&
        update.password == update.passwordConfirm){
        
        //Hash the password with cost of 12
        this.getUpdate().password = await bcrypt.hash(update.password, 12)

        // Delete passwordConfirm field
        update.passwordConfirm = undefined
        next()

    }else
    next()
})

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword,
){
    return await bcrypt.compare(candidatePassword, userPassword)
}

// Add validation using Joi
// const validateUser = (user) => {
//     const schema = Joi.object({
//       name: Joi.string().min(3).max(255).required(),
//       email: Joi.string().email().required(),
//       password: Joi.string().min(8).required(),
//       passwordConfirm: Joi.string().valid(Joi.ref('password')).required(),
//       gender: Joi.string().required(),
//     });
//     return schema.validate(user);
//   };

const User = mongoose.model('User', userSchema);
module.exports = User;