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
  var saveName = function() {
    var endorsement = new Endorsement();
    endorsement.save({ name: name }).then(function(endorsement) {
      return true;
    }, function(error) {
      return false;
    });
  };

  // Get all names and add them separately
  var fullBody = req.body['stripped-text'] || req.body['body-plain'];
  var names = fullBody.split('\n');
  console.log('Names: ' + JSON.stringify(names));
  for (var i = names.length - 1; i >= 0; i--) {
    var name = names[i];
    if (!name || name === '' || name === ' ' || name === '\n') continue;
    name = name.trim();
    console.log('Creating endorsement with name: '+ name);
    if (!saveName(name)) {
      res.status(500);
      res.send('Error');
      return;
    }
  }
  res.send('Success');
});

app.listen();
