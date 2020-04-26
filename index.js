/* eslint no-console: 0 */

// Imports
const WebSocket = require('ws');
const robot = require('robotjs');
const easymidi = require('easymidi');

// Set up MIDI input and output
const apcin = new easymidi.Input("APC MINI");
const apcout = new easymidi.Output("APC MINI");

// Configure keybindings
const bindings = {
  56: "u",	  // hardpoints
  48: "v",	  // Heatsink
  32: "m",	  // Mode switch
  24: "'",	  // FSS
  8:  "r",	  // Thrust up
  0:  "f",	  // Thrust down
  57: "g",	  // Next Target
  58: "1",	  // Contacts
  59: "2",	  // Comms
  35: "l",	  // lights
  27: "Home", // Cargo scoop
  60: "3",    // Helm
  36: "c",	  // Night Vision
  28: "/",	  // Landing gear
  61: "4"		  // Ship
  62: ";",	  // 75% throttle
  63: "j",	  // Frame Shift Drive
  55: "k",	  // Supercruise
  47: ",",	  // Next system
  39: "b",	  // Galaxy Map
  31: "]"		  // System Map
}

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
  }
});
