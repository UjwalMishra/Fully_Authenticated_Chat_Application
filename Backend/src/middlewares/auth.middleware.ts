import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";



export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }


    const token = authHeader.split(" ")[1];

    try{
        const decoded = verifyToken(token);
        req.user = decoded;
        next(); 
    }catch(err){
        res.status(401).json({
            message: "Invalid or expired token! Login again"
        })
    }

}