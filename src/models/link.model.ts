import mongoose,{Document, Schema} from "mongoose";
import { boolean } from "zod";

export interface Link extends Document {
    title: String,
    link:String,
    user:mongoose.Schema.Types.ObjectId,
    tags:String[],
    createdAt:Date,
    isDeleted:Boolean
}

const LinkSchema:Schema<Link> = new Schema({
    title: {
        type: String,
    },
    link: {
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    tags:{
        type:[String],
        required:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    isDeleted:{
        type:Boolean,
        default:false,
    }
})

export const LinkModel = 
mongoose.models.Link as mongoose.Model<Link> || mongoose.model("Link",LinkSchema);