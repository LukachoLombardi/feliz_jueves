function seekMidnight(days) {
    //get the properly formatted date of the next midnight
    const now = new Date();
    if (days === 0) {
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
const settings = JSON.parse(fs.readFileSync("settings.json", "utf8"));
const userToken = fs.readFileSync("token.txt", "utf8");

if(userToken === undefined){
    console.error("token.txt is empty or missing");
    process.exit();
}

const status = settings.status;
const statusEmoji = settings.statusEmoji;
const day = settings.day;
const daysForward = settings.daysForward;


const dayNameMap = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday"};

const nowDate = new Date();
const nowDay = nowDate.getDay();

console.log(`it's ${dayNameMap[nowDay]}`);

if(nowDay === day){
    setStatus(userToken, status, statusEmoji, daysForward, () => {process.exit()});
}
else{
    console.log(`no ${status} for you😥`);
}
