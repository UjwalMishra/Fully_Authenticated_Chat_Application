import { Router } from "express";
import { forgotPassword, login, logout, refreshToken, resetPassword, signup } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);


//testing authMiddleware
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    userId: req.user?.userId,
  });
});

router.post("/forgot-password", forgotPassword);  
router.post("/reset-password/:token", resetPassword)

export default router;
