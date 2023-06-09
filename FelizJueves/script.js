win = nw.Window.get(undefined);
win.resizeBy(20, 200)
win.setResizable(false);

const fs = require("fs");
const path = require("path");

const settingsPath = path.join(nw.App.dataPath, "settings.json");
const tokenPath = path.join(nw.App.dataPath, "token.txt");

// language=HTML
let VariantSettings = `
    <div class="VariantSettings boxed rounded">
        <details>
            <summary class="VariantSummary">New Variant</summary>
            <label><input class="Day narrower" type="number" min="0" max="6" onfocusout="ensureUniqueDay(event);">
                Day</label>
            <br>
            <label><input class="DaysForward narrower" type="number" min="0" value="1"> Days Forward</label>
            <br>
            <ul class="StatusOptions">
                <!--add in StatusOptions here-->
            </ul>
            <button style="margin-left: 5px" onclick="addStatusOption(event);">+ Status</button>
            <button style="margin-left: 5px" onclick="removeLatestStatusOption(event);">- Status</button>
        </details>
    </div>
`

//language=HTML
let StatusOption = `
    <li>
        <div class="StatusOption boxed rounded">
            <label><input class="Status" type="text"> Status</label>
            <br>
            <label><input class="StatusEmoji" type="text" onchange="ensureEmoji(event); createSummary(event);">
                Status Emoji</label>
        </div>
    </li>
`

loadSettings();

function loadSettings() {
    console.log("loading settings");

    let settings;
    if (fs.existsSync(settingsPath) === true) {
        settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));

        if(settings.statusVariants.length === 0){
            settings = JSON.parse(fs.readFileSync("settings.json", "utf8"));
        }
    } else {
        settings = JSON.parse(fs.readFileSync("settings.json", "utf8"));
        saveSettings();
    }


    if (fs.existsSync(tokenPath) === true) {
        window.document.getElementById("userToken").value = fs.readFileSync(tokenPath, "utf8");
    } else {
        fs.writeFileSync(tokenPath, "", "utf8");
    }

    let statusVariants = settings.statusVariants;

    statusVariants.forEach((statusVariant) => {
        const statusOptions = statusVariant.statusOptions;
        const day = statusVariant.day;
        const daysForward = statusVariant.daysForward;

        let variantSettingsFrag = document.createRange().createContextualFragment(VariantSettings);

        variantSettingsFrag.querySelector("div.VariantSettings details .Day").setAttribute("value", day);
        variantSettingsFrag.querySelector("div.VariantSettings details .DaysForward").setAttribute("value", daysForward);
        variantSettingsFrag.querySelector("div.VariantSettings details summary.VariantSummary").textContent =
            statusOptions[Math.floor(Math.random() * statusOptions.length)].statusEmoji;

        statusOptions.forEach((statusOption) => {
            let statusOptionFrag = document.createRange().createContextualFragment(StatusOption);

            statusOptionFrag.querySelector("div.StatusOption .Status").value = statusOption.status;
            statusOptionFrag.querySelector("div.StatusOption .StatusEmoji").value = statusOption.statusEmoji;

            variantSettingsFrag.querySelector("div.VariantSettings .StatusOptions").appendChild(statusOptionFrag);
        });

        document.getElementById("SettingsContainer").appendChild(
            variantSettingsFrag
        );
    });
    console.log("loaded settings")
}

function addVariant() {
    let variantSettingsFrag = document.createRange().createContextualFragment(VariantSettings);
    document.getElementById("SettingsContainer").appendChild(
        variantSettingsFrag
    );
}

function addStatusOption(event) {
    let statusOptionFrag = document.createRange().createContextualFragment(StatusOption);
    let variantToAppendTo = event.target.parentElement.querySelector("ul.StatusOptions");
    variantToAppendTo.appendChild(statusOptionFrag);
}

function removeLatestVariant(event) {
    document.getElementById("SettingsContainer").lastElementChild.remove();
}

function removeLatestStatusOption(event) {
    let variantToModify = event.target.parentElement.querySelector("ul.StatusOptions");
    variantToModify.lastElementChild.remove();
}

function createSummary(event) {
    console.debug("creating summary");
    let caller = event.target;
    let summary = event.target.closest("details").querySelector("summary.VariantSummary");
    if (summary.textContent === "new variant" && caller.value != "") {
        summary.textContent = caller.value;
    }
}

function ensureEmoji(event) {
    console.debug("checking for emoji")
    let caller = event.target;
    if (!isEmoji(caller.value)) {
        caller.value = "";
    }
}

function isEmoji(value) {
    var ranges = [
        '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
        '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
        '\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
    ];
    console.debug("valueLength:" + value.length)
    if (value.match(ranges.join('|')) && value.length === 2) {
        return true;
    } else {
        //check doesn't work correctly so for now you can just enter whatever
        //TODO: fix this
        return true;
        return false;
    }
}

