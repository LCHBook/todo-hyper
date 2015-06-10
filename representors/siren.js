/*******************************************************
 * todo-mvc implementation 
 * siren representor (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Motown Classics Gold (2005)
 *******************************************************/

/*
  REFERENCE:
    https://github.com/kevinswiber/siren
    
  DEPENDS:
    - has fatal dependency to transitions.js
    
  HACKS:
    - Siren expects action.method. transitions are currently only marked safe/unsafe.
    - Siren supports "type"(DATA) for fields. transitions inputs don't currently carry a data type.
    - Siren supports "type"(IANA) for links and actions. transitions don't currently have this.
    
  ISSUES:
    - emits "entities" for collections & no root properties. 
      a single data record causes it to emit an "entity" and no "entities"
    - doesn't support links within subentities
*/

module.exports = siren;

// defaults
var g = {};
g.ctype = "application/x-www-form-urlencoded";
g.atype = "application/vnd.siren+json";

// emit valid siren body
function siren(object, root) {
  var siren;
  
  siren = {};
  root = root.replace(/^\/\//,"http://");
  
  for(var o in object) {
    if(object[o].data && object[o].data.length===1) {
      siren = getEntity(siren, object[o].data, o);
    }
    else {
      siren.entities = getSubEntities(object[o].data, o);
    }
    siren.actions = getActions(object[o].actions, o);
    siren.links = getLinks(object[o].actions, o);    
  }
       
  return JSON.stringify(siren, null, 2);
}


// handle single entity
function getEntity(siren, data, o) {
  var props, properties;
  
  props = data[0];
  properties = {};
  for(var p in props) {
    if(p!=='meta') {
      properties[p] = props[p];
    }
  }
  
  siren.class = [o]
  siren.properties = properties;
  
  return siren;
}

// handle collection of subentities
function getSubEntities(data, o) {
  var items, item, i, x;
  
  items= [];
  
  for(i=0,x=data.length;i<x;i++) {
    item = {};
    item.class = [o];
    item.href = data[i].meta.href.replace(/^\/\//,"http://")||"";
    item.rel = data[i].meta.rel;
    item.type = data[i].meta.contentType||g.atype;
    for(var p in data[i]) {
      if(p!=='meta') {
        item[p] = data[i][p];
      }
    }
    items.push(item);
  }
  
  return items;
}

// handle actions
function getActions(actions, o) {
  var coll, form, action, input, i, x;
  
  coll = [];
  for(i=0, x=actions.length; i<x; i++) {
    if(actions[i].type!=="safe" || actions[i].inputs) {
      action = actions[i];
      form = {};
      form.name = action.name;
      form.title = action.prompt||action.name;
      form.href = action.href.replace(/^\/\//,"http://")||"#";
      if(action.type!=="safe") {
        form.type = action.contentType||g.ctype;
        form.method = action.method||"POST"; //hack
      }
      else {
        form.method = "GET";
      }
      form.fields = [];
      for(j=0,y=action.inputs.length; j<y; j++) {
        input = action.inputs[j];
        field = {};
        if(input.name) {
          field.name = input.name;
          field.type = input.type||"text" //fallback
          field.value = input.value||"";
          field.title = input.prompt||input.name;
          field.class = [o];
          form.fields.push(field);
        }
      }
      coll.push(form);
    }
  }
  return coll;
}

// handle links
function getLinks(actions, o) {
  var coll, link, action, i, x;
  
  coll = [];
  for(i=0, x=actions.length; i<x; i++) {
    if(actions[i].type==="safe" && (actions[i].inputs===undefined || actions[i].inputs.length===0)) {
      action = actions[i];
      link = {};
      link.rel = action.rel;
      link.href = action.href.replace(/^\/\//,"http://");
      link.class = [o];
      link.title = action.prompt||"";
      link.type = action.contentType||g.atype;
      coll.push(link);
    }
  }
  return coll;
}

// EOF

