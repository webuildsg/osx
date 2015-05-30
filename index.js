'use strict';

var menubar = require('menubar');
var app = require('app');
var ipc = require('ipc');
var path = require('path');

var mb = menubar({
  width: 600,
  height: 480,
  index: 'file://' + path.join(__dirname, 'index.html'),
  icon: 'Icon.png'
});

mb.on('ready', function ready () {
  console.log('Checkout We Build SG menubar app!');

  ipc.on('event', function(event, arg) {
    if(arg === 'quit') {
      app.quit();
    }
  });
});
