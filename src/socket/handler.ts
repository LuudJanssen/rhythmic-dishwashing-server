import { Socket } from "socket.io";
import {
  board,
  builtInLed,
  connectionLedMapping,
  drippingTrayLed,
  drippingTrayPin,
  drippingTraySensor,
  IConnectionLedMapping,
  proximitySensor
} from "../controller/controller";
import { io } from "./socket";

let ledState = false;
let boardReady = false;
const buttonState = false;

class Switch {
  private state: boolean;

  constructor(defaultState = false) {
    this.state = defaultState;
  }

  public on(callback: () => void): () => void {
    return this.callbackOnState(callback, true);
  }

  public off(callback: () => void): () => void {
    return this.callbackOnState(callback, false);
  }

  private callbackOnState(callback: () => void, state: boolean) {
    return () => {
      if (this.state === state) {
        return;
      }

      this.state = state;
      callback();
    };
  }
}

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
  const state = false;
  const connectionSwitch = new Switch();

  connection.instance.on(
    "down",
    connectionSwitch.on(() => {
      emitConnectionState(connection.pin, true);
      led.instance.brightness(255);
      led.instance.fade(0, 200);
      console.log(`Connection on pin ${connection.pin} connected`);
    })
  );

  connection.instance.on(
    "up",
    connectionSwitch.off(() => {
      emitConnectionState(connection.pin, false);
      led.instance.brightness(255);
      led.instance.fade(0, 200);
      console.log(`Connection on pin ${connection.pin} disconnected`);
    })
  );
}

export function socketHandler(socket: Socket) {
  console.log("connection");
  io.emit("test-forward", { hello: "world" });

  socket.on("test-backward", data => {
    toggleLed();
  });

  board.on("ready", () => {
    console.log("Board ready");

    boardReady = true;

    connectionLedMapping.forEach(attachConnectionLedHandler);

    const drippingSwitch = new Switch();
    const proximitySwitch = new Switch();

    drippingTraySensor.on(
      "open",
      drippingSwitch.on(() => {
        console.log("Dripping open");
        drippingTrayLed.on();
        emitConnectionState(drippingTrayPin, true);
      })
    );

    drippingTraySensor.on(
      "close",
      drippingSwitch.off(() => {
        console.log("Dripping close");
        drippingTrayLed.off();
        emitConnectionState(drippingTrayPin, false);
      })
    );

    proximitySensor.on(
      "open",
      proximitySwitch.on(() => {
        console.log("Proximity open");
      })
    );

    proximitySensor.on(
      "close",
      proximitySwitch.off(() => {
        console.log("Proximity close");
      })
    );
  });
}
