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

  // hacked.
  if(object["home"] && object["home"].actions) {
    rtn.collection.links = buildLinks(object["home"].actions, root);
  }
  
  rtn.collection.items = [];
  rtn.collection.queries = [];
  rtn.collection.template = {};

  if(object.error) {
    rtn.collection.error = buildError(object.error);
  }
  
  return JSON.stringify(rtn, null, 2);
}

function buildLinks(obj, root) {
  var link, rtn, i, x;;

  rtn = [];
  for(i=0,x=obj.length;i<x;i++) {
    if(obj[i].type==="safe" & obj[i].target==="list") {
      link = {rel:"self",href:'http:'+root+'/',prompt:"All ToDos"};
      rtn.push(link);
    }
  }
  return rtn;
}

function buildError(obj) {
  var rtn = {};

  rtn.title = "Error";
  rtn.message = (obj.title||"");
  rtn.code = (obj.code||"");
  rtn.url = (obj.url||"");
  
  return rtn;
}
// EOF

