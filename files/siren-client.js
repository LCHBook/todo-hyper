/*******************************************************
 * todo-mvc implementation 
 * siren representor (server)
 * June 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Motown Classics Gold (2005)
 *******************************************************/

/* NOTE:  
  - has fatal dependency on:
    - uritemplate.js
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
  g.ctype = "application/vnd.siren+json";
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
    actions();
    properties();
  }

  // handle title for page
  // HAL offers no title so we use our own
  function title() {
    var elm = d.find("title");
    elm.innerText = g.title;
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

  // _entities
  function entities() {
  }
  
  // actions  
  function actions() {
  }  
  
  // properties
  function properties() {
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
    ajax.setRequestHeader("accept",accept||g.ctype);
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
