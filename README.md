# Feliz Jueves

---

this is just a stupid little js discord user-bot that checks the current day-of-the-week index 
and changes your status to a specified string for a specified number of days if it matches.
Add it to your autostart or create a cron job or whatever, and you're good to go.

## Settings
The Settings should be pretty self-explanatory. Guides on getting your user token can be found online. 
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
