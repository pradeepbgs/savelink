import mongoose,{Document, Schema} from "mongoose";

export interface Link extends Document {
    title: String,
    link:String,
    user:String,
    tags:String[]
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
        type:String,
        ref:"User",
        required:true,
    },
    tags:{
        type:[String],
        required:false
    }
})

export const LinkModel = 
mongoose.models.Link as mongoose.Model<Link> || mongoose.model("Link",LinkSchema);