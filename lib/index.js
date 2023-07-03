/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 */

/**
 * @typedef ProxyFields
 *   Extra fields found in a proxied node.
 * @property {Parent | undefined} parent
 *   Parent link (or `undefined` for the root).
 * @property {Node} node
 *   Link to the original node
 *
 * @typedef {Node & ProxyFields} Proxy
 *   Proxied node.
 */

/** @type {WeakMap<Node, Proxy>} */
const cache = new WeakMap()

/**
 * Create a proxy of `tree` that acts like the original tree upon reading, but
 * each proxied node has a reference to its parent node.
 *
 * ###### Notes
 *
 * The returned proxy imposes two additional fields on all of its nodes:
 *
 * *   `parent` — parent link (or `undefined` for the root)
 * *   `node` — link to the original node
 *
 * These new fields are not enumerable and the original tree is *not changed*.
 * This means you can use `JSON.stringify` on the wrapped tree and it’s the
 * same.
 *
 * `wrapped.children` returns array of wrapped child nodes, so that any
 * recursive algorithm will work on a wrapped tree just as well.
 *
 * To write changes to the tree, use `.node` to access the original tree.
 *
 * @param {Node} tree
 *   Tree to proxy.
 * @returns {Proxy}
 *   Proxy of `tree`.
 */
export function parents(tree) {
  return wrapNode(tree, undefined)
}

/**
 * @param {Node} node
 *   Node to wrap.
 * @param {Parent | Proxy | undefined} parent
 *   Parent of `node`.
 * @returns {Proxy}
 *   Proxy of `node`.
 */
function wrapNode(node, parent) {
  const entry = cache.get(node)

  if (entry) {
    return entry
  }

  /** @type {Proxy} */
  const proxy = {}
  /** @type {string} */
  let key

  for (key in node) {
    if (key !== 'children') {
      // @ts-expect-error: indexable.
      proxy[key] = node[key]
    }
  }

  Object.defineProperty(proxy, 'node', {
    writable: true,
    configurable: true,
    value: node
  })

  Object.defineProperty(proxy, 'parent', {
    configurable: true,
    get: getParent,
    set: setParent
  })

  if ('children' in node) {
    Object.defineProperty(proxy, 'children', {
      enumerable: true,
      configurable: true,
      get: getChildren
    })
  }

  cache.set(node, proxy)

  return proxy

  /**
   * Get the `parent` reference of a proxied node.
   */
  function getParent() {
    return parent
  }

  /**
   * Set the `parent` reference of a proxied node.
   *
   * @param {Parent} newParent
   */
  function setParent(newParent) {
    parent = newParent
  }

  /**
   * Get the wrapped children of a proxied node.
   */
  function getChildren() {
    /** @type {Array<Node>} */
    // @ts-expect-error `node` is a parent.
    const children = node.children
    return children.map(function (c) {
      return wrapNode(c, proxy)
    })
  }
}
