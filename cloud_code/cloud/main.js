var express = require('express');
var parseExpressRawBody = require('parse-express-raw-body');
var app = express();

// Global app configuration section
app.use(express.bodyParser());
app.use(parseExpressRawBody());

app.post('/addEndorsement',
         function(req, res) {
  var Endorsement = Parse.Object.extend('Endorsement');

  // Get all names from one body of text
  var fullBody = req.body['stripped-text'] || req.body['body-plain'];
  var names = fullBody.split('\n');

  // Create name from first line
  var name = names[0];
  if (name === '' || name === ' ' || name === '\n') {
    res.status(406);
    res.send('Error: Bad data (name was empty)');
    return;
  };
  name = name.trim();

  // Check to see that this is unique (if not, just continue)
  var query = new Parse.Query(Endorsement);
  query.equalTo('name', name);
  query.find({
    success: function(results) {
      if (results.length > 0) {
        res.status(406);
        res.send('Name already exists! Not doing anything');
        return;
      }

      // Actually create the endorsement
      console.log('Creating endorsement with name: '+ name);
      var endorsement = new Endorsement();
      endorsement.save({ name: name }).then(function(endorsement) {
        console.log('Created endorsement: ' + name);
        res.send('Success');
        return;
      }, function(error) {
        res.status(406);
        res.send(error.message);
        return;
      });
    },
    error: function(error) {
      res.status(406);
      res.send(error.message);
      return;
    }
  });

});

app.listen();
