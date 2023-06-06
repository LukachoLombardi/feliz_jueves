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
    const discord = require("discord-user-bots");

    const discordClient = new discord.Client(userToken);


    discordClient.on.ready = function () {
        console.log("user connected");

        let statusPromise = discordClient.set_custom_status({
            text: status,
            emoji: statusEmoji,
            expireAt: seekMidnight(days)
        });

        statusPromise.then((response) => {
            console.log(`changed status to ${status} until ${seekMidnight(days)}`);
        });
        statusPromise.catch((error) => {
            console.error(`status change failed with: ${error}`);
        });
        statusPromise.finally(() => {
            callback()
        })
    };
}

const fs = require("fs");
const userToken = fs.readFileSync("token.txt", "utf8");

if (userToken === undefined || userToken === "") {
    console.error("token.txt is empty or missing");
    nw.App.quit();
    process.exit();
}

function checkFeliz() {
    const settings = JSON.parse(fs.readFileSync("settings.json", "utf8"));

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

    statusVariants = settings.statusVariants;

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

try{
    const tray = new nw.Tray({
        title: 'Feliz Jueves',
        tooltip: 'Feliz Jueves is running🎉',
        icon: 'icon.png'
      });
      
    const menu = new nw.Menu();
    
    menu.append(new nw.MenuItem({
        label: 'Quit',
        click: function() {
            setStatus(userToken, "", "", 0, () => {
                nw.App.quit();}
                );
        }
      }));
      
    tray.menu = menu;
} catch(e){
    console.log("not running in nw.js, so no tray icon")
}

checkFeliz();
scheduleRecFeliz();
