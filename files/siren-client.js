/*******************************************************
 * todo-mvc implementation 
 * siren representor (server)
 * June 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Motown Classics Gold (2005)
 *******************************************************/

/* NOTE:  
  - has fatal dependency on:
    - dom-help.js
  - uses no other external libs/frameworks
  
  - built/tested for chrome browser (YMMV on other browsers)
  - designed to act as a "validator" for a human-driven HAL client.
  - not production robust (missing error-handling, perf-tweaking, etc.)
  - report issues to https://github.com/lchbook/
*/

function siren() {

  var d = domHelp();  
  var g = {};
  
  g.url = '';
  g.msg = null;
  g.ctype = "application/x-www-form-urlencoded";
  g.atype = "application/vnd.siren+json";
  g.title = "";
  
  // init library and start
  function init(url, title) {

    g.title = title||"Siren Client";
    
    if(!url || url==='') {
      alert('*** ERROR:\n\nMUST pass starting URL to the library');
    }
    else {
      g.url = url;
      req(g.url,"get");
    }
  }

  // primary loop
  function parseMsg() {
    sirenClear();
    title();
    dump();
    links();
    entities();
    properties();
    actions();
  }

  // handle title for page
  // Siren offers no title so we use our own
  function title() {
    var elm
    
    elm = d.find("title");
    elm.innerText = g.title;
    
    elm = d.tags("title");
    elm[0].innerText = g.title;
  }
  
  // handle response dump
  // just for debugging help
  function dump() {
    var elm = d.find("dump");
    elm.innerText = JSON.stringify(g.msg, null, 2);
  }
    
  // links
  function links() {
    var elm, coll;
    
    elm = d.find("links");
    d.clear(elm);

    if(g.msg.links) {
      ul = d.node("ul");
      ul.onclick = httpGet;      
      coll = g.msg.links;
      for(var link of coll) {
        li = d.node("li");
        a = d.anchor({
          rel:link.rel.join(" "),
          href:link.href,
          text:link.title||link.href, 
          className:link.class.join(" "),
          type:link.type||""
        });
        d.push(a, li);
        d.push(li,ul);
      }
      d.push(ul, elm);
    }
  }

  // entities
  function entities() {
    var elm, coll;
    var ul, li, dl, dt, dd, a, p;
    
    elm = d.find("entities");
    d.clear(elm);
    
    if(g.msg.entities) {
      ul = d.node("ul");
      
      coll = g.msg.entities;
      for(var item of coll) {
        li = d.node("li");
        dl = d.node("dl");
        dt = d.node("dt");
        
        a = d.anchor({
          href:item.href,
          rel:item.rel.join(" "),
          className:item.class.join(" "),
          text:item.title||item.href});
        a.onclick = httpGet;
        d.push(a, dt);
        d.push(dt, dl);

        dd = d.node("dd");
        for(var prop in item) {
          if(prop!=="href" && prop!=="class" && prop!=="type" && prop!=="rel") {
            p = d.data({
              className:"item "+item.class.join(" "),
              text:prop+"&nbsp;",
              value:item[prop]+"&nbsp;"
            });
            d.push(p,dd);
          }
        }
        d.push(dd, dl);
        d.push(dl, li);
        d.push(li, ul);
      }
      d.push(ul, elm);
    }
  }
  
  // actions  
  function actions() {
  }  
  
  // properties
  function properties() {
    var elm, coll;
    var dl, dt, dd, a, p;
    
    elm = d.find("properties");
    d.clear(elm);
    
    if(g.msg.properties) {
      ul = d.node("ul");
      dl = d.node("dl");
      dd = d.node("dd");
      coll = g.msg.properties;
      for(var prop in coll) {        
        p = d.data({
          className:"item "+g.msg.class.join(" ")||"",
          text:prop+"&nbsp;",
          value:coll[prop]+"&nbsp;"
        });
        d.push(p,dd);
      }
      d.push(dd, dl);
      d.push(dl, elm);
    }
  }  

  // ***************************
  // siren helpers
  // ***************************

  // clear out the page
  function sirenClear() {
    var elm;

    elm = d.find("dump");
    d.clear(elm);
    elm = d.find("links");
    d.clear(elm);
    elm = d.find("actions");
    d.clear(elm);
    elm = d.find("entities");
    d.clear(elm);
    elm = d.find("properties");
    d.clear(elm);
  }
  
  // ********************************
  // ajax helpers
  // ********************************  

  // mid-level HTTP handlers
  function httpGet(e) {
    req(e.target.href, "get", null);
    return false;
  }
  
  // low-level HTTP stuff
  function req(url, method, body, content, accept) {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){rsp(ajax)};
    ajax.open(method, url);
    ajax.setRequestHeader("accept",accept||g.atype);
    if(body && body!==null) {
      ajax.setRequestHeader("content-type", content||g.ctype);
    }
    ajax.send(body);
  }
  
  function rsp(ajax) {
    if(ajax.readyState===4) {
      g.msg = JSON.parse(ajax.responseText);
      parseMsg();
    }
  }

  // export function
  var that = {};
  that.init = init;
  return that;
}

// *** EOD ***
