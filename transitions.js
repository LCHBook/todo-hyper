/*******************************************************
 * todo-mvc implementation based on ALPS doc
 * transitions document (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. Kind (2008)
 *******************************************************/

module.exports = main;

var trans = [];

function main(name) {
  var rtn;
  
  if(trans[name]) {
    rtn = trans[name];
  }
  else {
    rtn = {};
  }
  
  return rtn;
}

// home transitions
trans.homeLink = {
  name : "homeLink",
  type : "safe",
  kind : "home",
  target : "list",
  prompt : "Home"
};

// todo transitions
trans.listAll = {
  name : "listAll",
  type : "safe",
  kind : "todo",
  target : "list",
  prompt : "All ToDo"
};
trans.listActive = {
  name : "listActive",
  type : "safe",
  kind : "todo",
  target : "list",
  prompt : "Active ToDos",
  inputs : [
    {name : "completed", prompt : "Complete", value : "false"}
  ]
};
trans.listCompleted = {
  name : "listCompleted",
  type : "safe",
  kind : "todo",
  target : "list",
  prompt : "Completed ToDos",
  inputs : [
    {name : "completed", prompt : "Complete", value : "true"}
  ]
};

trans.addLink = {
  name : "addLink",
  type : "safe",
  kind : "todo",
  target : "list",
  prompt : "Add ToDo"
};
trans.addForm = {
  name : "addForm",
  type : "unsafe",
  kind : "todo",
  prompt : "Add ToDo",
  inputs : [
    {name : "title", prompt : "Title"},
    {name : "completed", prompt : "Complete", value : "false"}
  ]
};

trans.editLink = {
  name : "todoEditLink",
  type : "safe",
  kind : "todo",
  target : "item",
  prompt : "Edit ToDo"
};
trans.editForm = {
  name : "todoAddForm",
  type : "unsafe",
  kind : "todo",
  prompt : "Edit ToDo",
  inputs : [
    {name : "id", prompt : "ID"},
    {name : "title", prompt : "Title"},
    {name : "completed", prompt : "Complete"}
  ]
};

trans.removeLink = {
  name : "removeLink",
  type : "safe",
  kind : "todo",
  target : "item",
  prompt : "Remove ToDo"
};
trans.removeForm = {
  name : "removeForm",
  type : "unsafe",
  kind : "todo",
  prompt : "Remove ToDo",
  inputs : [
    {name : "id", prompt : "ID"}
  ]
};

trans.completedLink = {
  name : "completedLink",
  type : "safe",
  kind : "todo",
  target : "item",
  prompt : "Mark Completed"
};
trans.completedForm = {
  name : "completedForm",
  type : "unsafe",
  kind : "todo",
  prompt : "Mark Completed",
  inputs : [
    {name: "id", prompt:"ID"},
    {name: "completed", prompt:"Complete Status", value:"true"}
  ]
};

trans.clearCompletedLink = {
  name : "clearCompletedLink",
  type : "safe",
  kind : "todo",
  target : "list",
  prompt : "Clear Completed"
};
trans.clearCompletedForm = {
  name : "clearCompletedForm",
  type : "unsafe",
  kind : "todo",
  target : "list",
  prompt : "Clear Completed",
  inputs : [
    {name: "completed", prompt:"Complete Status", value:"true"}
  ]
};
