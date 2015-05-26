'use strict';

var menubar = require('menubar');
var app = require('app');
var ipc = require('ipc');

var mb = menubar({
  dir: __dirname,
  width: 600,
  height: 480
});

mb.on('ready', function ready () {
  console.log('Checkout We Build SG menubar app!');

  ipc.on('event', function(event, arg) {
    if(arg === 'quit') {
      app.quit();
    }
  });
});
