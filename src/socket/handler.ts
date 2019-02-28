import { Socket } from "socket.io";
import { board, led } from "../controller/controller";

let ledState = false;
let boardReady = false;

board.on("ready", () => {
  boardReady = true;
});

export function socketHandler(socket: Socket) {
  socket.emit("test-forward", { hello: "world" });

  socket.on("test-backward", data => {
    if (boardReady && led) {
      ledState = !ledState;

      ledState ? led.on() : led.off();
    }
  });
}
