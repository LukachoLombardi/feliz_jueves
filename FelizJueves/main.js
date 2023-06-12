const fs = require("fs");
const path = require("path");
const discord = require("discord-user-bots");

const tokenError = "User Token may be empty or missing. Add it and check if it works.";
const noErrors = "Feliz Jueves is running, no errors found!🎉";
const runningTip = "Feliz Jueves is running🎉";

let tokenPath = path.join(nw.App.dataPath, "token.txt");
let settingsPath = path.join(nw.App.dataPath, "settings.json");

nw.Window.open("./FelizJueves.html");
nw.Window.get(undefined).hide();

// configuring the tray
let userToken = "token"
let tray;
try {
    let statusLabel;
    if (fs.existsSync(tokenPath) === true) {
        userToken = fs.readFileSync(tokenPath, "utf8");
    } else {
        userToken = "";
    }
    if (userToken === undefined || userToken === "") {
        console.error(tokenError);
        statusLabel = tokenError;
    } else {
        statusLabel = noErrors;
    }

    tray = new nw.Tray({
        title: 'Feliz Jueves',
        tooltip: runningTip,
        icon: 'icon.png'
    });

    let menu = new nw.Menu();

    menu.append(new nw.MenuItem({
        label: statusLabel,
        enabled: false
    }));

    menu.append(new nw.MenuItem({
        label: "Today's status:",
        enabled: false
    }));


    menu.append(new nw.MenuItem({
        label: 'Settings',
        click: onOpenCallback
    }));

    menu.append(new nw.MenuItem({
        label: 'Quit',
        click: function () {
            nw.App.quit();
        }
    }));

    tray.menu = menu;
} catch (e) {
    console.log("not running in nw.js or other unknown error. No tray icon")
}

console.log("starting checker");
runScheduledChecker();
nw.App.on("open", onOpenCallback)

function onOpenCallback() {
    console.log("starting webUI");
    nw.Window.open("./FelizJueves.html", function (win) {
        win.on("closed", function (win){
            onCloseCallback(win);
        });
    });
}

function onCloseCallback(win) {
    console.log("closing webUI");
    checkFeliz();
}

//former FelizCheck.js

function seekMidnight(days) {
    //get the properly formatted date of the next midnight
    const now = new Date();
    if (days === 0 || days === undefined || days === null) {
        return null;
    }
    const dayForward = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
    return dayForward.toISOString();
}

function setStatus(userToken, status, statusEmoji, days, callback) {
    const discordClient = new discord.Client(userToken);

    discordClient.on.ready = function () {
        console.log("user connected");

        let statusPromise = discordClient.set_custom_status({
            text: status,
            emoji: statusEmoji,
            expireAt: seekMidnight(days)
        });

        statusPromise.then((response) => {
            console.log(`changed status to ${status} ${statusEmoji} until ${seekMidnight(days)}`);
        });
        statusPromise.catch((error) => {
            console.error(`status change failed with: ${error}`);
        });
        statusPromise.finally(() => {
            callback()
        })
    };
}

async function checkFeliz() {
    //quick token check
    while(fs.existsSync(tokenPath) === false){
        tray.menu.items[0].label = tokenError;
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    console.log("found token file");
    userToken = fs.readFileSync(tokenPath, "utf8");
    while(userToken === undefined || userToken.length === 0){
        tray.menu.items[0].label = tokenError;
        userToken = fs.readFileSync(tokenPath, "utf8");
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    tray.menu.items[0].label = noErrors;
    console.log("found token value");


    let settings;
    let statusVariants;
    //providing empty settings if missing
    try{
        settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    } catch (e){
        settings = JSON.parse("");
        console.log("reverting to empty settings")
    }

    statusVariants = settings.statusVariants;


    const dayNameMap = {
        0: "sunday",
        1: "monday",
        2: "tuesday",
        3: "wednesday",
        4: "thursday",
        5: "friday",
        6: "saturday"
    };

    const nowDate = new Date();
    const nowDay = nowDate.getDay();

    console.log(`it's ${dayNameMap[nowDay]}`);

    /*
    statusVariants.forEach((statusVariant) => {
        const day = statusVariant.day;
        if(nowDay !== day){
            console.log(`no ${dayNameMap[day]} status for you😥`);
        }
    });
     */

    try {
        statusVariants.forEach((statusVariant) => {
            const statusOptions = statusVariant.statusOptions;
            const day = Number(statusVariant.day);
            const daysForward = Number(statusVariant.daysForward);

            const statusOption = statusOptions[Math.floor(Math.random() * statusOptions.length)];
            const status = statusOption.status;
            const statusEmoji = statusOption.statusEmoji;

            if (statusOptions === undefined || statusEmoji === undefined || day === undefined || daysForward === undefined) {
                console.error(`statusVariant for day ${dayNameMap[day]} or one of its subfields is missing a field`);
                throw "StopIteration";
            }

            if (nowDay === day) {
                //tray tip
                tray.menu.items[1].label = "Today's status: " + status + " " + statusEmoji;

                setStatus(userToken, status, statusEmoji, daysForward, () => {
                    //pass
                });
                console.log("found status");
                throw "StopIteration";
            }
        })
        console.log("no status for you😥");
    } catch (e) {
        if (e !== "StopIteration") {
            throw e;
        }
    }
}

function getMsUntilMidnight() {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return midnight - now;
}

function scheduleRecFeliz() {
    const msUntilMidnight = getMsUntilMidnight();
    console.log("time until midnight: " + msUntilMidnight);
    setTimeout(recursiveFeliz, msUntilMidnight + 15000);
}

let now = new Date();
let midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

function recursiveFeliz() {
    console.log("waiting for midnight");
    if (new Date() <= midnight) {
        setTimeout(recursiveFeliz, 15000);
        return;
    }
    checkFeliz();
    now = new Date();
    midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    scheduleRecFeliz();
}

async function runScheduledChecker(){
    checkFeliz();
    scheduleRecFeliz();
}

