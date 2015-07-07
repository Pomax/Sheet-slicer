var fs = require("fs");
var md5 = require("MD5");
var express = require('express');
var parser = require("body-parser");
var app = express();

app.use(express.static('./public'));

app.param("sheetID", function(req,res,next,sheetID) {
  req.params.sheetID = sheetID;
});

/**
 * Save a sheet and its associated slices to disk
 *
 * @param  {[type]} req  [description]
 * @param  {[type]} res) {               var sheet [description]
 * @return {[type]}      [description]
 */
app.post('/api/save',
  parser.json({
    limit: "10mb"
  }),
  function(req, res) {
    var sheet = req.body.sheet
    sheet = sheet.replace("data:image/",'');
    var type = sheet.substring(0,sheet.indexOf(';base64,'));
    sheet = sheet.replace(type + ";base64,",'');
    // write sheet to disk
    var sheetId = md5(sheet) + "." + type;
    var sheetFile = "public/sheets/" + sheetId;
    var buffer = new Buffer(sheet, 'base64');
    fs.writeFile(sheetFile, buffer);
    // write slice information to disk
    var slices = req.body.slices;
    var sliceFile = "public/sheets/slices/" + sheetId + ".json";
    fs.writeFile(sliceFile, JSON.stringify(slices, false, 2));
    // done
    res.status(200).json({status: "OK"});
  }
);

/**
 * Get the list of saved sheets
 *
 * @param  {[type]} req  [description]
 * @param  {[type]} res) {               fs.readdir("public/sheets", function(err, files) {      files [description]
 * @return {[type]}      [description]
 */
app.get('/api/list',
  function(req, res) {
    fs.readdir("public/sheets", function(err, files) {
      files = files.filter(function(f) {
        return f.indexOf(".") !== -1;
      });
      res.json(files);
    });
  }
);

/**
 * Load a sheet and its associated slice information
 * @param  {[type]} req  [description]
 * @param  {[type]} res) {               var sheetId [description]
 * @return {[type]}      [description]
 */
app.get('/api/load/:sheetId',
  function(req, res) {
    var sheetId = req.params.sheetId;
    var sheetFile = "public/sheets/" + sheetId;
    fs.readFile(sheetFile, function(err, sheet) {
      var type = sheetId.substring(sheetId.indexOf(".") + 1);
      var sheetdata = "data:image/" + type + ";base64," + new Buffer(sheet).toString("base64");
      var sliceFile = "public/sheets/slices/" + sheetId + ".json";
      fs.readFile(sliceFile, function(err, slices) {
        res.status(200).json({
          sheet: sheetdata,
          slices: JSON.parse(slices)
        });
      });
    });
  }
);

// run the server.
mkdirp("public/sheets/slices", function() {
  var server = app.listen(3000, function () {
    var info = server.address();
    console.log('Example app listening on port %s', info.port);
  });
});
