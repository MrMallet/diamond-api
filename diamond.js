//http://blogs.plexibus.com/2009/01/15/rest-esting-with-curl/
// Import express to create and configure the HTTP server.
var express = require('express');
var bodyParser = require('body-parser');
// Create a HTTP server app.
var app = express();
// Import the fs module so that we can read in files.
var fs = require('fs');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // this line from vlads passes the VALUES

// Read in the text file and parse it for JSON.
var data = JSON.parse(fs.readFileSync('prices-of-diamondsShort.json','utf8'));

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

db.serialize(function() {
  db.run("CREATE TABLE diamond( 'id' INTEGER PRIMARY KEY NOT NULL, 'carat' REAL, 'cut' TEXT, 'color' TEXT, 'clarity' TEXT, 'depth' REAL, 'table' INTEGER, 'price' real, 'x' REAL, 'y' REAL, 'z' REAL)");
  var stmt = db.prepare("INSERT INTO diamond VALUES (NULL,?,?,?,?,?,?,?,?,?,?)");
  data.forEach(function (fill){
    stmt.run(fill.carat, fill.cut, fill.color, fill.clarity, fill.depth, fill.table, fill.price, fill.x, fill.y, fill.z );
  });
  stmt.finalize();
});

//db.close();
app.get('/', function(req, res) {
  res.send("This is the Diamond API.");
});

app.get('/diamond/id/:id', function(req, res) {
  var result;
    db.each("SELECT * from diamond where id ="+ req.params.id, function(err, row){
      res.send( "\t id: " + row.id + " \t carat: " + row.carat + " \t color: "+ row.color);
      //console.log("Made it this far");
    });
});

app.post('/diamonds/add/', function(req, res){
  var stmt = db.prepare("INSERT INTO diamond VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  stmt.run(req.body.carat, req.body.cut, req.body.color, req.body.clarity, req.body.depth, req.body.tablefield, req.body.price, req.body.x, req.body.y, req.body.z);
  stmt.finalize();
  res.send("Diamond Added\n");
});

// Start the server.
var server = app.listen(8000);
