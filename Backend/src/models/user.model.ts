import {Schema, model, Document} from "mongoose"

export interface IUser extends Document{
    name:string,
    email:string,
    password:string,
    refreshToken?: string;
    resetPasswordToken?: string,
    resetPasswordExpires? : Date
}


const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        refreshToken: { type: String },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
    },
    { timestamps: true }
)

export const User = model<IUser>("User", userSchema);