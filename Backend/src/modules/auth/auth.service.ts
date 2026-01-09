import { mailTransporter } from "../../config/mail";
import { User } from "../../models/user.model"
import { comparePassword, hashPassword } from "../../utils/hash";
import { signToken } from "../../utils/jwt";
import crypto from "crypto";



export const signupService = async (
    name:string,
    email:string,
    password:string
) => {
    const existingUser = await User.findOne({email});

    if(existingUser){
        throw new Error("User already exists!");
    }

    const hashedPassword = await hashPassword(password); 

    const user = await User.create({
        name,
        email,
        password:hashedPassword
    })

    const token = signToken({userId: user.id});
    return {user,token};
}


export const loginService = async(
    email:string,
    password:string
) => {
    const user = await User.findOne({email});

    if(!user){
        throw new Error("Invalid email!");
    }

    const isPasswordValid = await comparePassword(password,user.password);

    if(!isPasswordValid){
        throw new Error("Invalid password!");
    }

    const token = signToken({userId:user.id});

    return {
        user,token
    };
};

export const forgotPasswordService = async(email:string) => {
    const user = await User.findOne({email});

    if (!user) {
        return;
    }

    //generating random token using crypto
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); //10 mins

    await user.save();

    const resetLink = `http://localhost:8000/reset-password/${resetToken}`;

    //mail (temp) ---> in future i'll move it to seperate folder
    await mailTransporter.sendMail({
    from: `"Chat App" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Reset your password",
    html: `
        <p>You requested a password reset</p>
        <p>Click the link below:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 10 minutes</p>
        `,
    });
}


export const resetPasswordService = async(
    token:string,
    newPassword:string,
) => {
    const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
        throw new Error("Token is invalid or expired");
    }

    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
}