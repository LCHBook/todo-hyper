/*******************************************************
 * todo-mvc implementation based on ALPS doc
 * utilities (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. Kind (2008)
 *******************************************************/

var fs = require('fs');
var folder = process.cwd() + '/files/';

exports.errorResponse = function(req, res, msg, code, description) {
  var doc;

  doc = {};
  doc.error = {};
  doc.error.code = code;
  doc.error.message = msg;
  doc.error.url = 'http://' + req.headers.host + req.url;
  if (description) {
    doc.error.description = description;
  }

  return {
    code: code,
    doc: doc
  };
}

exports.file = function(req, res, parts, respond) {
  var body, doc, type;

  try {
    body = fs.readFileSync(folder + parts[1]);

    type = 'text/plain';
    if (parts[1].indexOf('.js') !== -1) {
      type = 'application/javascript';
    }
    if (parts[1].indexOf('.css') !== -1) {
      type = 'text/css';
    }
    if (parts[1].indexOf('.html') !== -1) {
      type = 'text/html';
    }
    respond(req, res, {
      code: 200,
      doc: body,
      headers: {
        'content-type': type
      },
      file: true
    });
  } catch (ex) {
    respond(req, res, errorResponse(req, res, "File Not Found", 404));
  }
}

//TK: is this in use?
exports.exception = function(name, message, code) {
  var rtn = {};

  rtn.type = "error";
  rtn.name = name;

  if (message) {
    rtn.message = message;
  } else {
    rtn.message = "Error";
  }
  if (code) {
    rtn.code = code;
  } else {
    rtn.code = 400;
  }
  return rtn;
}

// EOF

