[![npm](https://nodei.co/npm/unist-util-parents.png)](https://npmjs.com/package/unist-util-parents)

# unist-util-parents

[![Build Status][travis-badge]][travis] [![Dependency Status][david-badge]][david]

Add parent references to [unist] nodes.

[unist]: https://github.com/wooorm/unist

[travis]: https://travis-ci.org/eush77/unist-util-parents
[travis-badge]: https://travis-ci.org/eush77/unist-util-parents.svg
[david]: https://david-dm.org/eush77/unist-util-parents
[david-badge]: https://david-dm.org/eush77/unist-util-parents.png

## Usage

```js
var mdast = require('mdast'),
    unistUtilParents = require('unist-util-parents');

var ast = mdast.parse('# hello world');
unistUtilParents(ast) // === ast

ast.children[0].parent === ast
//=> true
```

## API

#### `parents(ast) -> wrappedAst`

Wraps AST with a proxy that imposes three additional properties on all nodes:

- `parent` — parent link, `null` for the root node.
- `node` — link to the original AST node, e.g. for adding or changing attributes.
- `index()` — method that returns index of this node in the parent's `children` array, `null` for the root node.

None of these properties are enumerable, and the original AST is _not changed_. This means you can JSON.stringify the wrapped tree and it is just the same.

Remember to access `.node` before you commit any changes to a node, including its `children` array.

## Install

```
npm install unist-util-parents
```

## License

MIT
