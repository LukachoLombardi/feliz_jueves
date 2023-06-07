const fs = require("fs");
const {basename} = require("path");
const discord = require("discord-user-bots");

let tokenPath = __dirname + "/token.txt";
let settingsPath = __dirname + "/settings.json";
let userToken = "token"


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

function checkFeliz() {
    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));

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

    let statusVariants = settings.statusVariants;

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

main();
async function main(){
    while(fs.existsSync(tokenPath) === false){
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    console.log("found token file");
    userToken = fs.readFileSync(tokenPath, "utf8");
    while(userToken === undefined || userToken.length === 0){
        userToken = fs.readFileSync(tokenPath, "utf8");
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    console.log("found token value");
    checkFeliz();
    scheduleRecFeliz();
}
