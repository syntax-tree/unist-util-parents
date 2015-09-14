'use strict';


module.exports = function (ast) {
  return wrapNode(ast, null);
};


function wrapNode (node, parent) {
  var proxy = Object.keys(node).reduce(function (acc, key) {
    if (key != 'children') {
      acc[key] = node[key];
    }
    return acc;
  }, {});

  Object.defineProperty(proxy, 'node', {
    writable: true,
    configurable: true,
    value: node
  });

  Object.defineProperty(proxy, 'parent', {
    writable: true,
    configurable: true,
    value: parent
  });

  if (node.children) {
    Object.defineProperty(proxy, 'children', {
      enumerable: true,
      configurable: true,
      get: function () {
        return node.children.map(function (child) {
          return wrapNode(child, proxy);
        });
      }
    });
  }

  Object.defineProperty(proxy, 'index', {
    writable: true,
    configurable: true,
    value: function () {
      if (parent) {
        var children = parent.children;
        for (var index = 0; index < children.length; ++index) {
          if (children[index].node == node) {
            return index;
          }
        }
      }
      return null;
    }
  });

  return proxy;
}
