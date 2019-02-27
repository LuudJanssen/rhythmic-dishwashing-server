import socketIo from "socket.io";
import { server } from "../server/server";

export const io = socketIo(server);
