/*
  sample HAL-JSON client 
  stand-alone client code
  hal-client.js 
  @mamund
  
*/

function hal() {

  var forms = halForms();
  var d = domHelp();  
  var g = {};
  
  g.url = '';
  g.hal = null;
  g.ctype = "application/vnd.hal+json";
  g.title = "";
  
  // init library and start
  function init(url, title) {

    g.title = title||"HAL Client";
    
    if(!url || url==='') {
      alert('*** ERROR:\n\nMUST pass starting URL to the HAL library');
    }
    else {
      g.url = url;
      req(g.url,"get");
    }
  }

  // primary loop
  function parseHAL() {
    halClear();
    title();
    dump();
    links();
    properties();
  }

  // handle title for page
  function title() {
    var elm = d.find("title");
    elm.innerText = g.title;
  }
  
  // handle response dump
  function dump() {
    var elm = d.find("dump");
    elm.innerText = JSON.stringify(g.hal, null, 2);
  }
    
  // handle link object
  function links() {
    var elm, coll;
    var ul, li, a, sel, opt;
    
    elm = d.find("links");
    d.clear(elm);
    if(g.hal._links) {
      coll = g.hal._links;
      ul = d.node("ul");
      
      for(var link in coll) {
        if(Array.isArray(coll[link])===true) {
          sel = d.node("select");          
          sel.onclick = halSelect;
          opt = d.option({text:"Select",value:""});
          d.push(opt,sel);
          
          for(var ary in coll[link]) {
            opt = d.option({
              text:(coll[link][ary].title||coll[link][ary].href),
              value:coll[link][ary].href
            });
            opt.setAttribute("href",coll[link][ary].href);
            opt.setAttribute("rel",link);
            d.push(opt, sel);
          }

          li = d.node("li");
          d.push(sel, li);
          d.push(li, ul);
        }
        else {
          a = d.anchor({
            rel:link,
            href:coll[link].href,
            title:(coll[link].title||coll[link].href),
            text:(coll[link].title||coll[link].href)
          });

          li = d.node("li");
          li.onclick = halLink;
          d.push(a, li);
          d.push(li, ul);
        }
      }
      d.push(ul, elm);
    }
  }

  // properties
  function properties() {
    var elm, coll;
    var dl, dt, dd;
    
    elm = d.find("properties");
    d.clear(elm);
    dl = d.node("dl");
    for(var prop in g.hal) {
      if(prop!=="_links" && prop!=="_embedded") {
        dt = d.node("dt");
        dt.innerText = prop;
        dd = d.node("dd");
        dd.innerText = g.hal[prop]; 
        d.push(dt,dl);
        d.push(dd,dl);
      }
    }
    d.push(dl,elm);
  }  

  // show form for input
  function showForm(f, href, title) {
    var elm, coll, val;
    var form, lg, fs, p, inp;
     
    elm = d.find("form");
    d.clear(elm);

    form = d.node("form");
    form.action = href;
    form.method = f.method;
    form.className = f.rel;
    form.onsubmit = halSubmit;
    fs = d.node("fieldset");
    lg = d.node("legend");
    lg.innerHTML = title||"Form";
    d.push(lg, fs);

    coll = f.properties;
    for(var prop of coll) {
      val = prop.value;
      if(g.hal[prop.name]) {
        val = val.replace("{"+prop.name+"}",g.hal[prop.name]);
      } 
      p = d.input({
        prompt:prop.prompt,
        name:prop.name,
        value:val, 
        required:prop.required,
        readOnly:prop.readOnly
      });
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
  
  // ***************************
  // hal helpers
  // ***************************

  // clear out the page
  function halClear() {
    var elm;

    elm = d.find("dump");
    d.clear(elm);
    elm = d.find("links");
    d.clear(elm);
    elm = d.find("form");
    d.clear(elm);
    elm = d.find("properties");
    d.clear(elm);
  }

  // handle GET for select
  function halSelect(e) {
    var elm, href;

    elm = e.target;
    href = elm.options[elm.selectedIndex].value;
    if(href && href!=="") {
      req(href, "get", null);
    }
    return false;
  }

  // handle GET for lnks
  function halLink(e) {
    var elm, form, href;

    elm = e.target;
    form = forms.lookUp(elm.rel);
    if(form && form!==null) {
      showForm(form, elm.href, elm.title);
    }
    else {
      req(elm.href, "get", null);
    }
    return false;    
  }

  // handle parameterized requests 
  function halSubmit(e) {
    return false;
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
      g.hal = JSON.parse(ajax.responseText);
      parseHAL();
    }
  }

  // export function
  var that = {};
  that.init = init;
  return that;
}

// **************************
// FORMS for HAL-JSON
// find request form via rel
// **************************
function halForms() {

  // return form
  function lookUp(rel) {
    var rtn, i, x;

    for(i=0, x=forms.length;i<x;i++) {
      if(rel.indexOf(forms[i].rel)!==-1) {
        rtn = forms[i];
        break;
      }
    }
    return rtn;
  }  

  // run this once
  var forms = [];

  forms.push({
    rel:"/files/hal-todo.html#create-form",
    method:"post",
    properties: [
      {name:"title",required:true, value:"", prompt:"Title", regex:""},
      {name:"completed",required:false,value:"false", prompt:"Completed", regex:""}
    ]
  });

  forms.push({
    rel:"/files/hal-todo.html#edit",
    method:"post",
    properties: [
      {name:"id",required:true, value:"{id}", prompt:"ID", readOnly:true},
      {name:"title",required:true, value:"{title}", prompt:"Title", regex:""},
      {name:"completed",required:false,value:"{completed}", prompt:"Completed", regex:""}
    ]
  });

  forms.push({
    rel:"/files/hal-todo.html#remove",
    method:"delete",
    properties: [
      {name:"id",required:true, value:"{id}", prompt:"ID", readOnly:true}
    ]
  });

  forms.push({
    rel:"/files/hal-todo.html#active",
    method:"get",
    properties: [
      {name:"completed",value:"false", prompt:"Completed", readOnly:true}
    ]
  });

  forms.push({
    rel:"/files/hal-todo.html#completed",
    method:"get",
    properties: [
      {name:"completed",value:"true", prompt:"Completed",readOnly:true}
    ]
  });
    
  var that = {};
  that.lookUp = lookUp;

  return that;
}

// **************************
// DOM helpers
// **************************
function domHelp() {

  // high-level helpers for Cj-DOM
  function para(args) {
    var p;
    
    p = node("p");
    p.className = args.className||"";
    p.innerHTML = args.text||"";

    return p;  
  }

  function option(args) {
    var opt;

    opt = node("option");
    opt.text = args.text||"item";
    opt.value = args.value||"";
    opt.className = args.className||"";

    return opt;
  }
  
  function input(args) {
    var p, lbl, inp;

    p = node("p");
    lbl = node("label");
    inp = node("input");
    lbl.className = "data";
    lbl.innerHTML = args.prompt||"";
    inp.name = args.name||"";
    inp.className = "value";
    inp.value = args.value.toString()||"";
    inp.required = (args.required||false);
    inp.readOnly = (args.readOnly||false);
    push(lbl,p);
    push(inp,p);
    
    return p;
  }
  
  function data(args) {
    var p, s1, s2;

    p = node("p");
    p.className = args.className||"";
    s1 = node('span');
    s1.className = "prompt";
    s1.innerHTML = args.text||"";;
    s2 = node("span");
    s2.className = "value";
    s2.innerHTML = args.value||"";
    push(s1,p);
    push(s2,p);

    return p;
  }
  
  function anchor(args) {
    var a;

    a = node("a");
    a.rel = args.rel||"";
    a.href = args.href||"";
    a.className = args.className||"";
    a.title = args.text||"link";
    push(text(args.text||"link"), a);

    return a;
  }
  
  function image(args) {
    var img;

    img = node("img")
    img.src = args.href||"";
    img.className = args.rel||"";
    img.title = args.title||"";

    return img;
  }
  
  function link(args) {
    var lnk;  

    lnk = node("link");
    lnk.rel = args.rel||"";
    lnk.href = args.href||"";
    lnk.title = args.title||"";
    lnk.className = args.className||"";

    return lnk;
  }
  
  // low-level helpers for DOM
  function push(source,target) {
    target.appendChild(source);
  }

  function tags(tag,elm) {
    var rtn;
    
    if(elm) {
      rtn = elm.getElementsByTagName(tag);
    }
    else {
      rtn = document.getElementsByTagName(tag);
    }
    return rtn;
  }

  function find(id) {
    return document.getElementById(id);
  }

  function text(txt) {
    return document.createTextNode(txt);
  }

  function node(type) {
    return document.createElement(type);
  }

  function clear(elm) {
    while (elm.firstChild) {
      elm.removeChild(elm.firstChild);
    }
  }

  // publish functions
  that = {};
  that.push = push;
  that.tags = tags;
  that.find = find;
  that.text = text;
  that.node = node;
  that.clear = clear;
  that.link = link;
  that.image = image;
  that.anchor = anchor;
  that.data = data;    
  that.input = input;
  that.para = para;
  that.option = option;
    
  return that;
}

// *** EOD ***
