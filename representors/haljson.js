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
  - no support for CURIES
  - no support for _embedded
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
      hal = getProperties(hal, object[o], root, o, rels);
    }
  }
       
  return JSON.stringify(hal, null, 2);
}

function getLinks(object, root, o, relRoot) {
  var coll, items, links, i, x, rels;
  
  links = {};
  rels = relRoot;
  
  // handle list-level actions
  if(object.actions) {
    coll = object.actions;
    for(i=0,x=coll.length;i<x;i++) {
      links = getLink(links, coll[i], rels);
    }
    
    // handle list-level data
    coll = object.data;
    if(coll && coll.length>1) {
      items = [];
      for(i=0,x=coll.length;i<x;i++) {
        item = {};
        item.href = coll[i].meta.href.replace(/^\/\//,"http://")||"";
        item.title = coll[i].title||"";
        items.push(item);
      }
      links[(ianaRel(o)?o:rels.replace("{rel}",o))] = items;
    }
  }
  
  return links;
}

function getProperties(hal, object, root, o, relRoot) {
  var rtn, props, rels, id;
  
  rtn = hal;
  rels = relRoot;
  
  if(object.data) {
    props = object.data[0];
    id = object.data[0].id;
    for(var p in props) {
      if(p!=='meta') {
        rtn[p] = props[p];
      }
    }
  }
  
  return rtn;
}

function getLink(links, link, rels) {
  var rel, url, temp, inputs, i, x;

  rel = link.rel[0]||"related";
  url = link.href.replace(/^\/\//,"http://")||"";
  
  temp = false;
  if(link.inputs && link.type==="safe") {
    temp = true;
    inputs = link.inputs;
    for(i=0, x=inputs.length; i<x; i++) {
      url += (i===0 ? '{?' : ',');
      url += inputs[i].name;
      url += (i===x-1?'}':'');
    }
  }
  links[(ianaRel(rel)?rel:rels.replace("{rel}",rel))] = {href:url, title:link.prompt, templated:temp};
  
  return links;
}

function ianaRel(rel) {
  var ianaRels = "self related";
  return (ianaRels.indexOf(rel)!==-1);
}

// EOF

