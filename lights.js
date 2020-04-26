// Basic lights
const OFF = 0;
const ON = 1;
const BLINK = 2;

// Colours for main lights
const GREEN = 1;
const GREEN_FLASH = 2;
const RED = 3;
const RED_FLASH = 4;
const YELLOW = 5;
const YELLOW_FLASH = 6;

function setLights(midiout, button, colour) {
  midiout.send("noteon", { note: button, velocity: colour });
}

function resetLightsToStarter(midiout) {
  setLights(midiout, 56, RED);
  setLights(midiout, 48, YELLOW);
  setLights(midiout, 32, RED);
  setLights(midiout, 24, YELLOW);
  setLights(midiout, 08, RED);
  setLights(midiout, 00, RED);
  setLights(midiout, 57, GREEN);
  setLights(midiout, 58, YELLOW);
  setLights(midiout, 59, YELLOW);
  setLights(midiout, 35, YELLOW);
  setLights(midiout, 27, GREEN);
  setLights(midiout, 60, YELLOW);
  setLights(midiout, 36, GREEN);
  setLights(midiout, 28, YELLOW);
  setLights(midiout, 61, YELLOW);
  setLights(midiout, 05, YELLOW);
  setLights(midiout, 62, GREEN);
  setLights(midiout, 14, YELLOW);
  setLights(midiout, 06, GREEN);
  setLights(midiout, 63, GREEN);
  setLights(midiout, 55, GREEN);
  setLights(midiout, 47, YELLOW);
  setLights(midiout, 39, GREEN);
  setLights(midiout, 31, GREEN);
  setLights(midiout, 07, YELLOW);
}

// Exports
module.exports = {
  resetLightsToStarter,
  setLights
}
