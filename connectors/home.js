/*******************************************************
 * todo-mvc implementation based on ALPS doc
 * home connector (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. Kind (2008)
 *******************************************************/

var root = '';
var utils = require('./utils.js');
var components = require('./../components.js');
var transitions = require('./../transitions.js');

module.exports = main;

function main(req, res, parts, respond) {
  var code, doc;

  switch (req.method) {
  case 'GET':
    if (parts[1] && parts[1].indexOf('?') === -1) {
      sendItem(req, res, parts[1], respond);
      break;
    }
    else {
      sendList(req, res, respond);
    }
    break;
  case 'POST':
  case 'PUT':
  case 'DELETE':
  case 'PATCH':
    respond(req, res, utils.errorResponse(req, res, 'Method Not Allowed', 405));
    break;
  default:
    respond(req, res, utils.errorResponse(req, res, 'Method Not Allowed', 405));
    break;
  }
}

function sendList(req, res, respond) {
  var doc, coll, tran, root;

  root = '//'+req.headers.host;
  
  coll = [];
  
  tran  = transitions("listAll");
  tran.href = root + "/";
  tran.rel = "collection";
  coll.splice(coll.length, 0, tran);
  
  tran = transitions("listActive");
  tran.href = root + "/"
  tran.rel ="collection active";
  coll.splice(coll.length, 0, tran);

  tran = transitions("listCompleted");
  tran.href = root + "/"
  tran.rel = "collection completed";
  coll.splice(coll.length, 0, tran);
  
  tran = transitions("addForm");
  tran.rel = "create-form";
  coll.splice(coll.length, 0, tran);
  
  doc = {};
  doc.title = "Home";
  doc.actions = coll;
  doc.data =  components.todo('list');

  respond(req, res, {
    code: 200,
    doc: {
      home: doc
    }
  });
}

// EOF

