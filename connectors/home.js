/*******************************************************
 * todo-mvc implementation based on ALPS doc
 * home connector (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. King (2008)
 *******************************************************/

// handles HTTP resource operations (per resource)

var root = '';
var props =  ["id","title","completeFlag"];

var qs = require('querystring');
var map = require('./../maps.js');
var utils = require('./utils.js');
var components = require('./../components.js');
var transitions = require('./../transitions.js');

module.exports = main;

function main(req, res, parts, respond) {
  var sw;

  switch (req.method) {
  case 'GET':
    sw = parts[0]||"*";
    switch(sw[0]) {
      case '?':
        sendList(req, res, respond, getQArgs(req));
        break;
      case "*":
        sendList(req, res, respond);
        break;
      default:
        sendItem(req, res, sw, respond);
        break;
    }
    break;
  case 'POST':
    addItem(req, res, respond);
    break;
  case 'PUT':
    updateItem(req, res, parts[0], respond);
    break;
  case 'DELETE':
    removeItem(req, res, parts[0], respond);
    break;
  default:
    respond(req, res, utils.errorResponse(req, res, 'Method Not Allowed', 405));
    break;
  }
}

function addItem(req, res, respond) {
  var body, doc, msg, ctype, item;

  ctype = '';
  body = '';
  req.on('data', function(chunk) {
    body += chunk;
  });

  req.on('end', function() {
    try {
      msg = utils.parseBody(body, req.headers["content-type"]);
      item = validateItem(msg, props);      
      if (item.title === "") {
        doc = utils.errorResponse(req, res, "Missing Title", 400);
      } else {
        components.todo('add', item);
      }
    } catch (ex) {
      doc = utils.errorResponse(req, res, 'Server Error', 500);
    }

    if (!doc) {
      sendList(req, res, respond, "");
    } else {
      respond(req, res, doc);
    }
  });
}

function updateItem(req, res, id, respond) {
  var body, doc, msg, ctype, item;

  ctype = '';
  body = '';
  req.on('data', function(chunk) {
    body += chunk;
  });

  req.on('end', function() {
    try {
      msg = utils.parseBody(body, req.headers["content-type"]);
      item = validateItem(msg, props);
      item.id = id;      
      if (item.title === "") {
        doc = utils.errorResponse(req, res, "Missing Title", 400);
      } else {
        components.todo('update', id, item);
      }
    } catch (ex) {
      doc = utils.errorResponse(req, res, 'Server Error', 500);
    }

    if (!doc) {
      sendList(req, res, respond, "");
    } else {
      respond(req, res, doc);
    }
  });
}

function removeItem(req, res, id, respond) {
  var list, doc;
  
  item = components.todo('read', id);
  if(item===null) {
    doc = utils.errorResponse(req, res, "File Not Found", 404);
  }
  else {
    list = components.todo('remove', id);
  }
  
  if (!doc) {
    sendList(req, res, respond, "");
  } else {
    respond(req, res, doc);
  }
}

function sendList(req, res, respond, filter) {
  var doc, coll, tran, root, list, items, i, x, pass, p;

  root = '//'+req.headers.host;
  pass = {};
  
  // get data
  if(filter) {
    for(var f in filter) {
      p = map("todo",f,"ex2in");
      pass[p] = filter[f];
    }
    list = components.todo('filter',pass);
  }
  else {
    list = components.todo('list');
  }
  
  // update interface of items
  items = [];
  for(i=0,x=list.length;i<x;i++) {
    items.push(parseItem(list[i], props, root));
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
  
  // compose graph 
  doc = {};
  doc.title = "ToDo";
  doc.actions = coll;
  doc.data =  items;

  // send the graph
  respond(req, res, {
    code: 200,
    doc: {
      todo: doc
    }
  });
}

function sendItem(req, res, id, respond) {
  var list, doc, trans, root, coll, items, rtn;

  root = '//'+req.headers.host;

  list = components.todo('read', id);
  if (Array.isArray(list) && list[0] === null) {
    rtn = utils.errorResponse(req, res, 'File Not Found', 404);
  }
  else {

    // clean up a single item
    items = [];
    items.push(parseItem(list[0], props, root));
    
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
  
    // compose graph
    doc = {};
    doc.title = "ToDo";
    doc.actions = coll;
    doc.data = items;
    rtn = {
      code: 200,
      doc: {
        todo: doc
      }
    }
  }
  // send graph
  respond(req, res, rtn);
}

// fields to display (with mapping)
function parseItem(item, props, root) {
  var i, x, rtn;
  
  rtn = {};
  rtn.meta = {};
  rtn.meta.rel = "item";
  rtn.meta.href = root + "/" + item.id;
  for(i=0,x=props.length;i<x;i++) {
    rtn[map("todo",props[i],"in2ex")] = item[props[i]];
  }
  return rtn;
}

function validateItem(msg, props) {
  var item, i, x;
  
  item = {};
  for(i=0,x=props.length;i<x;i++) {
    item[props[i]] = msg[map("todo",props[i],"in2ex")];
  }
  
  if(!item.completeFlag) {
    item.completeFlag = "false";
  }
  return item;
}

// parse the querystring args
// TK: move this to utils?
function getQArgs(req) {
  var q, qlist;
  
  qlist = null;
  q = req.url.split('?');
  if (q[1] !== undefined) {
    qlist = qs.parse(q[1]);
  }
  return qlist;
}

// EOF

