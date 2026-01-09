import {Schema, model, Document} from "mongoose"
import { string } from "zod"

export interface IUser extends Document{
    name:string,
    email:string,
    password:string,
    resetPasswordToken?: string,
    resetPasswordExpires? : Date
}


const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
    },
    { timestamps: true }
)

export const User = model<IUser>("User", userSchema);