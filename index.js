'use strict';

var menubar = require('menubar');
var app = require('app');
var ipc = require('ipc');
var path = require('path');

var notification = false;

var mb = menubar({
  width: 400,
  height: 480,
  index: 'file://' + path.join(__dirname, 'index.html'),
  icon: path.join(__dirname, 'IconTemplate.png'),
  preloadWindow: true
});

mb.on('ready', function ready () {
  console.log('Checkout We Build SG menubar app!');

  ipc.on('event', function(event, arg) {
    switch (arg) {
      case 'quit':
        app.quit();
        break;
      case 'notify':
        if (!notification) {
          mb.tray.setImage(path.join(__dirname, 'IconTemplateColored.png'));
          notification = true;
        }
        break;
    }
  });
});

mb.on('after-show', function() {
  if (notification) {
    mb.tray.setImage(path.join(__dirname, 'IconTemplate.png'));
    notification = false;
  }
});
