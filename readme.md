# unist-util-parents

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[unist][] utility to add references to parents on nodes in a tree.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`parents(tree)`](#parentstree)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This utility creates a proxy of the tree that acts like the original tree upon
reading, but each proxied node has a reference to its parent node.

## When should I use this?

This package can be very useful for problems where it is needed to figure out
what a nodes ancestors are, because unist itself is a non-cyclical data
structure, and thus does not provide that information.
On the other hand, this info on ancestors can also be gathered when walking the
tree with [`unist-util-visit-parents`][unist-util-visit-parents].

## Install

This package is [ESM only][esm].
In Node.js (version 14.14+ and 16.0+), install with [npm][]:

```sh
npm install unist-util-parents
```

In Deno with [`esm.sh`][esmsh]:

```js
import {parent} from 'https://esm.sh/unist-util-parents@2'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {parent} from 'https://esm.sh/unist-util-parents@2?bundle'
</script>
```

## Use

```js
import {u} from 'unist-builder'
import {parents} from 'unist-util-parents'

const tree = u('root', [
  u('leaf', 'leaf 1'),
  u('node', [
    u('leaf', 'leaf 2'),
    u('void'),
    u('node', [
      u('leaf', 'leaf 3'),
      u('node', [u('leaf', 'leaf 4')]),
      u('void'),
      u('leaf', 'leaf 5')
    ])
  ])
])

const wrapped = parents(tree)

// Leaf 4
const node = wrapped.children[1].children[2].children[1].children[0]

const chain = []
while (node) {
  chain.push(node.type)
  node = node.parent
}

console.log(chain.reverse())
```

Yields:

```js
['root', 'node', 'node', 'node', 'leaf']
```

## API

This package exports the identifier [`parents`][parents].
There is no default export.

### `parents(tree)`

Create a proxy of `tree` that acts like the original tree upon reading, but
each proxied node has a reference to its parent node.

###### Notes

The returned proxy imposes two additional fields on all of its nodes:

*   `parent` — parent link (or `undefined` for the root)
*   `node` — link to the original node

These new fields are not enumerable and the original tree is *not changed*.
This means you can use `JSON.stringify` on the wrapped tree and it’s the same.

`wrapped.children` returns array of wrapped child nodes, so that any recursive
algorithm will work on a wrapped tree just as well.

To write changes to the tree, use `.node` to access the original tree.

###### Parameters

*   `tree` ([`Node`][node])
    — tree to proxy

###### Returns

Proxy of `tree` (`Proxy`).

## Types

This package is fully typed with [TypeScript][].
It exports the additional type `Proxy`.

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 14.14+ and 16.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

## Related

*   [`unist-util-visit-parents`][unist-util-visit-parents]
    — walk the tree with ancestral information

## Contribute

See [`contributing.md`][contributing] in [`syntax-tree/.github`][health] for
ways to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © Eugene Sharygin

<!-- Definitions -->

[build-badge]: https://github.com/syntax-tree/unist-util-parents/workflows/main/badge.svg

[build]: https://github.com/syntax-tree/unist-util-parents/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/unist-util-parents.svg

[coverage]: https://codecov.io/github/syntax-tree/unist-util-parents

[downloads-badge]: https://img.shields.io/npm/dm/unist-util-parents.svg

[downloads]: https://www.npmjs.com/package/unist-util-parents

[size-badge]: https://img.shields.io/bundlephobia/minzip/unist-util-parents.svg

[size]: https://bundlephobia.com/result?p=unist-util-parents

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[license]: license

[health]: https://github.com/syntax-tree/.github

[contributing]: https://github.com/syntax-tree/.github/blob/main/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/main/support.md

[coc]: https://github.com/syntax-tree/.github/blob/main/code-of-conduct.md

[unist]: https://github.com/syntax-tree/unist

[node]: https://github.com/syntax-tree/unist#node

[unist-util-visit-parents]: https://github.com/syntax-tree/unist-util-visit-parents

[parents]: #parentstree
