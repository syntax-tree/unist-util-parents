/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('unist').Parent} Parent
 */

import test from 'tape'
// To do: replace with `structuredClone` when stable.
import clone from 'clone'
import {parents} from './index.js'

/** @type {Root} */
const ast = {
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
  const original = clone(ast)
  const root = parents(ast)

  t.deepEqual(ast, original, 'original AST is unchanged')
  t.notEqual(root, ast, 'returns a different object')
  t.deepEqual(root, ast, 'structurally equivalent')
  const head = ast.children[0]
  t.ok(!('parent' in head), 'original AST does not obtain parent links')
  t.end()
})

test('parent links', function (t) {
  const root = parents(clone(ast))
  // @ts-expect-error: hush
  const heading = /** @type {Parent} */ (root.children[0])
  const cogito = /** @type {Parent} */ (heading.children[0])
  const emphasis = /** @type {Parent} */ (heading.children[1])
  const ergo = emphasis.children[0]
  const sum = heading.children[2]

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
  t.false(root.parent, 'root has no parent')

  t.equal(Object.keys(sum).indexOf('parent'), -1, 'not enumerable')

  // @ts-expect-error: custom.
  ergo.parent = ergo.parent.parent
  // @ts-expect-error: custom.
  t.equal(emphasis.children[0].parent, heading, 'can modify parent link')

  t.end()
})

test('node links', function (t) {
  const root = parents(ast)
  /** @type {Parent} */ // @ts-expect-error: hush.
  const heading = root.children[0]
  const headingNode = ast.children[0]

  // @ts-expect-error: custom.
  t.equal(heading.node, headingNode)
  t.equal(Object.keys(heading).indexOf('node'), -1, 'not enumerable')
  t.end()
})
