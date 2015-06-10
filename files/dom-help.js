// ***************************************
// DOM helpers
// handy helper routines for HTML DOM work
// @mamund
// ***************************************
function domHelp() {

  // high-level helpers for HTML-DOM
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
    a.type = args.type||"";
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

