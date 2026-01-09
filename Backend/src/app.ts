import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import chatRoutes from "./modules/chat/chat.routes"

export const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chat",chatRoutes)
