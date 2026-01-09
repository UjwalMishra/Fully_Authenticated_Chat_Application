import { Request, Response } from "express";
import { createRoomService, joinRoomService, listUserRoomsService } from "./chat.service";

export const createRoom = async (req: Request, res: Response) => {
  const { name } = req.body;
  const userId = req.user!.userId;

  const room = await createRoomService(name, userId);

  res.status(201).json({
    success: true,
    room,
  });
};

export const joinRoom = async(req:Request, res:Response) =>{
    const {roomId} = req.params;
    const userId = req.user?.userId;

    const room = await joinRoomService(roomId, userId as string);

    res.status(200).json({
        success: true,
        room,
    });
}

export const listUserRooms = async (req:Request, res:Response) => {
    const userId = req.user?.userId;

    const rooms = await listUserRoomsService(userId as string);

    res.status(200).json({
        success:true,
        rooms,
    })
}