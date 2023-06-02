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
const settings = JSON.parse(fs.readFileSync("settings.json", "utf8"));
const userToken = fs.readFileSync("token.txt", "utf8");

if(userToken === undefined){
    console.error("token.txt is empty or missing");
    process.exit();
}

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

statusVariants = settings.statusVariants;

statusVariants.forEach((statusVariant) => {
    const day = statusVariant.day;
    if(nowDay !== day){
        console.log(`no ${dayNameMap[day]} status for you😥`);
    }
});

try{
statusVariants.forEach((statusVariant) => {
    const statusOptions = statusVariant.statusOptions;
    const day = statusVariant.day;
    const daysForward = statusVariant.daysForward;

    const statusOption = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const status = statusOption.status;
    const statusEmoji = statusOption.statusEmoji;

    if(statusOptions === undefined || statusEmoji === undefined || day === undefined || daysForward === undefined){
        console.error(`statusVariant for day ${dayNameMap[day]} or one of its subfields is missing a field`);
        process.exit();
    }

    if(nowDay === day){
        setStatus(userToken, status, statusEmoji, daysForward, () => {process.exit();});
        throw "StopIteration"
    }
})}
catch (e) {
    if (e !== "StopIteration") {
        throw e;
    }
}
