import { Request, Response } from "express";
import { forgotPasswordService, loginService, resetPasswordService, signupService } from "./auth.service";
import { loginSchema } from "./auth.validation";
import { safeParse } from "zod";



export const signup = async (req:Request, res:Response) => {
    const { name,email,password } = req.body;

    const result = await signupService(name,email,password);

    res.status(201).json({
        success: true,
        token: result.token,
        user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
        },
    });
};


export const login = async(req:Request, res:Response) => {
    const parsed = loginSchema.safeParse(req.body);

    if(!parsed.success){
        return res.status(400).json({
            message: "Invalid input",
        });
    }

    const {email,password} = parsed.data;

    const {user,token} = await loginService(email,password);

    res.status(200).json({
        success: true,
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
  });
}


export const forgotPassword = async(req:Request,res:Response) => {
    const {email} = req.body;

    await forgotPasswordService(email);

    res.status(200).json({
        message: "Reset link has been sent, Please check your email!"
    })
}


export const resetPassword = async(req:Request, res:Response) => {
    const {token} = req.params;
    const {password} = req.body;

    await resetPasswordService(token,password);

    res.status(200).json({
        message: "Password reset successful",
    });
};