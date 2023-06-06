const fs = require("fs");

console.log("starting checker");

onOpenCallback();
nw.Window.get(undefined).close();

// configuring the tray
try {
    let trayTooltip;
    let userToken;
    if (fs.existsSync("./FelizCheck/token.txt") === true) {
        userToken = fs.readFileSync("./FelizCheck/token.txt", "utf8");
    } else {
        userToken = "";
    }
    if (userToken === undefined || userToken === "") {
        console.error("token.txt is empty or missing");
        trayTooltip = "token.txt is empty or missing. Add it and restart.";
    } else {
        trayTooltip = "Feliz Jueves is running🎉";
    }

    let tray = new nw.Tray({
        title: 'Feliz Jueves',
        tooltip: trayTooltip,
        icon: 'icon.png'
    });

    let menu = new nw.Menu();

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

runChecker();

nw.App.on("open", onOpenCallback)

function onOpenCallback() {
    console.log("starting webUI");
    nw.Window.open("./FelizJueves.html");
    nw.Window.get(undefined).on("close", () => {
        nw.Window.get(undefined).hide();
    });
}

async function runChecker() {
    require("./FelizCheck/FelizCheck.js");
}
