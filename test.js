/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('unist').Parent} Parent
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import structuredClone from '@ungap/structured-clone'
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

test('parents', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('./index.js')).sort(), [
      'parents'
    ])
  })

  await t.test('should be immutable', function () {
    const original = structuredClone(ast)
    const root = parents(ast)

    assert.deepEqual(ast, original, 'should not change the original tree')
    assert.notEqual(root, ast, 'should return a different object')
    assert.deepEqual(root, ast, 'should be structurally equivalent')
    const head = ast.children[0]
    assert.ok(
      !('parent' in head),
      'should not include parent links in original tree'
    )
  })

  await t.test('should add parent links', function () {
    const root = parents(structuredClone(ast))
    // @ts-expect-error: hush
    const heading = /** @type {Parent} */ (root.children[0])
    const cogito = /** @type {Parent} */ (heading.children[0])
    const emphasis = /** @type {Parent} */ (heading.children[1])
    const ergo = emphasis.children[0]
    const sum = heading.children[2]

    // @ts-expect-error: custom.
    assert.equal(ergo.parent, emphasis)
    // @ts-expect-error: custom.
    assert.equal(cogito.parent, heading)
    // @ts-expect-error: custom.
    assert.equal(emphasis.parent, heading)
    // @ts-expect-error: custom.
    assert.equal(sum.parent, heading)
    // @ts-expect-error: custom.
    assert.equal(heading.parent, root)
    assert.equal(root.parent, undefined)

    assert.equal(
      Object.keys(sum).indexOf('parent'),
      -1,
      'should not be enumerable'
    )

    // @ts-expect-error: custom.
    ergo.parent = ergo.parent.parent
    assert.equal(
      // @ts-expect-error: custom.
      emphasis.children[0].parent,
      heading,
      'should be able to modify parent links'
    )
  })

  await t.test('should add node links', function () {
    const root = parents(ast)
    /** @type {Parent} */
    // @ts-expect-error: hush.
    const heading = root.children[0]
    const headingNode = ast.children[0]

    // @ts-expect-error: custom.
    assert.equal(heading.node, headingNode)
    assert.equal(
      Object.keys(heading).indexOf('node'),
      -1,
      'should not be enumerable'
    )
  })
})
