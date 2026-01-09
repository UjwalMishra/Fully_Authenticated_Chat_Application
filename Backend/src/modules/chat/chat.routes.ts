import { Router } from "express";
import { createRoom, joinRoom, listUserRooms } from "./chat.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/rooms", authMiddleware, createRoom);
router.post("/rooms/:roomId/join",authMiddleware,joinRoom);
router.get("/rooms", authMiddleware, listUserRooms);
// router.get(
//   "/rooms/:roomId/messages",
//   authMiddleware,
//   getRoomMessages
// );

export default router;
