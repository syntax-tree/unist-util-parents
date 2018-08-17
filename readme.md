[![npm](https://nodei.co/npm/unist-util-parents.png)](https://npmjs.com/package/unist-util-parents)

# unist-util-parents

[![Build Status][travis-badge]][travis] [![Dependency Status][david-badge]][david]

Add parent references to [unist][] nodes. Instead of modifying the original unist tree, this module returns a wrapper that makes it easier to traverse that tree.

Algorithms that work on regular unist trees are (mostly) guaranteed to worked on wrapped trees, and each wrapped node maintains a reference to the node from which it originated.

[unist]: https://github.com/wooorm/unist

[travis]: https://travis-ci.org/eush77/unist-util-parents
[travis-badge]: https://travis-ci.org/eush77/unist-util-parents.svg
[david]: https://david-dm.org/eush77/unist-util-parents
[david-badge]: https://david-dm.org/eush77/unist-util-parents.png

## Examples

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

#### `parents(ast) -> wrappedAst`

Wraps AST with a proxy that imposes two additional properties on all of its nodes:

-   `parent` — parent link, `null` for the root node.
-   `node` — link to the original AST node.

None of these properties are enumerable, and the original AST is _not changed_. This means you can JSON.stringify the wrapped tree and it is just the same.

`wrappedAst.children` returns array of wrapped child nodes, so that any recursive algorithm will work on a wrapped tree just as well.

Remember to access `.node` before you commit any changes to a node.

## Install

```
npm install unist-util-parents
```

## License

MIT