function ensureUniqueDay(event) {
    console.debug("checking day uniqueness")
    let caller = event.target;
    let day = caller.value;
    let allDays = document.querySelectorAll("input.Day");
    let allDaysArray = Array.from(allDays);

    let firstOccured = false;
    allDaysArray.forEach((dayInArray) => {
        if (dayInArray.value === day) {
            if (firstOccured) {
                console.debug("day isn't unique");
                caller.value = "";
                return;
            } else {
                firstOccured = true;
            }
        }
    })
}


//also plays some animations and such because
function ensureArgsComplete() {
    let settingsSavedText = document.getElementById("settingsSavedText");
    settingsSavedText.classList.remove("error", "warning", "positive");

    let days = document.querySelectorAll("input.Day");
    let daysArray = Array.from(days);

    let daysForward = document.querySelectorAll("input.DaysForward");
    let daysForwardArray = Array.from(daysForward);

    let statusOptions = document.querySelectorAll("input.StatusOptions");
    let statusOptionsArray = Array.from(statusOptions);

    let states = document.querySelectorAll("input.Status");
    let statesArray = Array.from(states);

    toBeCheckedArray = daysArray.concat(daysForwardArray, statusOptionsArray, statesArray);

    toBeCheckedArray = toBeCheckedArray.map((element) => {
        return element.value;
    });

    console.debug("toBeCheckedArray: " + toBeCheckedArray);

    if (document.getElementById("userToken").value === "") {
        alert("save warning: a user token should be provided");
        settingsSavedText.classList.add("warning");
    }

    if (toBeCheckedArray.includes(undefined) || toBeCheckedArray.includes("")) {
        settingsSavedText.classList.add("error");
        settingsSavedText.innerText = "error"
        playFadeAnim();
        alert("save error: at least one required field is missing");
        return false;
    } else {
        settingsSavedText.classList.add("positive");
        settingsSavedText.innerText = "saved"
        return true;
    }

}

function playFadeAnim(id) {
    document.getElementById(id).classList.remove("hidden");
    setTimeout(() => {
        document.getElementById(id).classList.add("hidden");
    }, 10);
}

function saveSettings() {
    console.log("saving settings");

    if (!ensureArgsComplete()) {
        return;
    }

    let settings = {
        "statusVariants": []
    };

    let variants = document.querySelectorAll("div.VariantSettings");
    let variantsArray = Array.from(variants);

    variantsArray.forEach((variant) => {
        let statusOptions = [];
        let statusOptionsElements = variant.querySelectorAll("div.StatusOption");
        let statusOptionsElementsArray = Array.from(statusOptionsElements);

        statusOptionsElementsArray.forEach((statusOption) => {
            let status = statusOption.querySelector("input.Status").value;
            let statusEmoji = statusOption.querySelector("input.StatusEmoji").value;
            statusOptions.push({
                "status": status,
                "statusEmoji": statusEmoji
            });
        });

        let day = variant.querySelector("input.Day").value;
        let daysForward = variant.querySelector("input.DaysForward").value;

        settings.statusVariants.push({
            "statusOptions": statusOptions,
            "day": day,
            "daysForward": daysForward
        });
    });

    let settingsString = JSON.stringify(settings, null, 4);

    fs.writeFileSync(settingsPath, settingsString);
    fs.writeFileSync(tokenPath, window.document.getElementById("userToken").value);

    playFadeAnim("settingsSavedText");

    console.debug("saved: \n" + settingsString);
    console.log("saved settings");
}

const {exec, execSync} = require('child_process');
const {basename} = require("path");

function addToAutostart() {
    console.log("adding file to autostart");

    //check for platform
    if (process.platform === "win32") {
        //let autostartPath = process.env.APPDATA + "\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\";
        //fs.copyFileSync(file, autostartPath);
        let batPath = process.env.APPDATA + "\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\FelizCheck.bat";
        fs.writeFileSync(batPath,
            `
            @echo off

            setlocal

            cd /d "${process.cwd()}"
            cd ..
            set exe_file="%cd%\\FelizJueves.exe"
            start "" %exe_file%
        `,
            "utf8");
        /*
        exec(`"${path}"`, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("FelizCheck says: " + stdout);
        }
        );
       */
    } else if (process.platform === "linux") {
        let filePath = "/FelizCheck/FelizJueves";
        const output = execSync('crontab -e @reboot ' + filePath, {encoding: 'utf-8'});
    } else {
        console.log("platform not supported");
        alert("platform not supported. Please add the file to autostart manually");
        return;
    }
    console.log("added file to autostart");
}