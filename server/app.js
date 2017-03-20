process.chdir(__dirname);

var express = require('express');
var path = require('path');
var homePath = require('os').homedir()

var app = express();

var mysql = require('mysql');

const PORT = process.env.PORT || 3000;

//static assets
app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));

// Always return the main index.html, so react-router renders the route in the client

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

require('./components/reservations')(app);
require('./components/locations')(app);
require('./components/admin')(app);
require('./components/resources')(app);

app.get('/login.js', (req, res)=> {
	res.sendFile(path.resolve(__dirname, 'config', 'login.js'));
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
});

if (!module.parent) {
  app.listen(PORT, () => {
    console.log('App listening on port ' + PORT)
  });
}

module.exports.app = app;
