{
  "alps" : {
    "version" : "1.0",
    "doc" : { "value" : "A suggested ALPS profile for the popular MVCTodo project"},
    "link" : {"rel" : "help", "href" : "https://github.com/tastejs/todomvc/blob/master/app-spec.md"},
    "descriptor" : [
      {"id" : "id", "type" : "semantic"},
      {"id" : "title", "type" : "semantic"},
      {"id" : "completed", "type" : "semantic"},
      {"id" : "listAll", "type" : "safe"},
      {"id" : "listActive", "type" : "safe"},
      {"id" : "listCompleted", "type" : "safe"},
      {"id" : "add", "type" : "unsafe"},
      {"id" : "edit", "type" : "idempotent"},
      {"id" : "remove", "type" : "idempotent"},
      {"id" : "markCompleted", "type" : "idempotent"},
      {"id" : "clearCompleted", "type" : "idempotent"}
    ]
  }
}
