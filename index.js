'use strict';

var WeakMap = require('es6-weak-map');


module.exports = function (ast) {
  return wrapNode(ast, null);
};


var cache = new WeakMap;

function wrapNode (node, parent) {
  if (cache.has(node)) {
    return cache.get(node);
  }

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
    configurable: true,
    get: function () {
      return parent;
    },
    set: function (newParent) {
      parent = newParent;
    }
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

  cache.set(node, proxy);
  return proxy;
}
