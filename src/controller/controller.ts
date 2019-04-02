import johnnyFive, { Button } from "johnny-five";

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

const board = new johnnyFive.Board();
const proximityPin = 11;
const drippingTrayPin = 12;
const drippingTrayLedPin = 10;

let builtInLed: johnnyFive.Led;
let proximitySensor: johnnyFive.Switch;
let drippingTraySensor: johnnyFive.Switch;
let drippingTrayLed: johnnyFive.Led;

let connectionLedMapping: IConnectionLedMapping[];

const CONNECTION_LED_PIN_MAPPING = [[2, 3], [4, 5], [7, 6], [8, 9]];

function createConnectionLedMappingFromPin(
  connectionLedPins: number[]
): IConnectionLedMapping {
  const [connectionPin, ledPin] = connectionLedPins;

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
  proximitySensor = new johnnyFive.Switch({
    pin: proximityPin,
    type: "NC"
  });
  drippingTraySensor = new johnnyFive.Switch(drippingTrayPin);
  drippingTrayLed = new johnnyFive.Led(drippingTrayLedPin);
  connectionLedMapping = CONNECTION_LED_PIN_MAPPING.map(
    createConnectionLedMappingFromPin
  );
});

export {
  board,
  connectionLedMapping,
  builtInLed,
  proximitySensor,
  drippingTraySensor,
  drippingTrayLed,
  drippingTrayPin
};
