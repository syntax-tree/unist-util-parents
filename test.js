/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 */

import test from 'tape'
import clone from 'clone'
import {parents} from './index.js'

var ast = {
  type: 'root',
  children: [
    {
      type: 'heading',
      depth: 1,
      children: [
        {type: 'text', value: 'cogito, '},
        {type: 'emphasis', children: [{type: 'text', value: 'ergo'}]},
        {type: 'text', value: ' sum'}
      ]
    }
  ]
}

test('immutable', function (t) {
  var original = clone(ast)
  var root = parents(ast)

  t.deepEqual(ast, original, 'original AST is unchanged')
  t.notEqual(root, ast, 'returns a different object')
  t.deepEqual(root, ast, 'structurally equivalent')
  t.equal(
    // type-coverage:ignore-next-line, yeah, that’s expected.
    ast.children[0].parent,
    undefined,
    'original AST does not obtain parent links'
  )
  t.end()
})

test('parent links', function (t) {
  var root = parents(clone(ast))
  /** @type {Parent} */ // @ts-expect-error: hush.
  var heading = root.children[0]
  /** @type {Parent} */ // @ts-expect-error: hush.
  var cogito = heading.children[0]
  /** @type {Parent} */ // @ts-expect-error: hush.
  var emphasis = heading.children[1]
  var ergo = emphasis.children[0]
  var sum = heading.children[2]

  // @ts-expect-error: custom.
  t.equal(ergo.parent, emphasis, 'ergo.parent === emphasis')
  // @ts-expect-error: custom.
  t.equal(cogito.parent, heading, 'cogito.parent === heading')
  // @ts-expect-error: custom.
  t.equal(emphasis.parent, heading, 'emphasis.parent === heading')
  // @ts-expect-error: custom.
  t.equal(sum.parent, heading, 'sum.parent === heading')
  // @ts-expect-error: custom.
  t.equal(heading.parent, root, 'heading.parent === root')
  // @ts-expect-error: custom.
  t.false(root.parent, 'root has no parent')

  t.equal(Object.keys(sum).indexOf('parent'), -1, 'not enumerable')

  // @ts-expect-error: custom.
  ergo.parent = ergo.parent.parent
  // @ts-expect-error: custom.
  t.equal(emphasis.children[0].parent, heading, 'can modify parent link')

  t.end()
})

test('node links', function (t) {
  var root = parents(ast)
  /** @type {Parent} */ // @ts-expect-error: hush.
  var heading = root.children[0]
  var headingNode = ast.children[0]

  // @ts-expect-error: custom.
  t.equal(heading.node, headingNode)
  t.equal(Object.keys(heading).indexOf('node'), -1, 'not enumerable')
  t.end()
})
