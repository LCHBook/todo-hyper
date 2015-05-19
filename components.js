/*******************************************************
 * todo-mvc implementation based on ALPS doc
 * business component (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. King (2008)
 *******************************************************/

// matches storage calls w/ middleware domain-specific verbs

// access stored data
var storage = require('./storage.js');

exports.todo = function(action, args1, args2, args3) {
  var object, rtn;

  object = 'todo';
  rtn = null;

  switch (action) {
    case 'list':
      rtn = loadList(storage(object, 'list'), object);
      break;
    case 'read':
      rtn = loadList(storage(object, 'item', args1), object);
      break;
    case 'filter':
      rtn = loadList(storage(object, 'filter', args1), object);
      break;
    case 'add':
      rtn = loadList(storage(object, 'add', args1), object);
      break;
    case 'update':
      rtn = loadList(storage(object, 'update', args1, args2, args3), object);
      break;
    case 'remove':
      rtn = loadList(storage(object, 'remove', args1), object);
      break;
    default:
      rtn = null;
  }
  return rtn;
}

function loadList(elm, name) {
  var coll, list, i, x;

  if (Array.isArray(elm) === false) {
    coll = [];
    coll.push(elm);
  } else {
    coll = elm;
  }

  list = [];
  for (i = 0, x = coll.length; i < x; i++) {
    list.push(coll[i]);
  }

  return list;
}

// TK: is this in use?
function getId(data) {
  var i, x, rtn;

  for (i = 0, x = data.length; i < x; i++) {
    if (data[i].name === 'id') {
      rtn = data[i].value;
      break;
    }
  }
  return rtn;
}

// EOF

