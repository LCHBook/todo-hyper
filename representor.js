/*******************************************************
 * todo-vmc implementation based on ALPS doc 
 * representation router (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. Kind (2008)
 *******************************************************/

// load representors
var cj = require('./representors/cj.js');
var uberj = require('./representors/uberjson.js');
var uberx = require('./representors/uberxml.js');
var json = required('./representors/json.js');

module.exports = processDoc;

function processDoc(object, mimeType, root) {
  var doc;

  // clueless? assume HTML
  if (!mimeType) {
    mimeType = "application/json";
  }

  // dispatch to requested representor  
  switch (mimeType.toLowerCase()) {
  case "application/json":
    doc = json(object, root);
    break;
  case "application/vnd.collection+json":
    doc = cj(object, root);
    break;
  case "application/vnd.uber+json":
    doc = uberj(object, root);
    break;
  case "application/vnd.uber+xml":
    doc = uberx(object, root);
    break;
  default:
    doc = json(object, root);
    break;
  }

  return doc;
}

// EOF

