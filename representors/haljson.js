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
  - item link collection not tested
  - item root+id forced here
  - no support for CURIES
  - no support for _embedded
*/

module.exports = haljson;

function haljson(object, root) {
  var hal;
  
  hal = {};
  hal = _links = {};
  
  root = root.replace(/^\/\//,"http://");
  
  for(var o in object) {
    hal._links = getLinks(object[o], root, o);
    if(object[o].data && object[o].data.length===1) {
      hal = getProperties(hal, object[o], root, o);
    }
  }
       
  return JSON.stringify(hal, null, 2);
}

function getLinks(object, root, s) {
  var rtn, coll, links, i, x, rels, kind, rel, url, inputs, temp;
  
  console.log(JSON.stringify(object,null,2));
  
  rtn = {};
  rels = root+"/files/"+s+".html#{rel}";

  links = {};
  links.self = {href:root};
  
  // handle list-level actions
  if(object.actions) {
    coll = object.actions;
    for(i=0,x=coll.length;i<x;i++) {
      if(coll[i].target === "list") {
        rel = coll[i].rel[0]||"related";
        url = coll[i].href.replace(/^\/\//,"http://")||"";
        temp = false;
        if(coll[i].inputs && coll[i].type==="safe") {
          temp = true;
          inputs = coll[i].inputs;
          for(j=0,y=inputs.length;j<y;j++) {
            if(j===0) {
              url += '{?';
            }
            else {
              url+=',';
            }
            url += inputs[j].name;
            if(j===y-1) {
              url += '}';
            }
          }
        }
        links[rels.replace("{rel}",rel)] = {href:url, title:coll[i].prompt, templated:temp};
      }
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
      links[rels.replace("{rel}",s.toLowerCase())] = items;
    }
    rtn = links;
  }
  return rtn;
}

function getProperties(hal, object, root, s) {
  var rtn, props, links, rels, id;
  
  rtn = hal;
  rels = root+"/files/"+s+".html#{rel}";
  
  if(object.data) {
    props = object.data[0];
    id = object.data[0].id;
    for(var p in props) {
      if(p!=='meta') {
        rtn[p] = props[p];
      }
    }
  }
  
  // not tested
  if(object.actions) {
    links = object.actions;
    for(j=0,y=links.length;j<y;j++) {
      if(links[j].target==="item") {
        rtn._links[rels.replace("{rel}",links[j].name.replace("Link","").replace("Form","").toLowerCase())] = {href:root+'/'+links[j].kind+'/'+links[j].key+'/'+id, title:links[j].prompt};
      }
    }
  }

  // fix up self link for this representation
  rtn._links.self = {href:root+'/'+id};
  
  return rtn;
}

// EOF

