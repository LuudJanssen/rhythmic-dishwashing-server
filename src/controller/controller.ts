import johnnyFive, { Button } from "johnny-five";

const board = new johnnyFive.Board();

let builtInLed: johnnyFive.Led;

export interface IComponent {
  pin: number;
  instance: any;
}

export interface ILedComponent extends IComponent {
  instance: johnnyFive.Led;
}

export interface IConnectionComponent extends IComponent {
  instance: johnnyFive.Button;
}

export interface IConnectionLedMapping {
  led: ILedComponent;
  connection: IConnectionComponent;
}

let connectionLedMapping: IConnectionLedMapping[];

const CONNECTION_PINS = [4, 5, 6, 7];
const CONNECTION_LED_OFFSET = 4;

function createConnectionLedMappingFromPin(
  connectionPin: number
): IConnectionLedMapping {
  const ledPin = connectionPin + CONNECTION_LED_OFFSET;
  const connection = new johnnyFive.Button({
    isPullup: true,
    pin: connectionPin
  });
  const led = new johnnyFive.Led(ledPin);

  return {
    led: {
      pin: ledPin,
      instance: led
    },
    connection: {
      pin: connectionPin,
      instance: connection
    }
  };
}

board.on("ready", () => {
  builtInLed = new johnnyFive.Led(13);
  connectionLedMapping = CONNECTION_PINS.map(createConnectionLedMappingFromPin);
});

export { board, connectionLedMapping, builtInLed };
