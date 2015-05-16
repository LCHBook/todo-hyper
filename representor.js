/*******************************************************
 * todo-vmc implementation based on ALPS doc 
 * representation router (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. Kind (2008)
 *******************************************************/

// load representors
var json = require('./representors/json.js');

module.exports = processDoc;

function processDoc(object, mimeType, root) {
  var doc;

  // clueless? assume JSON
  if (!mimeType) {
    mimeType = "application/json";
  }

  // dispatch to requested representor  
  switch (mimeType.toLowerCase()) {
    case "application/json":
      doc = json(object, root);
      break;
    default:
      doc = json(object, root);
      break;
  }

  return doc;
}

// EOF

