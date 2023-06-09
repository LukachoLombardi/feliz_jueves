![Feliz Jueves!](FelizJueves/icon.png)

# Feliz Jueves!
### available on Windows and Linux 64bit respectively!

Feliz Jueves is a discord user-bot that allows you to set different discord status messages for each day of the week. 
It includes a webUI for configuration and a background service for keeping your status up to date.

On Windows just unpack the 7z-archive and start the FelizJueves executable. Use the tray icon to access settings. 
Alternatively, you can also just open the exe again.

For Linux use the experimental Build.

On other platforms just build it yourself and tell me if it works. Instructions can be found down below.

## **DISCLAIMER**
Discord's stance on self-bots being used like this is a bit unclear. You'll most probably be fine, even *if* it isn't technically allowed. But please note that ***I do not
take any responsibility whatsoever for any lost or banned accounts. Use at your own risk.***

## Settings
You can start "FelizJueves.exe" twice or use the tray icon to access the settings after starting it. First of all, add your discord userToken. A guide on how to do so
can be found [here](https://www.androidauthority.com/get-discord-token-3149920/). In the settings you can then add new days.
Assign them an Index from 0-6 (Sunday-Saturday), specify the amount of days to keep the status (keep it at 1 if not sure) and add one or multiple
status options with or without a special status emoji. These will be randomly selected on their day. Click save to save.
Use the autostart button to add the status setter to autostart. It will run in the background everytime you start your pc and ensure your status is set correctly.
After first setting your token, the app will start working automatically. Note that the tray icon's token error won't disappear until the app restarts.

## Updating
When updating from v0.1.0, replace the whole folder. In later versions, replace the package.nw folder.
Settings are persistent starting from v0.2.2.

## How to build
1. get the newest web2exe binary for your platform (deprecated but whatever).
2. build the FelizJueves folder using the included settings For your desired platform.
