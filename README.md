[![npm](https://nodei.co/npm/unist-util-parents.png)](https://npmjs.com/package/unist-util-parents)

# unist-util-parents

[![Build Status][travis-badge]][travis] [![Dependency Status][david-badge]][david]

Add parent references to [unist] nodes.

[unist]: https://github.com/wooorm/unist

[travis]: https://travis-ci.org/eush77/unist-util-parents
[travis-badge]: https://travis-ci.org/eush77/unist-util-parents.svg
[david]: https://david-dm.org/eush77/unist-util-parents
[david-badge]: https://david-dm.org/eush77/unist-util-parents.png

## Example

Unwrap all `emphasis` and `strong` nodes:

```js
var parents = require('unist-util-parents'),
    select = require('unist-util-select');

var ast = mdast.parse(src);
select(parents(ast), 'emphasis, strong').forEach(function (em) {
  var siblings = em.parent.node.children;
  var index = siblings.indexOf(em.node);
  [].splice.apply(siblings, [index, 1].concat(em.node.children));
});
```

Which turns this:

```md
# Drop highlight

Drop __all__ the [*emphasis*][1] and **bold** highlighting, leaving

| _everything_ |
| :----------: |
|    `else`    |

## __intact__

[1]: https://ddg.gg/?q=emphasis
```

into this:

```md
# Drop highlight

Drop all the [emphasis][1] and bold highlighting, leaving

| everything |
| :--------: |
|   `else`   |

## intact

[1]: https://ddg.gg/?q=emphasis

```

## API

#### `parents(ast) -> wrappedAst`

Wraps AST with a proxy that imposes two additional properties on all nodes:

- `parent` — parent link, `null` for the root node.
- `node` — link to the original AST node, e.g. for adding or changing attributes.

None of these properties are enumerable, and the original AST is _not changed_. This means you can JSON.stringify the wrapped tree and it is just the same.

Remember to access `.node` before you commit any changes to a node, including its `children` array.

## Install

```
npm install unist-util-parents
```

## License

MIT
