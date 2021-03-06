/* eslint no-console: 0 */

// Imports
const WebSocket = require('ws');
const easymidi = require('easymidi');
const {
  resetLightsToStarter,
  setLights,
  updateCargoTotal,
  updateFuelTotal,
  updateLights,
} = require("./lights.js");

// Set up MIDI input and output
const outputName = easymidi.getOutputs().find((str) => str.startsWith("APC MINI"));
const apcout = new easymidi.Output(outputName);

// Store for planetary data
const planets = {}

resetLightsToStarter(apcout);

// Journal Server connection
const ws = new WebSocket("ws://localhost:31337");

ws.on("open", () => {
  // we want to subscribe
  const eventType = "subscribe";

  const payload = ["X-Status", "Loadout", "LaunchSRV", "Scan"];

  // the server update our subscriptions
  ws.send(JSON.stringify({ type: eventType, payload }));
});

// Journal Server broadcast
ws.on("message", (data) => {
  // parse our stringified JSON
  const eventData = JSON.parse(data);

  // extract Journal payload from broadcast
  const { payload } = eventData;

  // log
  if (payload.event !== "Fileheader") console.log(eventData);

  // new status event
  if (payload.event === "Loadout") {
    updateCargoTotal(payload);
    updateFuelTotal(payload);
  } else if (payload.event === "LaunchSRV") {
    updateCargoTotal({ CargoCapacity: 2 });
  } else if (payload.event === "X-Status") {
    updateLights(apcout, payload);
  } else if (payload.event === "Scan") {
    if (payload.SurfaceGravity !== undefined) {
      if (planets[payload.BodyName] === undefined) {
        planets[payload.BodyName] = {};
      }
      Object.entries(payload).forEach(([key, value]) => {
        if (key !== "BodyName") {
          planets[payload.BodyName][key] = value;
        }
      });
    }
    console.log(planets);
  }
});

// Shutdown
if (process.platform === "win32") {
  const rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on("SIGINT", function () {
    process.emit("SIGINT");
  });
}

function exitGracefully() {
  // turn off all lights
  Array(89).fill().map((_, i) => { setLights(apcout, i, 0) });
  process.exit();
}

process.on("exit", exitGracefully);
process.on("SIGINT", exitGracefully);
process.on("SIGUSR1", exitGracefully);
process.on("SIGUSR2", exitGracefully);
process.on("SIGTERM", exitGracefully);
process.on("uncaughtException", function (e) {
  console.log('Uncaught Exception...');
  console.log(e.stack);
  Array(89).fill().map((_, i) => { setLights(apcout, i, 0) });
  process.exit(99);
});
