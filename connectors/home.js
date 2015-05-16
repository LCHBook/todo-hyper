/*******************************************************
 * todo-mvc implementation based on ALPS doc
 * home connector (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. Kind (2008)
 *******************************************************/

var root = '';
var utils = require('./utils.js');
var transitions = require('./../transitions.js');

module.exports = main;

function main(req, res, parts, respond) {

  if (req.method === 'GET') {
    sendHome(req, res, respond);
  } else {
    respond(req, res, utils.errorResponse(req, res, 'Method Not Allowed'));
  }
}

function sendHome(req, res, respond) {
  var doc, coll, tran, root;

  root = '//'+req.headers.host;
  
  coll = [];
  
  tran  = transitions("listAll");
  tran.href = root + "/todo/";
  tran.rel = "collection";
  coll.splice(coll.length, 0, tran);
  
  tran = transitions("listActive");
  tran.href = root + "/todo/"
  tran.rel ="collection active";
  coll.splice(coll.length, 0, tran);

  tran = transitions("listCompleted");
  tran.href = root + "/todo/"
  tran.rel = "collection completed";
  coll.splice(coll.length, 0, tran);
  
  tran = transitions("addForm");
  tran.rel = "create-form";
  coll.splice(coll.length, 0, tran);
  
  doc = {};
  doc.actions = coll;

  respond(req, res, {
    code: 200,
    doc: {
      home: doc
    }
  });
}

// EOF

