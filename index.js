var menubar = require('menubar');

var mb = menubar({
  dir: __dirname,
  width: 600,
  height: 480
})

mb.on('ready', function ready () {
  console.log('Checkout We Build SG menubar app!')
})
