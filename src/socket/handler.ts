import { Socket } from "socket.io";

export function socketHandler(socket: Socket) {
  socket.emit("test-forward", { hello: "world" });

  socket.on("test-backward", data => {
    console.log(data);
  });
}
