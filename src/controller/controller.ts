const johnnyFive = require("johnny-five");

const board = new johnnyFive.Board();

let led = null;

board.on("ready", () => {
  console.log("connection");

  led = new johnnyFive.Led(13);
});

export { board, led };
