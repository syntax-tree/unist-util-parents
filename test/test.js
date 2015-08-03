'use strict';

var parents = require('..');

var test = require('tape'),
    visit = require('unist-util-visit');


var root = require('./ast'),
    heading = root.children[0],
    cogito = heading.children[0],
    emphasis = heading.children[1],
    ergo = emphasis.children[0],
    sum = heading.children[2];


var getName = function (node) {
  return ['root', 'heading', 'cogito', 'emphasis', 'ergo', 'sum'].reduce(
    function (acc, name) {
      return eval(name) === node ? name : acc;
    }
  );
};


test('parents', function (t) {
  t.plan(7);
  t.equal(parents(root), root, 'same ast');

  t.equal(ergo.parent, emphasis, 'ergo.parent === emphasis');
  t.equal(cogito.parent, heading, 'cogito.parent === heading');
  t.equal(emphasis.parent, heading, 'emphasis.parent === heading');
  t.equal(sum.parent, heading, 'sum.parent === heading');
  t.equal(heading.parent, root, 'heading.parent === root');
  t.false(root.parent, 'root has no parent');
});


test('attributes', function (t) {
  t.plan(18);

  var message = function (node) {
    return function (property) {
      return getName(node) + ' (' + property + ')';
    };
  };

  visit(root, function (node) {
    var msg = message(node);
    var descriptor = Object.getOwnPropertyDescriptor(node, 'parent');
    t.true(descriptor.writable, msg('writable=true'));
    t.true(descriptor.configurable, msg('configurable=true'));
    t.false(descriptor.enumerable, msg('enumerable=false'));
  });
});
