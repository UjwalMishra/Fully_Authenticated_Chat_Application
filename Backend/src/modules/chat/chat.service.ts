import { Types } from "mongoose";
import { Room } from "../../models/room.model";
import { Message } from "../../models/message.model";

export const createRoomService = async (
  name: string,
  userId: string
) => {
  const room = await Room.create({
    name,
    members: [new Types.ObjectId(userId)],
  });

  return room;
};


export const joinRoomService = async(
    roomId:string,
    userId:string
) => {
    const room = await Room.findById(roomId);

    if(!room){
        throw new Error("Room not found!");
    }

    //if user already a member of room
   const isMember = room.members
    .map((m) => m.toString())
    .includes(userId);

    if(isMember){
        return room;
    }

    const userObjId = new Types.ObjectId(userId);
    room.members.push(userObjId);
    await room.save();

    return room;
}

export const listUserRoomsService = async (userId: string) => {
  return Room.find({
    members: new Types.ObjectId(userId),
  }).select("_id name members createdAt");
};

// export const getRoomMessagesService = async (
//   roomId: string,
//   userId: string
// ) => {
//   if (!Types.ObjectId.isValid(roomId)) {
//     throw new Error("Invalid room id");
//   }

//   // Ensure user belongs to room
//   const room = await Room.findOne({
//     _id: roomId,
//     members: new Types.ObjectId(userId),
//   });

//   if (!room) {
//     throw new Error("Access denied");
//   }

//   return Message.find({ room: room._id })
//     .sort({ createdAt: 1 })
//     .select("_id content sender createdAt");
// };
