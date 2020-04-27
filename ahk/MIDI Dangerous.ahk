; Adapted from https://pastebin.com/sR2zjeGu

#NoEnv
; #Warn

SendMode InputThenPlay
SetWorkingDir E:\Documents\

#SingleInstance force
#include AutoHotkey-Midi/Midi.ahk

SetKeyDelay, , 20,

; These bindings work for the APC Mini
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
	,	5	: "Left"	; Pip to Sys
	,	62	: ";"		; 75% throttle
	,	14	: "Up"		; Pip to Eng
	,	6	: "Down"	; Reset Pip
	,	63	: "j"		; Frame Shift Drive
	,	55	: "k"		; Supercruise
	,	47	: ","		; Next system
	,	39	: "b"		; Galaxy Map
	,	31	: "]"		; System Map
	,	7	: "Right" }	; Pip to Wep


device := new Midi()
device.OpenMidiIn(0)

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

