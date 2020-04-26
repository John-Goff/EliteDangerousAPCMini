; Adapted from https://pastebin.com/sR2zjeGu

#NoEnv
; #Warn

SendMode InputThenPlay
SetWorkingDir E:\Documents\

#SingleInstance force
#include AutoHotkey-Midi/Midi.ahk

SetKeyDelay, , 20,

; These bindings work for the default layout on the Korg Nanopad2
; You may need to change the MIDI notes to match your device
bindings := {	56	: "u"		; hardpoints
	,	48	: "v"		; Heatsink
	,	32	: "m"		; Mode switch
	,	24	: "'"		; FSS
	,	8	: "r"		; Thrust up
	,	0	: "f"		; Thrust down
	,	57	: "g"		; Next Target
	,	58	: 1		; Contacts
	,	59	: 2		; Comms
	,	35	: "l"		; lights
	,	27	: "Home"	; Cargo scoop
	,	60	: 3		; Helm
	,	36	: "c"		; Night Vision
	,	28	: "/"		; Landing gear
	,	61	: 4		; Ship
	,	62	: ";"		; 75% throttle
	,	63	: "j"		; Frame Shift Drive
	,	55	: "k"		; Supercruise
	,	47	: ","		; Next system
	,	39	: "b"		; Galaxy Map
	,	31	: "]" }		; System Map


device := new Midi()
device.OpenMidiIn(0)

global hardpointsDeployed := false
global combatMode := true
global fssOn := false

global contactsPanelOpen := false
global commsPanelOpen := false
global hemlPanelOpen := false
global shipPanelOpen := false

global lightsOpen := false
global cargoScoopOpen := false
global landingGearOpen := false
global nightVisionOpen := false

GoSub, SetLightsToDefault

Return

MidiNoteOn:
	event := device.MidiIn()
	if (event.velocity > 0)
		key := bindings[event.noteNumber]
		if (key)
			SendInput, {%key% Down}
	Return

MidiNoteOff:
	event := device.MidiIn()
	if (event.velocity > 0)
		key := bindings[event.noteNumber]
		if (key)
			SendInput, {%key% Up}
	Return

SetLights(button, colour)
{
	Run, C:\Users\John Goff\Downloads\sendmidi-windows-1.0.14\sendmidi.exe dev "APC MINI" on %button% %colour%, , Hide
}

SetLightsIfOn(ByRef isOn, light, colourIfOn, colourIfOff)
{
	if (isOn) {
		isOn := false
		SetLights(light, colourIfOn)
	} else {
		isOn := true
		SetLights(light, colourIfOff)
	}
}

SetLightsToDefault:
	SetLights(56, 03)
	SetLights(48, 05)
	SetLights(32, 03)
	SetLights(24, 05)
	SetLights(08, 03)
	SetLights(00, 03)
	SetLights(57, 01)
	SetLights(58, 05)
	SetLights(59, 05)
	SetLights(35, 05)
	SetLights(27, 01)
	SetLights(60, 05)
	SetLights(36, 01)
	SetLights(28, 05)
	SetLights(61, 05)
	SetLights(62, 01)
	SetLights(63, 01)
	SetLights(55, 01)
	SetLights(47, 05)
	SetLights(39, 01)
	SetLights(31, 01)
	GoSub, ResetToStarter
	Return

ResetToStarter:
	hardpointsDeployed := false
	combatMode := true
	fssOn := false
	contactsPanelOpen := false
	commsPanelOpen := false
	hemlPanelOpen := false
	shipPanelOpen := false
	lightsOpen := false
	cargoScoopOpen := false
	landingGearOpen := false
	nightVisionOpen := false
	Return

ResetPanelSelect:
	contactsPanelOpen := false
	commsPanelOpen := false
	hemlPanelOpen := false
	shipPanelOpen := false
	Return

Joy1::
	if (!hardpointsDeployed && !contactsPanelOpen
		&& !commsPanelOpen && !helmPanelOpen && !shipPanelOpen && !landingGearOpen
		&& !fssOn) {
		hardpointsDeployed := true
		SetLights(56, 04)
	}
	Return

MidiNoteOn0:
	SetLights(00, 01)
	Return

MidiNoteOff0:
	SetLights(00, 03)
	Return

MidiNoteOn8:
	SetLights(08, 01)
	Return

MidiNoteOff8:
	SetLights(08, 03)
	Return

MidiNoteOn56:
	SetLightsIfOn(hardpointsDeployed, 56, 03, 04)
	Return

MidiNoteOn32:
	SetLightsIfOn(combatMode, 32, 01, 03)
	Return

MidiNoteOn24:
	SetLightsIfOn(fssOn, 24, 05, 06)
	Return

MidiNoteOn35:
	SetLightsIfOn(lightsOpen, 35, 05, 03)
	Return

MidiNoteOn27:
	SetLightsIfOn(cargoScoopOpen, 27, 01, 03)
	Return

MidiNoteOn36:
	SetLightsIfOn(nightVisionOpen, 36, 01, 03)
	Return

MidiNoteOn28:
	SetLightsIfOn(landingGearOpen, 28, 05, 03)
	Return

MidiNoteOn58:
	if (contactsPanelOpen) {
		SetLights(58, 05)
		SetLights(59, 05)
		SetLights(60, 05)
		SetLights(61, 05)
		GoSub, ResetPanelSelect
	} else {
		contactsPanelOpen := true
		SetLights(58, 01)
		SetLights(59, 05)
		SetLights(60, 05)
		SetLights(61, 05)
	}
	Return

MidiNoteOn59:
	if (commsPanelOpen) {
		SetLights(58, 05)
		SetLights(59, 05)
		SetLights(60, 05)
		SetLights(61, 05)
		GoSub, ResetPanelSelect
	} else {
		commsPanelOpen := true
		SetLights(58, 05)
		SetLights(59, 01)
		SetLights(60, 05)
		SetLights(61, 05)
	}
	Return

MidiNoteOn60:
	if (helmPanelOpen) {
		SetLights(58, 05)
		SetLights(59, 05)
		SetLights(60, 05)
		SetLights(61, 05)
		GoSub, ResetPanelSelect
	} else {
		helmPanelOpen := true
		SetLights(58, 05)
		SetLights(59, 05)
		SetLights(60, 01)
		SetLights(61, 05)
	}
	Return

MidiNoteOn61:
	if (shipPanelOpen) {
		SetLights(58, 05)
		SetLights(59, 05)
		SetLights(60, 05)
		SetLights(61, 05)
		GoSub, ResetPanelSelect
	} else {
		shipPanelOpen := true
		SetLights(58, 05)
		SetLights(59, 05)
		SetLights(60, 05)
		SetLights(61, 01)
	}
	Return

MidiNoteOn98:
	GoSub, SetLightsToDefault
	Return