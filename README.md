[![npm](https://nodei.co/npm/unist-util-parents.png)](https://npmjs.com/package/unist-util-parents)

# unist-util-parents

[![Build Status][travis-badge]][travis] [![Dependency Status][david-badge]][david]

Add a parent reference for each UniST node.

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

#### `unistUtilParents(ast)`

Adds `.parent` to each AST node pointing to a parent node (or `null` for the root node).

`parent` becomes a non-enumerable property of nodes, which means `JSON.stringify` will not be confused with circular references.

```
Object.keys(ast.children[0])
//=> [ 'type', 'depth', 'children' ]

JSON.stringify(ast.children[0])
//=> '{"type":"heading","depth":1,"children":[{"type":"text","value":"hello"}]}'
```

## Install

```
npm install unist-util-parents
```

## License

MIT
