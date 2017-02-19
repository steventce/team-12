process.chdir(__dirname);

var express = require('express');
var path = require('path');
var homePath = require('os').homedir()
var dbConfig = require('./.db-config.json');

var app = express();

var mysql      = require('mysql');
var connection = mysql.createConnection(dbConfig);

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

const PORT = process.env.PORT || 3000;

//static assets
app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));

// Always return the main index.html, so react-router renders the route in the client
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
});

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// Diabled for now
// 

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

require('./components/reservations')(app);
require('./components/locations')(app);
require('./components/admin')(app);
require('./components/adminReservations')(app);
require('./components/adminResources')(app);
require('./components/adminLocations')(app);

app.listen(PORT, () => {
	console.log('App listening on port ' + PORT)
});