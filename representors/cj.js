/*******************************************************
 * todo-vmc implementation based on ALPS doc 
 * cj representor (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. Kind (2008)
 *******************************************************/

// json representor
module.exports = cj;

function cj(object, root) {

  console.log(JSON.stringify(object, null, 2));
  
  var rtn = {};
  rtn.collection = {};

  rtn.collection.version = "1.0";
  rtn.collection.href = root;
  rtn.collection.title = "ToDo MVC";

  rtn.collection.links = [];
  rtn.collection.items = [];
  rtn.collection.queries = [];
  rtn.collection.template = {};
  rtn.collection.error = {};
  
  return JSON.stringify(rtn, null, 2);
}

// EOF

