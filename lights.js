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

// Flags
const ED_Docked             = 0x0000000000000001
const ED_Landed             = 0x0000000000000002
const ED_LandingGearDown    = 0x0000000000000004
const ED_ShieldsUp          = 0x0000000000000008
const ED_Supercruise        = 0x0000000000000010
const ED_FlightAssistOff    = 0x0000000000000020
const ED_HardpointsDeployed = 0x0000000000000040
const ED_InWing             = 0x0000000000000080

const ED_LightsOn           = 0x0000000000000100
const ED_CargoScoopDeployed = 0x0000000000000200
const ED_SilentRunning      = 0x0000000000000400
const ED_ScoopingFuel       = 0x0000000000000800
const ED_SRVHandbrake       = 0x0000000000001000
const ED_SRVTurret          = 0x0000000000002000
const ED_SRVTurretRetracted = 0x0000000000004000
const ED_SRVDriveAssist     = 0x0000000000008000

const ED_FSDMassLocked      = 0x0000000000010000
const ED_FSDCharging        = 0x0000000000020000
const ED_FSDCooldown        = 0x0000000000040000
const ED_LowFuel            = 0x0000000000080000
const ED_OverHeating        = 0x0000000000100000
const ED_HasLatLong         = 0x0000000000200000
const ED_IsInDanger         = 0x0000000000400000
const ED_BeingInterdicted   = 0x0000000000800000

const ED_InMainShip         = 0x0000000001000000
const ED_InFighter          = 0x0000000002000000
const ED_InSRV              = 0x0000000004000000
const ED_HudInAnalysisMode  = 0x0000000008000000
const ED_NightVision        = 0x0000000010000000
const ED_AltitudeFromRadius = 0x0000000020000000
const ED_FSDJump            = 0x0000000040000000
const ED_SRVHighBeams       = 0x0000000080000000

// Masks
const ED_CantFSD = ED_LandingGearDown | ED_HardpointsDeployed | ED_CargoScoopDeployed | ED_FSDMassLocked | ED_FSDCooldown | ED_InFighter | ED_InSRV;

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

function updateLights(midiout, payload) {
  if (payload.Pips && Array.isArray(payload.Pips)) {
    [sys, eng, wep] = payload.Pips;
    setPipLights(midiout, sys, 05);
    setPipLights(midiout, eng, 14);
    setPipLights(midiout, wep, 07);
  }

  setFocusLights(midiout, payload.GuiFocus || 0);

  setFlagLights(midiout, payload.Flags);
}

function setPipLights(midiout, pips, id) {
  if (pips <= 1) {
    setLights(midiout, id, RED);
  } else if (pips < 7) {
    setLights(midiout, id, YELLOW);
  } else {
    setLights(midiout, id, GREEN);
  }
}

function setFocusLights(midiout, focus) {
  resetFocusLights(midiout);
  if (focus === 1) {
    setLights(midiout, 61, GREEN);
  } else if (focus === 2) {
    setLights(midiout, 58, GREEN);
  } else if (focus === 3) {
    setLights(midiout, 59, GREEN);
  } else if (focus === 4) {
    setLights(midiout, 60, GREEN);
  } else if (focus === 6) {
    setLights(midiout, 39, GREEN_FLASH);
  } else if (focus === 7) {
    setLights(midiout, 31, GREEN_FLASH);
  } else if (focus === 9) {
    setLights(midiout, 24, YELLOW_FLASH);
  }
}

function resetFocusLights(midiout) {
  setLights(midiout, 24, YELLOW); // FSS
  setLights(midiout, 58, YELLOW); // contacts
  setLights(midiout, 59, YELLOW); // comms
  setLights(midiout, 60, YELLOW); // helm
  setLights(midiout, 61, YELLOW); // ship
  setLights(midiout, 39, GREEN);  // galaxy map
  setLights(midiout, 31, GREEN);  // system map
}

function setFlagLights(midiout, flag) {
  if (flag & ED_LandingGearDown) {
    setLights(midiout, 28, RED);
  } else {
    setLights(midiout, 28, YELLOW);
  }

  if (flag & ED_SRVHighBeams) {
    setLights(midiout, 35, RED_FLASH);
  } else if (flag & ED_LightsOn) {
    setLights(midiout, 35, RED);
  } else {
    setLights(midiout, 35, YELLOW);
  }

  if (flag & ED_CargoScoopDeployed) {
    setLights(midiout, 27, RED);
  } else {
    setLights(midiout, 27, GREEN);
  }

  if (flag & ED_NightVision) {
    setLights(midiout, 36, RED);
  } else {
    setLights(midiout, 36, GREEN);
  }

  if (flag & ED_FSDJump) {
    setLights(midiout, 63, YELLOW);
    setLights(midiout, 55, YELLOW);
  } else if (flag & ED_CantFSD) {
    setLights(midiout, 63, RED);
    setLights(midiout, 55, RED);
  } else if (flag & ED_FSDCharging) {
    setLights(midiout, 63, GREEN_FLASH);
    setLights(midiout, 55, GREEN_FLASH);
  } else {
    setLights(midiout, 63, GREEN);
    setLights(midiout, 55, GREEN);
  }

  if (flag & ED_HardpointsDeployed) {
    setLights(midiout, 56, RED_FLASH);
  } else {
    setLights(midiout, 56, RED);
  }

  if (flag & ED_HudInAnalysisMode) {
    setLights(midiout, 32, GREEN);
  } else {
    setLights(midiout, 32, RED);
  }
}

// Exports
module.exports = {
  resetLightsToStarter,
  setLights,
  updateLights
}
