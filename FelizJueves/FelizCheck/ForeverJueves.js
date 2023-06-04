const forever = require('forever');

const execSync = require('child_process').execSync;
const output = execSync("forever start FelizCheck.js", { encoding: 'utf-8' });