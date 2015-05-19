/*******************************************************
 * todo-mvc implementation based on ALPS doc
 * transitions document (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. King (2008)
 *******************************************************/

// hold mapping rules for interface v. stored data


// key = internal name
// value = interface name 
function storeMap() {
  var todo, rtn;
  rtn = {};
  
  todo = {};
  todo.id = "id";
  todo.completeFlag = "completed";
  todo.title = "title";
  rtn.todo = todo;
  
  return rtn;
}

// run once at the start
var map = storeMap();

module.exports = main;
function main(object, property, action) {
  var rtn = "";

  switch (action) {
    case "ex2in":
      rtn = ex2in(object, property);
      break;
    case "in2ex":
      rtn = in2ex(object, property);
      break;
  }
  return rtn;  
}

// convert interface name 
//to internal name
function ex2in(object, property) {
  var rtn;
  
  if(map[object]) {
    for(p in map[object]) {
      if(map[object][p]===property) {
        rtn = p;
        break;
      }
    }
  }
  return rtn;
}

//convert internal name 
//to interface name
function in2ex(object, property) {
  var rtn;
  
  if(map[object]) {
    for(p in map[object]) {
      if(p===property) {
        rtn = map[object][property];
        break;
      }
    }
  } 
  return rtn;
}


