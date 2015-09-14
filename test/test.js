'use strict';

var parents = require('..'),
    ast = require('./ast');

var test = require('tape'),
    clone = require('clone');


test('immutable', function (t) {
  var original = clone(ast);
  var root = parents(ast);

  t.deepEqual(ast, original, 'original AST is unchanged');
  t.notEqual(root, ast, 'returns a different object');
  t.deepEqual(root, ast, 'structurally equivalent');
  t.false(ast.children[0].parent, 'original AST does not obtain parent links');
  t.end();
});


test('parent links', function (t) {
  var root = parents(ast);
  var heading = root.children[0];
  var cogito = heading.children[0];
  var emphasis = heading.children[1];
  var ergo = emphasis.children[0];
  var sum = heading.children[2];

  t.equal(ergo.parent, emphasis, 'ergo.parent === emphasis');
  t.equal(cogito.parent, heading, 'cogito.parent === heading');
  t.equal(emphasis.parent, heading, 'emphasis.parent === heading');
  t.equal(sum.parent, heading, 'sum.parent === heading');
  t.equal(heading.parent, root, 'heading.parent === root');
  t.false(root.parent, 'root has no parent');

  t.end();
});
