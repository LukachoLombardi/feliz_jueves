![Feliz Jueves!](FelizJueves/icon.png)

# Feliz Jueves!

Feliz Jueves a discord user-bot that allows you to set different discord status messages for each day of the week.

the actual functioning script is found under /FelizJueves/FelizCheck/FelizForever.js. The rest is part of an unfinished
UI for settings and autostart creation.

## **DISCLAIMER**
Discord's stance on self-bots being used like this is a bit unclear. You'll most probably be fine, even *if* it isn't technically allowed. But please note that ***I do not
take any responsibility whatsoever for any lost or banned accounts. Use at your own risk.***

## Settings
You can open "FelizJueves.exe" to access the WebUI and settings. First of all, add your discord userToken. A guide on how to do so
can be found [here](https://www.androidauthority.com/get-discord-token-3149920/). In the settings you can add new days.
Assign them an Index from 0-6 (Sunday-Saturday), specify the amount of days to keep the status (keep it at 1 if unsure) and add one or multiple
status options with or without a special status emoji. These will be randomly selected on their day. Click save to save.
Use the autostart button to add the status setter to autostart and start it right now. An icon should appear in your tray
to indicate that it's running.

## How to build
1. get the newest web2exe binary for your platform (deprecated but whatever).
2. build the FelizJueves folder using the included settings For your desired platform.
3. add a token.txt file besides the settings.json just to be sure.
