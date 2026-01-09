// import { Server } from "socket.io";
// import http from "http";
// import { verifyAccessToken } from "../utils/jwt";
// import { Room } from "../models/room.model";
// import { Types } from "mongoose";
// import { Message } from "../models/message.model";

// export const initSocket = (server: http.Server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: "*",
//     },
//   });

//   io.use((socket, next) => {
//     try {
//       const token =
//         socket.handshake.auth?.token ||
//         socket.handshake.headers.authorization?.split(" ")[1];

//       if (!token) {
//         return next(new Error("Unauthorized"));
//       }

//       const decoded = verifyAccessToken(token);
//       socket.data.userId = decoded.userId;

//       next();
//     } catch (err) {
//       next(new Error("Unauthorized"));
//     }
//   });

//   io.on("connection", async (socket) => {
//     const userId = socket.data.userId;

//     console.log("Socket connected:", userId);

//     const rooms = await Room.find({
//       members: new Types.ObjectId(userId),
//     }).select("_id");

//     rooms.forEach((room) => {
//       socket.join(room._id.toString());
//     });

//     socket.on(
//       "send-message",
//       async (data: { roomId: string; content: string }) => {
//         try {
//           const { roomId, content } = data;

//           if (!Types.ObjectId.isValid(roomId) || !content.trim()) {
//             return;
//           }

//           const room = await Room.findOne({
//             _id: roomId,
//             members: new Types.ObjectId(userId),
//           });

//           if (!room) {
//             return;
//           }

//           const message = await Message.create({
//             room: room._id,
//             sender: new Types.ObjectId(userId),
//             content,
//           });

//           io.to(roomId).emit("receive-message", {
//             _id: message._id,
//             roomId,
//             senderId: userId,
//             content: message.content,
//             createdAt: message.createdAt,
//           });
//         } catch (err) {
//           console.error("send-message error:", err);
//         }
//       }
//     );

//     socket.on("disconnect", () => {
//       console.log("Socket disconnected:", userId);
//     });
//   });
// };
