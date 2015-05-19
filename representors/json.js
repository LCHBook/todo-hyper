/*******************************************************
 * todo-mvc implementation based on ALPS doc
 * json representor (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. King (2008)
 *******************************************************/

// json representor
// strip out transitions
module.exports = json;

function json(object) {
  var i, x;
  
  for (var p in object) {
    switch (p) {
    case "actions":
      delete object[p];
      break;
    case "todo":
    default:
      delete object[p].actions;
      if (object[p].data) {
        object[p] = object[p].data;
        delete object[p].data;
        for(i=0,x=object[p].length;i<x;i++) {
          delete object[p][i].meta;
        } 
      } 
      break;
    }
  }

  return JSON.stringify(object, null, 2);
}

// EOF

