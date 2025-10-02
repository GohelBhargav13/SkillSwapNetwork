import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from "crypto";
import jwt from "jsonwebtoken";
import SkillSwap from './skillswap.model.js';
import { skillStatus } from '../utills/constant.js';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        trim:true,
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        trim:true
    },
    token:{
        type:Number,
        default:0,
        trim:true
    },
    user_avatar:{
        type:String, 
        default:"https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isDisabled:{
        type:Boolean,
        default:false
    },
    emailVerificationToken:{
        type:String
    },
    emailVerificationTokenExpires:{
        type:Date
    },
    passwordResetToken:{
        type:String
    },
    passwordResetTokenExpires:{
        type:Date
    },

},{ timestamps:true })

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({ id:this._id,role:this.role },process.env.JWT_SECRET,
        { expiresIn:process.env.JWT_EXPIRES_IN,algorithm:"HS256"})
}

userSchema.methods.incrementToken = async function(postedUserID,acceptedUserID,postId){
        if(!postedUserID || !acceptedUserID || !postId){
            return { success:false , message:"Invalid ID's" }
        }

        //update the status to COMPLETE
         const updatedPost = await SkillSwap.findByIdAndUpdate(postId,{ $set:{ skillStatus:skillStatus.COMPLETED } },{ new:true })

        //Find both in database
        const updateInPostedUser = await User.findByIdAndUpdate(postedUserID,{ $inc:{ token:10 } },{new:true})
        const updateInAcceptedUser = await User.findByIdAndUpdate(acceptedUserID,{ $inc:{ token:10} },{new:true})

        if(updateInPostedUser && updateInAcceptedUser){
            return { success:true,message: updatedPost };
        }

        return { success:false, message:"User update Failed" }
}

userSchema.methods.generateEmailVerifiactionToken = function(){
    const unhashedToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(unhashedToken).digest("hex");

    const EmailVerificationTokenExpires = Date.now() + 10 * 60 * 1000; //10 minutes
    this.emailVerificationToken = hashedToken;
    this.emailVerificationTokenExpires = EmailVerificationTokenExpires;

    return { unhashedToken,hashedToken,EmailVerificationTokenExpires }
}

userSchema.methods.generateResetPasswordToken = function(){
    const unhashedPasswordToken = crypto.randomBytes(32).toString("hex");
    const hashedPasswordToken = crypto.createHash("sha256").update(unhashedPasswordToken).digest("hex");
    const resetPasswordExpiry = Date.now() + 10 * 60 * 1000; //10 minutes

    return { unhashedPasswordToken,hashedPasswordToken,resetPasswordExpiry } 
}

const User = mongoose.model("User",userSchema)

export default User;