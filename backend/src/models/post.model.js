import mongoose from "mongoose"
import crypto from "crypto"

const postSchema = new mongoose.Schema({

    title:{
        type:String,
        trim:true,
        required:true
    },
    description:{
        type:String,
        trim:true,
    },
    post_images:[
        {
            type:String,
            default:"https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"
        }
    ],
    post_likes:[
        { type:mongoose.Schema.Types.ObjectId, ref:"User"}
    ],
    post_comments:[
        {
             user:{ type:mongoose.Schema.Types.ObjectId, ref:"User" },
             text:{ type:String,trim:true },
             commentedOn:{ type:Date,default:Date.now() }
        }

    ],
    learnedSkills:[
        { type:String,default:null }
    ],
    postdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    posthash:{
        type:String
    },
    postdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }


},{ timestamps:true })

postSchema.methods.generateHashOfPost = function(title,description,post_images){
       const content = title + description + post_images.join(",")
       const postHashed = crypto.createHash("sha256").update(content).digest("hex");
       return postHashed;

}


const Post = mongoose.model("Post",postSchema)

export default Post