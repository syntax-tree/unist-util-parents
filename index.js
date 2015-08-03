'use strict';

var visit = require('unist-util-visit');


module.exports = function (ast) {
  visit(ast, function (node, _, parent) {
    Object.defineProperty(node, 'parent', {
      writable: true,
      configurable: true,
      value: parent
    });
  });
  return ast;
};
