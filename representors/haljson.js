/*******************************************************
 * todo-mvc implementation based on ALPS doc
 * hal-json representor (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. King (2008)
 *******************************************************/

/*
  REFERENCE:
    https://tools.ietf.org/html/draft-kelly-json-hal-06
    
  DEPENDS:
    - has fatal dependency to transitions.js
    
  HACKS:
  - http: hacked into the root here
  - assumes "title" property for link array <-- FIX

  ISSUES:
  - no support for:
    - _links.curies
    - _links.hreflang
    - _links.type
    - _links.name
    - _links.deprecation
    - _links.profile
  - uses '/files/hal-{object}.html#{rel}' as relRoot fallback
*/

module.exports = haljson;

// emit valid hal body
function haljson(object, root, relRoot) {
  var hal;
  
  hal = {};
  hal._links = {};
  root = root.replace(/^\/\//,"http://");
  
  for(var o in object) {
    rels = relRoot||root+"/files/hal-"+o.toLowerCase()+".html#{rel}";
    hal._links = getLinks(object[o], root, o, rels);
    if(object[o].data && object[o].data.length===1) {
      hal = getProperties(hal, object[o]);
    }
    else {
      hal._embedded = getEmbedded(object[o], root, o, rels);
    }
  }
       
  return JSON.stringify(hal, null, 2);
}

// emit _links object
function getLinks(object, root, o, relRoot) {
  var coll, items, links, i, x;
  
  links = {};
  
  // list-level actions
  if(object.actions) {
    coll = object.actions;
    for(i=0,x=coll.length;i<x;i++) {
      links = getLink(links, coll[i], relRoot);
    }
    
    // list-level objects
    if(object.data) {
      coll = object.data;
      items = [];
      for(i=0,x=coll.length;i<x;i++) {
        item = {};
        item.href = coll[i].meta.href.replace(/^\/\//,"http://")||"";
        item.title = coll[i].title||"";
        items.push(item);
      }
      links[checkRel(o, relRoot)] = items;
    }
  }
  
  return links;
}

// emit embedded content
function getEmbedded(object, root, o, relRoot) {
  var coll, items, links, i, x;
  
  links = {};
  
  // list-level objects
  if(object.data) {
    coll = object.data;
    items = [];
    for(i=0,x=coll.length;i<x;i++) {
      item = {};
      item.href = coll[i].meta.href.replace(/^\/\//,"http://")||"";
      for(var p in coll[i]) {
        if(p!=='meta') {
          item[p] = coll[i][p];
        }
      }
      items.push(item);
    }
    links[checkRel(o, relRoot)] = items;
  }
  
  return links;
}

// emit root properties
function getProperties(hal, object) {
  var props;
  
  if(object.data && object.data[0]) {
    props = object.data[0];
    for(var p in props) {
      if(p!=='meta') {
        hal[p] = props[p];
      }
    }
  }
  
  return hal;
}

// the shared link builder
function getLink(links, link, relRoot) {
  var rel, url, prompt, tmpl, inputs, i, x;

  rel = link.rel[0]||"related";
  url = link.href.replace(/^\/\//,"http://")||"";
  prompt = link.prompt||rel;
  
  tmpl = false;
  if(link.inputs && link.type==="safe") {
    tmpl = true;
    inputs = link.inputs;
    for(i=0, x=inputs.length; i<x; i++) {
      url += (i===0 ? '{?' : ',');
      url += inputs[i].name;
      url += (i===x-1 ? '}' : '');
    }
  }
  links[checkRel(rel, relRoot)] = {href:url, title:prompt, templated:tmpl};
  
  return links;
}

// determine naked-rel or RFC5988
function checkRel(rel, relRoot) {
  var clearRel = "self related";
  rel = rel.toLowerCase();
  return (clearRel.indexOf(rel)!==-1?rel:relRoot.replace("{rel}",rel));
}

// EOF

