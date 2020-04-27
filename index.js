/* eslint no-console: 0 */

// Imports
const WebSocket = require('ws');
const easymidi = require('easymidi');
const { resetLightsToStarter, setLights, updateLights } = require("./lights.js");

// Set up MIDI input and output
const outputName = easymidi.getOutputs().find((str) => str.startsWith("APC MINI"));
const apcout = new easymidi.Output(outputName);

resetLightsToStarter(apcout);

// Journal Server connection
const ws = new WebSocket('ws://localhost:31337');

ws.on('open', () => {
  // we want to subscribe
  const eventType = 'subscribe';

  const payload = ['X-Status'];

  // the server update our subscriptions
  ws.send(JSON.stringify({ type: eventType, payload }));
});

// Journal Server broadcast
ws.on('message', (data) => {
  // parse our stringified JSON
  const eventData = JSON.parse(data);

  // extract Journal payload from broadcast
  const { payload } = eventData;

  // new status event
  if (payload.event !== 'Fileheader') {
    console.log(eventData);
    updateLights(apcout, payload);
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

process.on("SIGINT", exitGracefully);
process.on("SIGTERM", exitGracefully);
