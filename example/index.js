'use strict';

var mdast = require('mdast'),
    select = require('unist-util-select'),
    parents = require('..');

var fs = require('fs');


fs.readFile(__dirname + '/doc.md', 'utf8', function (err, src) {
  if (err) throw err;

  var ast = mdast.parse(src);
  select(parents(ast), 'emphasis, strong').forEach(function (em) {
    var siblings = em.parent.node.children;
    var index = siblings.indexOf(em.node);
    [].splice.apply(siblings, [index, 1].concat(em.node.children));
  });

  process.stdout.write(mdast.stringify(ast));
});
