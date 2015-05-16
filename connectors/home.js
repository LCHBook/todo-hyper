/*******************************************************
 * todo-vmc implementation based on ALPS doc 
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
  var doc, coll;

  coll = [];
  coll.splice(coll.length, 0, transitions("listAll"));
  coll.splice(coll.length, 0, transitions("listActive"));
  coll.splice(coll.length, 0, transitions("listCompleted"));
  coll.splice(coll.length, 0, transitions("addLink"));

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

