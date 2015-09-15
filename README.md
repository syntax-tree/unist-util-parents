[![npm](https://nodei.co/npm/unist-util-parents.png)](https://npmjs.com/package/unist-util-parents)

# unist-util-parents

[![Build Status][travis-badge]][travis] [![Dependency Status][david-badge]][david]

Add parent references to [unist] nodes.

[unist]: https://github.com/wooorm/unist

[travis]: https://travis-ci.org/eush77/unist-util-parents
[travis-badge]: https://travis-ci.org/eush77/unist-util-parents.svg
[david]: https://david-dm.org/eush77/unist-util-parents
[david-badge]: https://david-dm.org/eush77/unist-util-parents.png

## Examples

Follow parent links:

```js
var ast = mdast.parse('- top-level item\n' +
                      '  - subitem 1\n' +
                      '  - subitem 2\n');

// "subitem 2"
var item = parents(ast).children[0].children[0].children[1].children[1];

var chain = [];
while (item) {
  chain.unshift(item.type);
  item = item.parent;
}
chain
//=> [ 'root', 'list', 'listItem', 'list', 'listItem' ]
```

Unwrap all `emphasis` and `strong` nodes:

```js
var parents = require('unist-util-parents'),
    select = require('unist-util-select');

select(parents(ast), 'emphasis, strong').forEach(function (em) {
  var siblings = em.parent.node.children;
  var index = siblings.indexOf(em.node);
  [].splice.apply(siblings, [index, 1].concat(em.node.children));
});
```

input:

```md
# Drop highlight

Drop __all__ the [*emphasis*][1] and **[bold][1]** highlighting, leaving

| _everything_ |
| :----------: |
|    `else`    |

## __intact__

[1]: https://ddg.gg/?q=emphasis
```

output:

```md
# Drop highlight

Drop all the [emphasis][1] and [bold][1] highlighting, leaving

| everything |
| :--------: |
|   `else`   |

## intact

[1]: https://ddg.gg/?q=emphasis
```

## API

#### `parents(ast) -> wrappedAst`

Wraps AST with a proxy that imposes two additional properties on all of its nodes:

- `parent` — parent link, `null` for the root node.
- `node` — link to the original AST node.

None of these properties are enumerable, and the original AST is _not changed_. This means you can JSON.stringify the wrapped tree and it is just the same.

`wrappedAst.children` returns array of wrapped child nodes, so that any recursive algorithm will work on a wrapped tree just as well.

Remember to access `.node` before you commit any changes to a node.

## Install

```
npm install unist-util-parents
```

## License

MIT
