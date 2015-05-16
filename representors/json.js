/*******************************************************
 * todo-mvc implementation based on ALPS doc
 * json representor (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. Kind (2008)
 *******************************************************/

// json representor
module.exports = json;

function json(object) {

  for (var p in object) {
    switch (p) {
    case "actions":
      delete object[p];
      break;
    case "todo":
      object[p].actions = null;
      if (object[p].data) {
        object[p] = object[p].data;
        object[p].data = null;
      } else {
        if (p === "home") {
          delete object[p];
          object[p].actions = null;
        }
      }
      break;
    default:
      delete object[p].actions;
      break;
    }
  }

  return JSON.stringify(object, null, 2);
}

// EOF

