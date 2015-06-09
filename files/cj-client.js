/*******************************************************
 * cj-client HTML/SPA client engine
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. King (2008)
 *******************************************************/

/*  
  NOTE:
  - has fatal dependency on dom-help.js
  - uses no external libs/frameworks
  - built/tested for chrome browser (YMMV on other browsers)
  - designed to act as a "validator" for a human-driven Cj client.
  - not production robust (missing error-handling, perf-tweaking, etc.)
  - report issues to https://github.com/collection-json/cj-client
*/

function cj() {

  var d = domHelp();  
  var g = {};
  
  g.url = '';
  g.cj = null;
  g.ctype = "application/vnd.collection+json";

  // init library and start
  function init(url) {
    if(!url || url==='') {
      alert('*** ERROR:\n\nMUST pass starting URL to the Cj library');
    }
    else {
      g.url = url;
      req(g.url,"get");
    }
  }

  // primary loop
  function parseCj() {
    dump();
    title();
    links();
    items();
    queries();
    template();
    error();
    cjClearEdit();
  }

  // handle response dump
  function dump() {
    var elm = d.find("dump");
    elm.innerText = JSON.stringify(g.cj, null, 2);
  }
  
  // handle title
  function title() {
    var elm;
    
    if(hasTitle(g.cj.collection)===true) {
      elm = d.find("title");
      elm.innerText = g.cj.collection.title;
      elm = d.tags("title");
      elm[0].innerText = g.cj.collection.title;
    }
  }
  
  // handle link collection
  function links() {
    var elm, coll;
    var ul, li, a, img;
    var head, lnk;
    
    elm = d.find("links");
    d.clear(elm);
    if(g.cj.collection.links) {
      coll = g.cj.collection.links;
      ul = d.node("ul");
      ul.onclick = httpGet;
      
      for(var link of coll) {

        // stuff render=none Cj link elements in HTML.HEAD
        if(isHiddenLink(link)===true) {
          head = d.tags("head")[0];
          lnk = d.link({rel:link.rel,href:link.href,title:link.prompt});
          d.push(lnk,head);
          continue;
        }
        
        // render embedded images, if asked
        li = d.node("li");
        if(isImage(link)===true) {
          img = d.image({href:link.href,className:link.rel});
          d.push(img, li);
        }
        else {
          a = d.anchor({rel:link.rel,href:link.href,text:link.prompt});
          d.push(a, li);
        }
        d.push(li, ul);
      }
      d.push(ul, elm);
    }
  }

  // handle item collection
  function items() {
    var elm, coll;
    var ul, li;
    var dl, dt, dd;
    var p, s1, s2, img;
    var a1, a2, a3;

    elm = d.find("items");
    d.clear(elm);
    if(g.cj.collection.items) {
      coll = g.cj.collection.items;
      ul = d.node("ul");

      for(var item of coll) {
        li = d.node("li");
        dl = d.node("dl");
        dt = d.node("dt");
        
        // item link
        a1 = d.anchor({href:item.href,rel:item.rel,className:"item link",text:item.rel});
        a1.onclick = httpGet;
        d.push(a1,dt);
        
        // edit link
        if(isReadOnly(item)===false && hasTemplate(g.cj.collection)===true) {
          a2 = d.anchor({href:item.href,rel:"edit",className:"item action",text:"Edit"});
          a2.onclick = cjEdit;
          d.push(a2, dt);
        }

        // delete link
        if(isReadOnly(item)===false) {
          a3 = d.anchor({href:item.href,className:"item action",rel:"delete",text:"Delete"});
          a3.onclick = httpDelete;
          d.push(a3,dt);
        }
        d.push(dt,dl);
        
        dd = d.node("dd");
        for(var data of item.data) {
          p = d.data({className:"item "+data.name,text:data.prompt+"&nbsp;",value:data.value+"&nbsp;"});
          d.push(p,dd);
        }
        if(item.links) {
          for(var link of item.links) {
            p = d.node("p");
            p.className = "item";
            
            // render as images, if asked
            if(isImage(link)===true) {
              img = d.image({className:"image "+link.rel,rel:link.rel,href:link.href});         
              d.push(img, p);
            }
            else {
              a = d.anchor({className:"item",href:link.href,rel:link.rel,text:link.prompt});
              a.onclick = httpGet;
              d.push(a, p);
            }
            d.push(p,dd);
          }
        }
        d.push(dd,dl);
        d.push(dl,li);
        d.push(li,ul);
      }
      d.push(ul,elm);
    }
  }
  
  // handle query collection
  function queries() {
    var elm, coll;
    var ul, li;
    var form, fs, lg, p, lbl, inp;

    elm = d.find("queries");
    d.clear(elm);
    if(g.cj.collection.queries) {
      ul = d.node("ul");
      coll = g.cj.collection.queries;
      for(var query of coll) {
        li = d.node("li");
        form = d.node("form");
        form.action = query.href;
        form.className = query.rel;
        form.method = "get";
        form.onsubmit = httpQuery;
        fs = d.node("fieldset");
        lg = d.node("legend");
        lg.innerHTML = query.prompt + "&nbsp;";
        d.push(lg,fs);
        for(var data of query.data) {
          p = d.input({prompt:data.prompt,name:data.name,value:data.value});
          d.push(p,fs);
        }
        p = d.node("p");
        inp = d.node("input");
        inp.type = "submit";
        d.push(inp,p);
        d.push(p,fs);
        d.push(fs,form);
        d.push(form,li);
        d.push(li,ul);
      }
      d.push(ul,elm);
    }
  }
  
  // handle template object
  function template() {
    var elm, coll;
    var form, fs, lg, p, lbl, inp;

    elm = d.find("template");
    d.clear(elm);
    if(hasTemplate(g.cj.collection)===true) {
      coll = g.cj.collection.template.data;
      form = d.node("form");
      form.action = g.cj.collection.href;
      form.method = "post";
      form.className = "add";
      form.onsubmit = httpPost;
      fs = d.node("fieldset");
      lg = d.node("legend");
      lg.innerHTML = "Add";
      d.push(lg,fs);
      for(var data of coll) { 
        p = d.input({prompt:data.prompt+"&nbsp;",name:data.name,value:data.value});
        d.push(p,fs);
      }
      p = d.node("p");
      inp = d.node("input");
      inp.type = "submit";
      d.push(inp,p);
      d.push(p,fs);
      d.push(fs,form);
      d.push(form, elm);
    }
  }
  
  // handle error object
  function error() {
    var elm, obj;

    elm = d.find("error");
    d.clear(elm);
    if(g.cj.collection.error) {
      obj = g.cj.collection.error;

      p = d.para({className:"code",text:obj.code});
      d.push(p,elm);

      p = d.para({className:"title",text:obj.title});
      d.push(p,elm);

      p = d.para({className:"url",text:obj.url});
      d.push(p,elm);
    }
  }

  // ***************************
  // cj helpers
  // ***************************
  
  // render editable form for an item
  function cjEdit(e) {
    var elm, coll;
    var form, fs, lg, p, lbl, inp;
    var data, item, dv, tx;
    
    elm = d.find("edit");
    d.clear(elm);
    
    // get data from selected item
    item = cjItem(e.target.href);
    if(item!==null) {
      form = d.node("form");
      form.action = item.href;
      form.method = "put";
      form.className = "edit";
      form.onsubmit = httpPut;
      fs = d.node("fieldset");
      lg = d.node("legend");
      lg.innerHTML = "Edit";
      d.push(lg,fs);
      
      // get template for editing
      coll = g.cj.collection.template.data;
      for(var data of coll) {
        dv = cjData(item, data.name);
        tx=(dv!==null?dv.value+"":"");
        p = d.input({prompt:data.prompt,name:data.name,value:tx});
        d.push(p,fs);
      }
      p = d.node("p");
      inp = d.node("input");
      inp.type = "submit";
      d.push(inp,p);
      d.push(p,fs);
      d.push(fs,form);
      d.push(form, elm);
      elm.style.display = "block";
    }
    return false;
  }
  function cjClearEdit() {
    var elm;
    elm = d.find("edit");
    d.clear(elm);
    elm.style.display = "none";
    return;
  }
  function hasTitle(collection) {
    return (collection.title && collection.title.length!==-1);
  }
  function hasTemplate(collection) {
    return (collection.template && Array.isArray(collection.template.data)===true);
  }
  function isHiddenLink(link) {
    var rtn = false;
    if(link.render && (link.render==="none" || link.render==="hidden" || link.rel==="stylesheet")) {
      rtn = true;
    }
    return rtn;
  }
  function isReadOnly(item) {
    var rtn = false;
    if(item.readOnly && (item.readOnly==="true" || item.readOnly===true)) {
      rtn = true;
    }
    return rtn;
  }
  function isImage(link) {
    var rtn = false;
    if(link.render && (link.render==="image" || link.render==="embed")) {
      rtn = true;
    }
    return rtn;
  }
  function cjItem(url) {
    var coll, rtn;
    
    rtn = null;
    coll = g.cj.collection.items;
    for(var item of coll) {
      if(item.href.replace('http:','').replace('https:','')===url.replace('http:','').replace('https:','')) {
        rtn = item;
        break;
      }
    }
    return rtn;
  }
  function cjData(item,name) {
    var coll, rtn;
    
    rtn = null;
    coll = item.data;
    for(var data of coll) {
      if(data.name === name) {
        rtn = data;
        break;
      }
    }
    return rtn;
  }
  
  // ********************************
  // ajax helpers
  // ********************************
  
  // mid-level HTTP handlers
  function httpGet(e) {
    req(e.target.href, "get", null);
    return false;
  }
  function httpQuery(e) {
    var form, coll, query, i, x, q;

    q=0;
    form = e.target;
    query = form.action+"/?";
    nodes = d.tags("input", form);
    for(i=0, x=nodes.length;i<x;i++) {
      if(nodes[i].name && nodes[i].name!=='') {
        if(q++!==0) {
          query += "&";
        }
        query += nodes[i].name+"="+escape(nodes[i].value);
      }
    }
    req(query,"get",null);
    return false;
  }
  function httpPost(e) {
    var form, nodes, data;

    data = [];
    form = e.target;
    nodes = d.tags("input",form);
    for(i=0,x=nodes.length;i<x;i++) {
      if(nodes[i].name && nodes[i].name!=='') {
        data.push({name:nodes[i].name,value:nodes[i].value+""});
      }
    }
    req(form.action,'post',JSON.stringify({template:{data:data}}));
    return false;
  }
  function httpPut(e) {
    var form, nodes, data;

    data = [];
    form = e.target;
    nodes = d.tags("input",form);
    for(i=0,x=nodes.length;i<x;i++) {
      if(nodes[i].name && nodes[i].name!=='') {
        data.push({name:nodes[i].name,value:nodes[i].value+""});
      }
    }
    req(form.action,'put',JSON.stringify({template:{data:data}}));
    return false;
  }
  function httpDelete(e) {
    if(confirm("Ready to delete?")===true) {
      req(e.target.href, "delete", null);
    }
    return false;
  }
  // low-level HTTP stuff
  function req(url, method, body) {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){rsp(ajax)};
    ajax.open(method, url);
    ajax.setRequestHeader("accept",g.ctype);
    if(body && body!==null) {
      ajax.setRequestHeader("content-type", g.ctype);
    }
    ajax.send(body);
  }
  function rsp(ajax) {
    if(ajax.readyState===4) {
      g.cj = JSON.parse(ajax.responseText);
      parseCj();
    }
  }

  // export function
  var that = {};
  that.init = init;
  return that;
}

// *** EOD ***
