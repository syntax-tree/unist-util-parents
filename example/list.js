'use strict';

var mdast = require('mdast'),
    parents = require('..');


var ast = mdast.parse('- top-level item\n' +
                      '  - subitem 1\n' +
                      '  - subitem 2\n');

var item = parents(ast).children[0].children[0].children[1].children[1];

var chain = [];
while (item) {
  chain.unshift(item.type);
  item = item.parent;
}

console.log(chain);
