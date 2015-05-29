/*******************************************************
 * todo-mvc implementation based on ALPS doc
 * hal-json representor (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. King (2008)
 *******************************************************/

/*
  HACKS & ISSUES:
  - http: hacked into the root here
  - 'files' hacked into rels for HAL docs
  - item root+id forced here
  - no support for CURIES
  - no support for _embedded
*/

module.exports = haljson;

function haljson(object, root) {
  var hal;
  
  hal = {};
  hal._links = {};
  
  root = root.replace(/^\/\//,"http://");
  
  for(var o in object) {
    hal._links = getLinks(object[o], root, o);
    if(object[o].data && object[o].data.length===1) {
      hal = getProperties(hal, object[o], root, o);
    }
  }
       
  return JSON.stringify(hal, null, 2);
}

function getLinks(object, root, o) {
  var coll, items, links, i, x, rels;
  
  rels = root+"/files/"+o+".html#{rel}";

  links = {};
  //links.self = {href:root};
  
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
      links[rels.replace("{rel}",o.toLowerCase())] = items;
    }
  }
  return links;
}

function getProperties(hal, object, root, o) {
  var rtn, props, rels, id;
  
  rtn = hal;
  rels = root+"/files/"+o+".html#{rel}";
  
  if(object.data) {
    props = object.data[0];
    id = object.data[0].id;
    for(var p in props) {
      if(p!=='meta') {
        rtn[p] = props[p];
      }
    }
  }
  
  // fix up self link for this representation
  //rtn._links.self = {href:root+'/'+id};
  
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
  
  links[(rel==="self"?rel:rels.replace("{rel}",rel))] = {href:url, title:link.prompt, templated:temp};
  return links;
}

// EOF

