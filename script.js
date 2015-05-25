var path = require('path');

function renderTemplate(type, data) {
  var templateSource = document.getElementById('template-' + type).innerHTML;
  var template = Handlebars.compile(templateSource);
  var resultsPlaceholder = document.getElementById('result-' + type);
  resultsPlaceholder.innerHTML = template(data);
}

function createNotification(events) {
  // TODO: if the upcoming event is in an hour, only then notify
  // FIX: display separate notifications without replacing each other
  events.forEach(function(event) {
    require('node-notifier').notify({
      'title': event.name,
      'message': 'by ' + event.group_name + ' on ' + event.formatted_time,
      'icon': path.join(__dirname, 'logo.png'),
      'wait': true,
      'open': event.url
    });
  })
}

function callAPI(type) {
  require('request').get({
    url: 'https://webuild.sg/api/v1/' + type,
    json: true
  }, function(e, r, body) {
    var data = {};
    data[type] = body[type].slice(0, 3);

    if (type === 'events') {
      createNotification(data[type] );
    }
    renderTemplate(type, data);
  });
}

callAPI('events');
callAPI('repos');

var CronJob = require('cron').CronJob;
new CronJob('0 0,30 * * * *', function() {
  callAPI('events');
  callAPI('repos');
}, null, true, 'Asia/Singapore');
