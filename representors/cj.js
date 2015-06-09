/*******************************************************
 * todo-mvc implementation based on ALPS doc
 * cj representor (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. King (2008)
 *******************************************************/

var urit = require('uritemplate');

// json representor
module.exports = cj;

function cj(object, root) {

  var rtn = {};
  rtn.collection = {};

  rtn.collection.version = "1.0";
  rtn.collection.href = root.replace(/^\/\//,"http://")||"";

  for(var o in object) {
    rtn.collection.title = getTitle(object[o]);
    rtn.collection.links = getLinks(object[o].actions);
    rtn.collection.items = getItems(object[o],root);
    rtn.collection.queries = getQueries(object[o].actions);
    rtn.collection.template = getTemplate(object[o].actions);
  
    if(object.error) {
      rtn.collection.error = getError(object.error);
    }
  }
  
  return JSON.stringify(rtn, null, 2);
}

function getTitle(obj) {
  return obj.title||"Cj Browser";
}

function getLinks(obj, root, target, tvars) {
  var link, rtn, tgt, i, x, tmpl, url;

  rtn = [];
  tgt = target||"list";
  if(Array.isArray(obj)!==false) {
    for(i=0,x=obj.length;i<x;i++) {
      link = obj[i];
      if(link.type==="safe" && link.target===tgt) {
        if(!link.inputs) {
          tpl = urit.parse(link.href);
          url = tpl.expand(tvars);
          rtn.push({
            href: url.replace(/^\/\//,"http://"),
            rel: link.rel.join(" ")||"",
            prompt: link.prompt||""
          });
        }
      }
    }
  }
  return rtn;
}

function getItems(obj, root) {
  var coll, temp, item, data, links, rtn, i, x, j, y;
  
  tvars = {};
  rtn = [];
  coll = obj.data;
  if(coll && Array.isArray(coll)!==false) {
    for(i=0,x=coll.length;i<x;i++) {
      temp = coll[i];
      item = {};
      item.rel = temp.meta.rel.join(" ");
      item.href = temp.meta.href.replace(/^\/\//,"http://")||"";
      
      tvars = {}
      data = [];
      for(var d in temp) {
        if(d!=="meta") {
          data.push({name : d, value : temp[d], prompt : d});
          tvars[d] = temp[d];
        }
      }
      item.data = data;
      
      // add any item-level links
      links = getLinks(obj.actions, root, "item", tvars);
      if(Array.isArray(links) && links.length!==0) {
        item.links = links;
      }
      
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
        q.rel = query.rel.join(" ");
        q.href = query.href.replace(/^\/\//,"http://")||"";
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
        rtn.rel = temp.rel.join(" ");
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

