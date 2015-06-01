'use strict';

var menubar = require('menubar');
var app = require('app');
var ipc = require('ipc');
var path = require('path');

var mb = menubar({
  dir: process.cwd(), // No idea why this is needed for the icon to work
  width: 400,
  height: 480,
  index: 'file://' + path.join(__dirname, 'index.html')
});

mb.on('ready', function ready () {
  console.log('Checkout We Build SG menubar app!');

  ipc.on('event', function(event, arg) {
    if(arg === 'quit') {
      app.quit();
    }
  });
});
