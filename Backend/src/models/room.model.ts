import {Schema,model,Types,Document} from "mongoose";

export interface IRoom extends Document{
    name:string,
    members: Types.ObjectId[],
}

const roomSchema = new Schema<IRoom>(
    {
        name: {type:String, required: true},
        members: [{type:Schema.Types.ObjectId, ref:"User"}],
    },
    { timestamps : true }
);

export const Room = model<IRoom>("Room",roomSchema);