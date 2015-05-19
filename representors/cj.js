/*******************************************************
 * todo-mvc implementation based on ALPS doc
 * cj representor (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. King (2008)
 *******************************************************/

// json representor
module.exports = cj;

function cj(object, root) {

  var rtn = {};
  rtn.collection = {};

  rtn.collection.version = "1.0";
  rtn.collection.href = root;

  for(var o in object) {
    rtn.collection.title = getTitle(object[o]);
    rtn.collection.links = getLinks(object[o].actions);
    rtn.collection.items = getItems(object[o].data);
    rtn.collection.queries = getQueries(object[o].actions);
    rtn.collection.template = getTemplate(object[o].actions)
  
    if(object.error) {
      rtn.collection.error = getError(object.error);
    }
  }
  
  return JSON.stringify(rtn, null, 2);
}

function getTitle(obj) {
  return obj.title||"Cj Browser";
}

function getLinks(obj, root) {
  var link, rtn, i, x;

  rtn = [];
  if(Array.isArray(obj)!==false) {
    for(i=0,x=obj.length;i<x;i++) {
      link = obj[i];
      if(link.type==="safe" && link.target==="list") {
        if(!link.inputs) {
          rtn.push({
            rel: link.rel||"",
            href: link.href||"",
            prompt: link.prompt||""
          });
        }
      }
    }
  }
  return rtn;
}

function getItems(obj) {
  var temp, item, data, rtn, i, x, j, y;
  
  rtn = [];
  if(Array.isArray(obj)!==false) {
    for(i=0,x=obj.length;i<x;i++) {
      temp = obj[i];
      item = {};
      item.rel = temp.meta.rel;
      item.href = temp.meta.href;
      data = [];
      for(var d in temp) {
        if(d!=="meta") {
          data.push({
            name: d,
            value: temp[d],
            prompt: d
          });
        }
      }
      item.data = data;
      rtn.push(item);
    }
  }
  return rtn;
}

function getQueries(obj) {
  var data, d, query, q, rtn, i, x, j, y;
  
  rtn = [];
  if(Array.isArray(obj)!==false) {
    for(i=0,x=obj.length;i<x;i++) {
      query = obj[i];
      if(query.type==="safe" && query.inputs && Array.isArray(query.inputs)) {
        q = {};
        q.rel = query.rel;
        q.href = query.href;
        q.prompt = query.prompt||"";
        data = [];
        for(j=0,y=query.inputs.length;j<y;j++) {
          d = query.inputs[j];
          data.push({name:d.name||"input"+j,value:d.value||"",prompt:d.prompt||d.name})
        }
        q.data = data;
        rtn.push(q);
      }
    }
  }
  return rtn;
}

function getTemplate(obj) {
  var data, temp, rtn, d, i, x, j, y;
  
  rtn = {};
  data = [];
  
  if(Array.isArray(obj)!==false) {
    for(i=0,x=obj.length;i<x;i++) {
      if(obj[i].name==="addForm") {
        temp = obj[i];
        rtn.prompt = temp.prompt;
        rtn.rel = temp.rel;
        for(j=0,y=temp.inputs.length;j<y;j++) {
          d = temp.inputs[j];
          data.push({name:d.name||"input"+j,value:d.value||"",prompt:d.prompt||d.name});
        }
      }
    }
  }
  rtn.data = data;
  return rtn;
}

function getError(obj) {
  var rtn = {};

  rtn.title = "Error";
  rtn.message = (obj.title||"");
  rtn.code = (obj.code||"");
  rtn.url = (obj.url||"");
  
  return rtn;
}
// EOF

