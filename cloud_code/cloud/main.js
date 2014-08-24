var express = require('express');
var parseExpressRawBody = require('parse-express-raw-body');
var app = express();

// Global app configuration section
app.use(express.bodyParser());
app.use(parseExpressRawBody());

app.post('/addEndorsement',
         function(req, res) {
  // Use Parse JavaScript SDK to create a new message and save it.
  var Endorsement = Parse.Object.extend("Endorsement");


  // String manipulation to find the section we want
  var fullBody = req.body.toString();
  var start = fullBody.indexOf('Content-Disposition: form-data; name="stripped-text"');
  var partial1 = fullBody.substring(start + 50, fullBody.length-1);
  var partial2 = partial1.substring(partial1.indexOf('\n'), partial1.indexOf('--'));
  console.log('partial2 is: '+ partial2);

  // Get all names and add them separately
  var names = partial2.split('\n');
  for (var i = names.length - 1; i >= 0; i--) {
    var name = names[i];
    if (!name || name === '' || name === ' ' || name === '\n') continue;
    name = name.trim();
    console.log('name is: '+ name);
    var endorsement = new Endorsement();
    endorsement.save({ name: name }).then(function(endorsement) {
      console.log('saved endorsement named \"' + endorsement.get('name') + '\"');
    }, function(error) {
      res.status(500);
      res.send('Error');
    });
  }
  res.send('Success');
});

app.listen();
