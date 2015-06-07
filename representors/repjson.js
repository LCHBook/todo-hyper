/*******************************************************
 * todo-mvc implementation based on ALPS doc
 * internal JSON representor format (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. King (2008)
 *******************************************************/

// reference: Format for Abstract Representations (FAR)

// internal JSON representor
module.exports = repjson;

function repjson(object) {

  // emit the full internal representor graph
  return JSON.stringify(object, null, 2);
}

// EOF

