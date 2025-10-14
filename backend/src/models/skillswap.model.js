import mongoose from "mongoose"
import { availableSkillStatus, skillStatus } from "../utills/constant.js"

const SkillSwapSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Title is required"],
        trim:true
    },
    postUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    wantSkills:[
        {type:String,trim:true,required:true}
    ],
    offerSkills:[
        {type:String,trim:true,required:true}
    ],

    skillStatus:{
        type:String,
        enum:availableSkillStatus,
        default:skillStatus.OPEN
    },
    acceptedUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    images:{ type:[String], required:false }

},{ timestamps:true })

const SkillSwap = mongoose.model("SkillSwap",SkillSwapSchema)
export default SkillSwap