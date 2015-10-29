// Import express to create and configure the HTTP server.
var express = require('express');
// Create a HTTP server app.
var app = express();
// Import the fs module so that we can read in files.
var fs = require('fs');
// Read in the text file and parse it for JSON.
var data = JSON.parse(fs.readFileSync('prices-of-diamondsShort.json','utf8'));

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

db.serialize(function() {
  db.run("CREATE TABLE diamond( 'id' INTEGER PRIMARY KEY NOT NULL, 'carat' REAL, 'cut' TEXT, 'color' TEXT, 'clarity' TEXT, 'depth' REAL, 'table' INTEGER, 'price' real, 'x' REAL, 'y' REAL, 'z' REAL)");

  var stmt = db.prepare("INSERT INTO diamond  VALUES (NULL,?,?,?,?,?,?,?,?,?,?)");

  data.forEach(function (fill){
          stmt.run(fill.carat, fill.cut, fill.color, fill.clarity, fill.depth, fill.table, fill.price, fill.x, fill.y, fill.z );

  });
  stmt.finalize();

  });

db.close();

app.get('/', function(req, res) {
  res.send("This is the Diamond API.");
});

// Start the server.
var server = app.listen(8000);
