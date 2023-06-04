const forever = require('forever-monitor');

forever.start('FelizCheck.js', {
    max: 3,
    silent: false,
    uid: 'FelizJueves',
  }); 

process.exit();