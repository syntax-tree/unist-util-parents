# unist-util-parents

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**unist**][unist] utility to add references to parents on nodes in a tree.

Instead of modifying the original syntax tree, this module returns a wrapper
that makes it easier to traverse that tree.

Algorithms that work on regular unist trees are (mostly) guaranteed to work on
wrapped trees, and each wrapped node maintains a reference to the node from
which it originated.

## Install

[npm][]:

```sh
npm install unist-util-parents
```

## Use

```js
var u = require('unist-builder')
var parents = require('unist-util-parents')

var tree = u('root', [
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

var wrapped = parents(tree)

// Leaf 4
var node = wrapped.children[1].children[2].children[1].children[0]

var chain = []
while (node) {
  chain.unshift(node.type)
  node = node.parent
}

console.log(chain)
```

Yields:

```js
[ 'root', 'node', 'node', 'node', 'leaf' ]
```

## API

### `parents(tree)`

Returns a wrapped `tree` with a proxy that imposes two additional properties on
all of its nodes:

*   `parent` — parent link (or `null` for the root node)
*   `node` — link to the original node

None of these properties are enumerable, and the original tree is *not changed*.
This means you can `JSON.stringify` the wrapped tree and it’s the same.

`wrapped.children` returns array of wrapped child nodes, so that any
recursive algorithm will work on a wrapped tree just as well.

Remember to access `.node` before you commit any changes to a node.

###### Parameters

*   `tree` ([`Node`][node]) — [Tree][] to wrap

###### Returns

[`Node`][node] — A wrapped node: shallow copy of the given node with
non-enumerable references to `node` and `parent`, and if `tree` had children,
they are wrapped as well.

## Related

*   [`unist-util-visit-parents`][unist-util-visit-parents]
    — Recursively walk over unist nodes, with ancestral information

## Contribute

See [`contributing.md` in `syntax-tree/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [Code of Conduct][coc].
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

[license]: license

[unist]: https://github.com/syntax-tree/unist

[node]: https://github.com/syntax-tree/unist#node

[tree]: https://github.com/syntax-tree/unist#tree

[unist-util-visit-parents]: https://github.com/syntax-tree/unist-util-visit-parents

[contributing]: https://github.com/syntax-tree/.github/blob/HEAD/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/HEAD/support.md

[coc]: https://github.com/syntax-tree/.github/blob/HEAD/code-of-conduct.md
