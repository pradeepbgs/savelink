import mongoose,{Document, Schema} from "mongoose";

export interface Link extends Document {
    title: String,
    link:String,
    user:mongoose.Schema.Types.ObjectId,
    tags:String[],
    createdAt:Date
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
    }
})

export const LinkModel = 
mongoose.models.Link as mongoose.Model<Link> || mongoose.model("Link",LinkSchema);