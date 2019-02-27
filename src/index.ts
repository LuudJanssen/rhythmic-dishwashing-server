import { server } from "./server/server";
import { socketHandler } from "./socket/handler";
import { io } from "./socket/socket";

server.listen(3000);
io.on("connection", socketHandler);
