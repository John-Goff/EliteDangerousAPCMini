/* eslint no-console: 0 */

// Imports
const WebSocket = require('ws');
const sendkeys = require('sendkeys');
const easymidi = require('easymidi');
const { resetLightsToStarter, setLights, updateLights } = require("./lights.js");

// Set up MIDI input and output
const inputName = easymidi.getInputs().find((str) => str.startsWith("APC MINI"));
const apcin = new easymidi.Input(inputName);
const outputName = easymidi.getOutputs().find((str) => str.startsWith("APC MINI"));
const apcout = new easymidi.Output(outputName);

// Configure keybindings
const bindings = {
  56: "u",    // hardpoints         COL 1
  48: "v",    // Heatsink
  32: "m",    // Mode switch
  24: "'",    // FSS
  8:  "r",    // Thrust up
  0:  "f",    // Thrust down
  57: "g",    // Next Target        COL 2
  58: "1",    // Contacts           COL 3
  59: "2",    // Comms              COL 4
  35: "l",    // lights
  27: "home", // Cargo scoop
  60: "3",    // Helm               COL 5
  36: "c",    // Night Vision
  28: "/",    // Landing gear
  61: "4",    // Ship               COL 6
  5:  "a",    // Pips to sys
  62: ";",    // 75% throttle       COL 7
  14: "w",    // Pips to eng
  6:  "s",    // Reset pips
  63: "j",    // Frame Shift Drive  COL 8
  55: "k",    // Supercruise
  47: ",",    // Next system
  39: "b",    // Galaxy Map
  31: "]",    // System Map
  7:  "d"     // Pips to wep
}

resetLightsToStarter(apcout);

// Send keypresses when we get a MIDI message
apcin.on("noteon", (msg) => {
  const key = bindings[msg.note];
  if (!key) return;
  try {
    sendkeys.sync(key);
    console.log(`Key pressed: ${key}`);
  } catch (e) {
    console.error(e);
    console.error(`Unknown key: ${key}`);
  }
});

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

process.on("SIGINT", function () {
  // turn off all lights
  Array(89).fill().map((_, i) => { setLights(apcout, i, 0) });
  process.exit();
});
