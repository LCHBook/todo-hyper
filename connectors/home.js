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

  console.log(parts);
  
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
  var doc, coll, tran, root, list, items, i, x;

  root = '//'+req.headers.host;

  // get data
  list = components.todo('list');
  
  //filter and update the list items as needed
  items = [];
  for(i=0,x=list.length;i<x;i++) {
    items.push(makeItem(list[i], root));
  }
  
  // build up transitions
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
  
  // compose response graph
  doc = {};
  doc.title = "Home";
  doc.actions = coll;
  doc.data =  items;

  // send the response
  respond(req, res, {
    code: 200,
    doc: {
      home: doc
    }
  });
}

function sendItem(req, res, id, respond) {
  var item, doc, trans, rot, coll;

  root = '//'+req.headers.host;

  console.log(id);
  
  item = components.todo('read', id);
  if (Array.isArray(item) && item[0] === null) {
    doc = utils.errorResponse(req, res, 'File Not Found', 404);
  }
  else {
    // clean up
    item = makeItem(item,root);
    // build up transitions
    coll = [];
    tran = transitions("listAll");
    tran.href = root + "/";
    tran.rel = "collection";
    coll.splice(coll.length, 0, tran);
  
    tran = transitions("listActive");
    tran.href = root + "/"
    tran.rel = "collection active";
    coll.splice(coll.length, 0, tran);
  
    tran = transitions("listCompleted");
    tran.href = root + "/"
    tran.rel = "collection completed";
    coll.splice(coll.length, 0, tran);
  
    tran = transitions("addForm");
    tran.rel = "create-form";
    coll.splice(coll.length, 0, tran);
  
    // compose response graph
    doc = {};
    doc.title = "Home";
    doc.actions = coll;
    doc.data = item;
  
    // send the response
    respond(req, res, {
      code: 200,
      doc: {
        home: doc
      }
    });
  }
}

function makeItem(item,root) {
  var i, x;
  var rtn = {};
  var props = ["id", "title", "completeFlag"]
  rtn._rel = "item";
  rtn._href = root+"/" + item.id;
  for(i=0,x=props.length;i<x;i++) {
    rtn[props[i]] = item[props[i]];
  }
  return rtn;
}
// EOF

