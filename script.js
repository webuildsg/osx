function renderTemplate(type, data) {
  var templateSource = document.getElementById('template-' + type).innerHTML;
  var template = Handlebars.compile(templateSource);
  var resultsPlaceholder = document.getElementById('result-' + type);
  resultsPlaceholder.innerHTML = template(data);
}

function callAPI(type) {
  require('request').get({
    url: 'https://webuild.sg/api/v1/' + type,
    json: true
  }, function(e, r, body) {
    var data = {};
    data[type] = body[type].slice(0, 3);
    renderTemplate(type, data);
  });
}

callAPI('events');
callAPI('repos');
