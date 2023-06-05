![Feliz Jueves!](FelizJueves/icon.png)

# Feliz Jueves

this is just a stupid little js discord user-bot that checks the current day-of-the-week index 
and changes your status to a specified string for a specified number of days if it matches.
Add it to your autostart or create a cron job or whatever, and you're good to go.

the actual functioning script is found under /FelizJueves/FelizCheck/FelizCheck.js. The rest is part of an unfinished
UI for settings and autostart creation.

## Settings
---The Settings should be pretty self-explanatory. Guides on getting your user token can be found online. 
Just extract it and put it into a "token.txt" in the script directory.

You can define new status rules in the array like this. Note that the day count starts with sunday at index 0. 
daysForward simply tells the script how long to keep the status active.

```
{"statusOptions": [
        {"status": "feliz jueves!",
        "statusEmoji": "🎉"},
        {"status": "it's thurday, sparkle off!",
        "statusEmoji": "🤨"}],
    "day": 4,
    "daysForward": 1}
```

## **DISCLAIMER**
I have no idea whether this is against Discords TOS since I haven't looked enough into their stance on self-bots 
being used like this. You'll probably be fine, even *if* it isn't technically allowed. But please note that ***I do not
take any responsibility whatsoever for any lost or banned accounts. Use at your own risk.***

## How to build (very hacky ik)
1. get the newest web2exe binary for your platform (deprecated but whatever).
2. create two uncompressed nw.js apps using web2exe. Use the included web2exe config jsons.
    - one for FelizJueves (the configurator)
    - one for FelizCheck (the actual program)
3. rename the nw executables and folders accordingly
4. move the contents of the app.nw folder of FelizCheck into FelizCheck's root folder/where nw loads loose files from (check the [nw.js github](https://github.com/nwjs/nw.js/wiki/How-to-package-and-distribute-your-apps) for platform specific infos)
5. put the FelizCheck app folder into FelizJueve's corresponding load folder (most likely the app.nw folder. As said, check the wiki for more infos!)
6. You're done! Run your renamed FelizJueves nw executable or repeat for other platforms.

I'll probably create an automated process for this in the future, but rn I just want to get the first release out there.

NOTE: the source code is currently NOT in a state where this will produce a usable application. This is currently for internal reference, but will become usable very soon.