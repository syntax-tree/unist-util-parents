/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('unist').Parent} Parent
 */

import assert from 'node:assert/strict'
import test from 'node:test'
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

test('immutable', function () {
  const original = clone(ast)
  const root = parents(ast)

  assert.deepEqual(ast, original, 'original AST is unchanged')
  assert.notEqual(root, ast, 'returns a different object')
  assert.deepEqual(root, ast, 'structurally equivalent')
  const head = ast.children[0]
  assert.ok(!('parent' in head), 'original AST does not obtain parent links')
})

test('parent links', function () {
  const root = parents(clone(ast))
  // @ts-expect-error: hush
  const heading = /** @type {Parent} */ (root.children[0])
  const cogito = /** @type {Parent} */ (heading.children[0])
  const emphasis = /** @type {Parent} */ (heading.children[1])
  const ergo = emphasis.children[0]
  const sum = heading.children[2]

  // @ts-expect-error: custom.
  assert.equal(ergo.parent, emphasis, 'ergo.parent === emphasis')
  // @ts-expect-error: custom.
  assert.equal(cogito.parent, heading, 'cogito.parent === heading')
  // @ts-expect-error: custom.
  assert.equal(emphasis.parent, heading, 'emphasis.parent === heading')
  // @ts-expect-error: custom.
  assert.equal(sum.parent, heading, 'sum.parent === heading')
  // @ts-expect-error: custom.
  assert.equal(heading.parent, root, 'heading.parent === root')
  assert.equal(root.parent, null, 'root has no parent')

  assert.equal(Object.keys(sum).indexOf('parent'), -1, 'not enumerable')

  // @ts-expect-error: custom.
  ergo.parent = ergo.parent.parent
  // @ts-expect-error: custom.
  assert.equal(emphasis.children[0].parent, heading, 'can modify parent link')
})

test('node links', function () {
  const root = parents(ast)
  /** @type {Parent} */ // @ts-expect-error: hush.
  const heading = root.children[0]
  const headingNode = ast.children[0]

  // @ts-expect-error: custom.
  assert.equal(heading.node, headingNode)
  assert.equal(Object.keys(heading).indexOf('node'), -1, 'not enumerable')
})
