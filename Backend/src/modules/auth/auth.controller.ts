import { Request, Response } from "express";
import { forgotPasswordService, loginService, refreshTokenService, resetPasswordService, signupService } from "./auth.service";
import { loginSchema } from "./auth.validation";
import crypto from "crypto"
import { User } from "../../models/user.model";
// import { safeParse } from "zod";

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const { newAccessToken, newRefreshToken } =
    await refreshTokenService(token);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.json({ accessToken: newAccessToken });
};


export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const { user, accessToken, refreshToken } =
    await signupService(name, email, password);

  // store refresh token securely in cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    success: true,
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
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

    const { user, accessToken, refreshToken } = await loginService(email, password);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        success: true,
        accessToken,
        user: {
        id: user.id,
        name: user.name,
        email: user.email,
        },
    });
}

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (token) {
    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    await User.updateOne({ refreshToken: hashed }, { $unset: { refreshToken: 1 } });
  }

  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out" });
};


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