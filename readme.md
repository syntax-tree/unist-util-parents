# unist-util-parents [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Add parent references to [**unist**][unist] nodes.
Instead of modifying the original syntax tree, this module returns a wrapper
that makes it easier to traverse that tree.

Algorithms that work on regular unist trees are (mostly) guaranteed to work on
wrapped trees, and each wrapped node maintains a reference to the node from
which it originated.

## Installation

[npm][]:

```bash
npm install unist-util-parents
```

## Usage

Say `example.md` looks as follows:

```markdown
*   top-level item

    *   subitem 1
    *   subitem 2
```

...and to follow parent links, our `example.js` looks like this:

```javascript
var vfile = require('to-vfile')
var unified = require('unified')
var parse = require('remark-parse')
var parents = require('unist-util-parents')

var tree = unified()
  .use(parse)
  .parse(vfile.readSync('example.md'))

// "subitem 2"
var item = parents(tree).children[0].children[0].children[1].children[1]

var chain = []
while (item) {
  chain.unshift(item.type)
  item = item.parent
}

console.log(chain)
```

Yields:

```javascript
[ 'root', 'list', 'listItem', 'list', 'listItem' ]
```

## API

### `parents(tree)`

Returns a wrapped `tree` with a proxy that imposes two additional properties on
all of its nodes:

*   `parent` — parent link (or `null` for the root node)
*   `node` — link to the original node

None of these properties are enumerable, and the original tree is *not changed*.
This means you can `JSON.stringify` the wrapped tree and it is just the same.

`wrappedTree.children` returns array of wrapped child nodes, so that any
recursive algorithm will work on a wrapped tree just as well.

Remember to access `.node` before you commit any changes to a node.

## Related

*   [`unist-util-visit-parents`][unist-util-visit-parents]
    — Recursively walk over unist nodes, with ancestral information

## Contribute

See [`contributing.md` in `syntax-tree/unist`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © Eugene Sharygin

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/syntax-tree/unist-util-parents.svg

[travis]: https://travis-ci.org/syntax-tree/unist-util-parents

[codecov-badge]: https://img.shields.io/codecov/c/github/syntax-tree/unist-util-parents.svg

[codecov]: https://codecov.io/github/syntax-tree/unist-util-parents

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[contributing]: https://github.com/syntax-tree/unist/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/unist/blob/master/code-of-conduct.md

[unist]: https://github.com/syntax-tree/unist

[unist-util-visit-parents]: https://github.com/syntax-tree/unist-util-visit-parents
