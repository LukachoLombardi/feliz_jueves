//DEPRECATED

const pm2 = require('pm2');

pm2.start('FelizCheck.js', (err, apps) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('FelizCheck.js started successfully');
});
