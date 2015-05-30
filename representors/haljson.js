/*******************************************************
 * todo-mvc implementation based on ALPS doc
 * hal-json representor (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. King (2008)
 *******************************************************/

/*
  HACKS:
  - http: hacked into the root here

  ISSUES:
  - no support for:
    - CURIES
    - _embedded
    - _links.hreflang
    - _links.type
    - _links.name
    - _links.deprecation
    - _links.profile
  - '/files/{object}.html#{rel}' fallback for HAL rels
*/

module.exports = haljson;

function haljson(object, root, relRoot) {
  var hal;
  
  hal = {};
  hal._links = {};
  root = root.replace(/^\/\//,"http://");
  
  for(var o in object) {
    o = o.toLowerCase();
    rels = relRoot||root+"/files/"+o+".html#{rel}";
    hal._links = getLinks(object[o], root, o, rels);
    if(object[o].data && object[o].data.length===1) {
      hal = getProperties(hal, object[o]);
    }
  }
       
  return JSON.stringify(hal, null, 2);
}

function getLinks(object, root, o, relRoot) {
  var coll, items, links, i, x;
  
  links = {};
  
  // handle list-level actions
  if(object.actions) {
    coll = object.actions;
    for(i=0,x=coll.length;i<x;i++) {
      links = getLink(links, coll[i], relRoot);
    }
    
    // handle list-level data
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

function getLink(links, link, relRoot) {
  var rel, url, name, tmpl, inputs, i, x;

  rel = link.rel[0]||"related";
  url = link.href.replace(/^\/\//,"http://")||"";
  prompt = link.prompt||rel;
  
  tmpl = false;
  if(link.inputs && link.type==="safe") {
    temp = true;
    inputs = link.inputs;
    for(i=0, x=inputs.length; i<x; i++) {
      url += (i===0 ? '{?' : ',');
      url += inputs[i].name;
      url += (i===x-1?'}':'');
    }
  }
  links[checkRel(rel, relRoot)] = {href:url, title:prompt, templated:tmpl};
  
  return links;
}

function checkRel(rel, relRoot) {
  var clearRel = "self related";
  return (clearRel.indexOf(rel)!==-1?rel:relRoot.replace("{rel}",rel));
}

// EOF

