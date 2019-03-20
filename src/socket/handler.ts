import { Socket } from "socket.io";
import {
  board,
  builtInLed,
  connectionLedMapping,
  IConnectionLedMapping
} from "../controller/controller";
import { io } from "./socket";

let ledState = false;
let boardReady = false;
const buttonState = false;

function emitButtonState() {
  io.emit("button-state", {
    state: buttonState
  });
}

function emitConnectionState(pin: number, state: boolean) {
  io.emit("connection-state", {
    pin,
    state
  });
}

function toggleLed() {
  if (boardReady && builtInLed) {
    ledState = !ledState;

    ledState ? builtInLed.on() : builtInLed.off();
  }
}

function attachConnectionLedHandler({
  connection,
  led
}: IConnectionLedMapping) {
  let state = false;

  connection.instance.on("down", () => {
    if (state) {
      return;
    }

    state = true;
    emitConnectionState(connection.pin, true);
    led.instance.on();
    console.log(`Connection on pin ${connection.pin} connected`);
  });

  connection.instance.on("up", () => {
    if (!state) {
      return;
    }

    state = false;
    emitConnectionState(connection.pin, false);
    led.instance.off();
    console.log(`Connection on pin ${connection.pin} disconnected`);
  });
}

export function socketHandler(socket: Socket) {
  io.emit("test-forward", { hello: "world" });

  socket.on("test-backward", data => {
    toggleLed();
  });

  board.on("ready", () => {
    boardReady = true;

    connectionLedMapping.forEach(attachConnectionLedHandler);
  });
}
