/*******************************************************
 * todo-vmc implementation based on ALPS doc 
 * todo connector  (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. Kind (2008)
 *******************************************************/

var root = '';
var qs = require('querystring');
var utils = require('./utils.js');
var components = require('./../components.js');
var transitions = require('./../transitions.js');

module.exports = main;

function main(req, res, parts, respond) {
  var code, doc;

  switch (req.method) {
  case 'GET':
    if (parts[1] && parts[1].indexOf('?') === -1) {
      switch (parts[1]) {
      case "all":
        sendList(req, res, respond, parts[1]);
        break;
      default:
        sendItem(req, res, parts[1], respond);
        break;
      }
    } else {
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

function sendList(req, res, respond, filter) {
  var list, doc, qlist, q, f, trans;

  q = req.url.split('?');
  if (q[1] !== undefined) {
    qlist = qs.parse(q[1]);
    switch (filter) {
    case "all":
      list = components.task('filter', qlist);
      break;
    case "bycategory":
      f = {
        "category": qlist["q"]
      };
      list = components.task('filter', f);
      break;
    case "bytitle":
      f = {
        "title": qlist["q"]
      };
      list = components.task('filter', f);
      break;
    case "bycomplete":
      f = {
        "completeFlag": qlist["q"]
      };
      list = components.task('filter', f);
      break;
    default:
      respond(req, res, utils.errorResponse(req, res, 'File Not Found', 404, 'Invalid Search'));
      break;
    }
  } else {
    if (!filter) {
      list = components.task('list');
    } else {
      switch (filter) {
      case "bycategory":
        sendFilterByCategory(req, res, respond);
        break;
      case "bytitle":
        sendFilterByTitle(req, res, respond);
        break;
      case "bycomplete":
        sendFilterByComplete(req, res, respond);
        break;
      default:
        respond(req, res, utils.errorResponse(req, res, 'File Not Found', 404, 'Invalid Search'));
        break;
      }
    }
  }

  if (list !== undefined) {
    trans = [];
    trans.push(transitions('homeLink'));
    trans.push(transitions('taskCollectionLink'));
    trans.push(transitions('taskAddLink'));
    trans.push(transitions('taskAddForm'));
    trans.push(transitions('taskFindByTitleLink'));
    trans.push(transitions('taskFindByTitleForm'));
    trans.push(transitions('taskFindByCategoryLink'));
    trans.push(transitions('taskFindByCategoryForm'));
    trans.push(transitions('taskFindByCompleteLink'));
    trans.push(transitions('taskFindByCompleteForm'));
    trans.push(transitions('taskCompleteLink'));
    trans.push(transitions('taskCompleteForm'));
    trans.push(transitions('taskAssignUserLink'));
    trans.push(transitions('taskAssignUserForm'));

    doc = {
      code: 200,
      doc: {
        task: {
          actions: trans,
          data: list
        }
      }
    }
    respond(req, res, doc);
  }
}

function sendItem(req, res, id, respond) {
  var rtn, doc, trans;

  rtn = components.task('read', id);
  if (Array.isArray(rtn) && rtn[0] === null) {
    doc = utils.errorResponse(req, res, 'File Not Found', 404);
  } else {
    trans = [];
    trans.push(transitions('homeLink'));
    trans.push(transitions('taskCollectionLink'));
    trans.push(transitions('taskAddLink'));
    trans.push(transitions('taskAddForm'));
    trans.push(transitions('taskFindByTitleLink'));
    trans.push(transitions('taskFindByTitleForm'));
    trans.push(transitions('taskFindByCategoryLink'));
    trans.push(transitions('taskFindByCategoryForm'));
    trans.push(transitions('taskFindByCompleteLink'));
    trans.push(transitions('taskFindByCompleteForm'));
    trans.push(transitions('taskCompleteLink'));
    trans.push(transitions('taskCompleteForm'));
    trans.push(transitions('taskAssignUserLink'));
    trans.push(transitions('taskAssignUserForm'));

    doc = {
      code: 200,
      doc: {
        task: {
          actions: trans,
          data: rtn
        }
      }
    };
  }
  respond(req, res, doc);
}


// forms


function sendCompleteForm(req, res, id, respond) {
  var item, trans, doc, i, x;

  item = components.task('read', id)[0];

  trans = [];
  trans.push(transitions('homeLink'));
  trans.push(transitions('taskCollectionLink'));

  // pull and populate target form
  rtn = transitions("taskCompleteForm");
  for (i = 0, x = rtn.inputs.length; i < x; i++) {
    switch (rtn.inputs[i].name) {
    case "id":
      rtn.inputs[i].value = item.id;
      break;
    case "completeFlag":
      rtn.inputs[i].value = item.completeFlag;
      break;
    }
  }
  trans.push(rtn);

  doc = {
    code: 200,
    doc: {
      actions: trans
    }
  };
  respond(req, res, doc);
}

function sendAssignUserForm(req, res, id, respond) {
  var item, trans, rtn, doc, i, x;

  item = components.task('read', id)[0];

  trans = [];
  trans.push(transitions('homeLink'));
  trans.push(transitions('taskCollectionLink'));

  // pull and populate target form
  rtn = transitions("taskAssignUserForm");
  for (i = 0, x = rtn.inputs.length; i < x; i++) {
    switch (rtn.inputs[i].name) {
    case "id":
      rtn.inputs[i].value = item.id;
      break;
    case "userName":
      rtn.inputs[i].value = item.user;
      break;
    }
  }
  trans.push(rtn);

  doc = {
    code: 200,
    doc: {
      actions: trans
    }
  };
  respond(req, res, doc);
}

function sendAddTaskForm(req, res, respond) {
  var doc, trans;

  trans = [];
  trans.push(transitions('homeLink'));
  trans.push(transitions('taskCollectionLink'));
  trans.push(transitions("taskAddForm"));

  doc = {
    code: 200,
    doc: {
      actions: trans
    }
  };

  respond(req, res, doc);
}

function sendFilterByCategory(req, res, respond) {
  var trans, doc;

  trans = [];
  trans.push(transitions('homeLink'));
  trans.push(transitions('taskCollectionLink'));
  trans.push(transitions("taskFindByCategoryForm"));

  doc = {
    code: 200,
    doc: {
      actions: trans
    }
  };

  respond(req, res, doc);
}

function sendFilterByTitle(req, res, respond) {
  var trans, doc;

  trans = [];
  trans.push(transitions('homeLink'));
  trans.push(transitions('taskCollectionLink'));
  trans.push(transitions("taskFindByTitleForm"));

  doc = {
    code: 200,
    doc: {
      actions: trans
    }
  };

  respond(req, res, doc);
}

function sendFilterByComplete(req, res, respond) {
  var trans, doc;

  trans = [];
  trans.push(transitions('homeLink'));
  trans.push(transitions('taskCollectionLink'));
  trans.push(transitions("taskFindByCompleteForm"));
  doc = {
    code: 200,
    doc: {
      actions: trans
    }
  };

  respond(req, res, doc);
}

// write operations


function addItem(req, res, respond) {
  var body, doc, msg, list, ctype;

  ctype = '';
  body = '';
  req.on('data', function(chunk) {
    body += chunk;
  });

  req.on('end', function() {
    try {
      ctype = req.headers["content-type"];
      switch (ctype) {
      case "application/x-www-form-urlencoded":
        msg = qs.parse(body);
        break;
      default:
        msg = JSON.parse(body);
        break;
      }

      msg = validateAddItem(msg);
      if (msg.type === 'error') {
        doc = utils.errorResponse(req, res, msg.message, msg.code);
      } else {
        list = components.task('add', msg);
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

function validateAddItem(msg) {
  var doc, item;

  // reqiured properties
  if (!msg.title) {
    doc = utils.exception("Task", "Missing [title] property", 400);
    return doc;
  }

  if (!msg.category) {
    doc = utils.exception("Task", "Missing [category] property", 400);
    return doc;
  }

  // default other properties
  if (!msg.completeFlag) {
    msg.completeFlag = false;
  }
  if (!msg.dueDate) {
    msg.dueDate = null;
  }
  if (!msg.description) {
    msg.description = '';
  }

  // lookup is not "on key" here!
  // validate category against storage
  //if(msg.category) {
  //  item = components.category('read', msg.category);
  //  if(!item[0]) {
  //    doc = utils.exception("Task", "Invalid [category] property", 400);
  //    return doc;
  //  }
  //}
  return msg;
}

function completeItem(req, res, respond) {
  var body, doc, msg, list, ctype;

  ctype = '';
  body = '';
  req.on('data', function(chunk) {
    body += chunk;
  });

  req.on('end', function() {
    try {
      ctype = req.headers["content-type"];
      switch (ctype) {
      case "application/x-www-form-urlencoded":
        msg = qs.parse(body);
        break;
      default:
        msg = JSON.parse(body);
        break;
      }

      msg = validateCompleteItem(msg);
      if (msg.type === 'error') {
        doc = utils.errorResponse(req, res, msg.message, msg.code);
      } else {
        var item = {};
        item.completeFlag = (msg.completeFlag === "true" ? true : false);
        list = components.task('update', msg.id, item, true);
      }
    } catch (ex) {
      doc = utils.errorResponse(req, res, 'Server Error', 500);
    }
    if (!doc) {
      sendItem(req, res, msg.id, respond);
    } else {
      respond(req, res, doc);
    }
  });
}

function validateCompleteItem(msg) {
  var doc;

  // required properties
  if (msg.completeFlag === undefined) {
    doc = utils.exception("Task", "Missing [completeFlag] property", 400);
    return doc;
  }

  if (msg.id === undefined) {
    doc = utils.exception("Task", "Missing [id] property", 400);
    return doc;
  }

  return msg;
}

function assignItem(req, res, respond) {
  var body, doc, msg, list, ctype;

  ctype = '';
  body = '';
  req.on('data', function(chunk) {
    body += chunk;
  });

  req.on('end', function() {
    try {
      ctype = req.headers["content-type"];
      switch (ctype) {
      case "application/x-www-form-urlencoded":
        msg = qs.parse(body);
        break;
      default:
        msg = JSON.parse(body);
        break;
      }

      msg = validateAssignItem(msg);
      if (msg.type === 'error') {
        doc = utils.errorResponse(req, res, msg.message, msg.code);
      } else {
        var item = {};
        item.user = msg.userName
        list = components.task('update', msg.id, item, true);
      }
    } catch (ex) {
      doc = utils.errorResponse(req, res, 'Server Error', 500);
    }

    if (!doc) {
      sendItem(req, res, msg.id, respond);
    } else {
      respond(req, res, doc);
    }
  });
}

function validateAssignItem(msg) {
  var doc, item;

  // required properties
  if (!msg.id) {
    doc = utils.exception("Task", "Missing [id] property", 400);
    return doc;
  }

  if (!msg.userName) {
    doc = utils.exception("Task", "Missing [userName] property", 400);
    return doc;
  }

  // validate userName against storage
  item = components.user('read', msg.userName);
  if (!item[0]) {
    doc = utils.exception("Task", "Invalid [userName] property", 400);
    return doc;
  }

  return msg;
}

// EOF

