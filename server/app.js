process.chdir(__dirname);

var express = require('express');
var path = require('path');

var app = express();

const PORT = process.env.PORT || 3000;

//static assets
app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));

// Always return the main index.html, so react-router renders the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
	console.log('App listening on port ' + PORT)
});