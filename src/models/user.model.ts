import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    admin: boolean;
    links: mongoose.Schema.Types.ObjectId[];
  }

const UserSchema: Schema <User> = new Schema ({
    username:{ 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    email: {
        type:String,
        required:true,
        unique:true,
        match: [/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/, 'Please use a valid email address']
    },
    password: {
        type:String,
        required:true,
    },
    admin: {
        type:Boolean,
        default:false
    },
    links:[{
        type:mongoose.Schema.ObjectId,
        ref:"Link"
    }]
})

export const userModel = mongoose.models.User as mongoose.Model<User> || mongoose.model("User",UserSchema)

