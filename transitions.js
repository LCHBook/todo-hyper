/*******************************************************
 * todo-mvc implementation based on ALPS doc
 * transitions document (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. King (2008)
 *******************************************************/

// holds the list of *all* possible state transitions for this service

// run on first load;
var trans = [];
trans = fillTrans();

module.exports = main;

function main(name) {
  var rtn, i, x;
 
  rtn = {};
  for(i=0,x=trans.length;i<x;i++) {
    if(trans[i].name===name) {
      rtn = trans[i];
      break;
    }
  }

  return rtn;
}

// internal filling
function fillTrans() {
  var trans;
  trans = [];
  
  // home transitions
  trans.push({
    name : "homeLink",
    type : "safe",
    kind : "home",
    target : "list",
    prompt : "Home"
  });
  
  // todo transitions
  trans.push({
    name : "listAll",
    type : "safe",
    kind : "todo",
    target : "list",
    prompt : "All ToDo"
  });
  trans.push({
    name : "listActive",
    type : "safe",
    kind : "todo",
    target : "list",
    prompt : "Active ToDos",
    inputs : [
      {name : "completed", prompt : "Complete", value : "false"}
    ]
  });
  trans.push({
    name : "listCompleted",
    type : "safe",
    kind : "todo",
    target : "list",
    prompt : "Completed ToDos",
    inputs : [
      {name : "completed", prompt : "Complete", value : "true"}
    ]
  });
  
  trans.push({
    name : "addLink",
    type : "safe",
    kind : "todo",
    target : "list",
    prompt : "Add ToDo"
  });
  trans.push({
    name : "addForm",
    type : "unsafe",
    kind : "todo",
    prompt : "Add ToDo",
    inputs : [
      {name : "title", prompt : "Title"},
      {name : "completed", prompt : "Complete", value : "false"}
    ]
  });
  
  trans.push({
    name : "todoEditLink",
    type : "safe",
    kind : "todo",
    target : "item",
    prompt : "Edit ToDo"
  });
  trans.push({
    name : "todoAddForm",
    type : "unsafe",
    kind : "todo",
    prompt : "Edit ToDo",
    inputs : [
      {name : "id", prompt : "ID"},
      {name : "title", prompt : "Title"},
      {name : "completed", prompt : "Complete"}
    ]
  });
  
  trans.push({
    name : "removeLink",
    type : "safe",
    kind : "todo",
    target : "item",
    prompt : "Remove ToDo"
  });
  trans.push({
    name : "removeForm",
    type : "unsafe",
    kind : "todo",
    prompt : "Remove ToDo",
    inputs : [
      {name : "id", prompt : "ID"}
    ]
  });
  
  trans.push({
    name : "completedLink",
    type : "safe",
    kind : "todo",
    target : "item",
    prompt : "Mark Completed"
  });
  trans.push({
    name : "completedForm",
    type : "unsafe",
    kind : "todo",
    prompt : "Mark Completed",
    inputs : [
      {name: "id", prompt:"ID"},
      {name: "completed", prompt:"Complete Status", value:"true"}
    ]
  });
  
  trans.push({
    name : "clearCompletedLink",
    type : "safe",
    kind : "todo",
    target : "list",
    prompt : "Clear Completed"
  });
  trans.push({
    name : "clearCompletedForm",
    type : "unsafe",
    kind : "todo",
    target : "list",
    prompt : "Clear Completed",
    inputs : [
      {name: "completed", prompt:"Complete Status", value:"true"}
    ]
  });
 
  return trans;
}
