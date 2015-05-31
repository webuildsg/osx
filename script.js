var config = require('./config');
var path = require('path');
var ipc = require('ipc');
var notifier = require('node-notifier');
var shell = require('shell');
var CronJob = require('cron').CronJob;
var moment = require('moment-timezone');

function renderFeedback() {
  var templateSource = document.getElementById('template-feedback').innerHTML;
  var template = Handlebars.compile(templateSource);
  var resultsPlaceholder = document.getElementById('result-feedback');
  resultsPlaceholder.innerHTML = template({
    feedback: config.feedback
  });
}

function renderTemplate(type, data) {
  var templateSource = document.getElementById('template-' + type).innerHTML;
  var template = Handlebars.compile(templateSource);
  var resultsPlaceholder = document.getElementById('result-' + type);
  resultsPlaceholder.innerHTML = template(data);
}

function isWithinAnHour(startTime) {
  moment(startTime, 'DD MMM YYYY, ddd, hh:mm a').isBefore(moment().add(1, 'hour'))
}

function createNotification(nextEvent) {
  // if upcoming event starts within the next hour,
  // create a notification
  if (isWithinAnHour(nextEvent.formatted_time)) {
    notifier.notify({
      'title': nextEvent.name,
      'message': 'by ' + nextEvent.group_name + ' on ' + nextEvent.formatted_time,
      'icon': path.join(__dirname, 'logo.png'),
      'wait': true,
      'open': nextEvent.url
    });
  }
}

function callAPI(type, willNotify){
  var xhr = new XMLHttpRequest();
  xhr.onload = function(){
    var body = JSON.parse(this.responseText);
    var data = {};
    data[type] = body[type].slice(0, 3);
    if (type === 'events' && willNotify) {
      createNotification(data[type][0]);
    }
    data.website = config.website;
    data.feedback = config.feedback;
    renderTemplate(type, data);
  };
  xhr.open('GET', config.apiUrl + type, true);
  xhr.send();
}

document.body.addEventListener('click', function(e){
  var el = e.target;
  if (!el) return;
  if (el.tagName.toLowerCase() == 'a' && el.target == '_blank'){
    e.preventDefault();
    shell.openExternal(el.href);
  }
});

document.getElementById('quit').addEventListener('click', function() {
  ipc.sendSync('event', 'quit');
})

new CronJob('0 0,30 * * * *', function() {
  callAPI('events', true);
  callAPI('repos', true);
}, null, true, config.timezone);

renderFeedback();
callAPI('events', false);
callAPI('repos', false);
