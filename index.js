/**
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('unist').Node} Node
 *
 * @typedef ProxyFields
 * @property {Parent|null} parent
 *   Parent link (or `null` for the root).
 * @property {Node} node
 *   Link to the original node
 *
 * @typedef {Node & ProxyFields} Proxy
 *   Proxied node
 */

/** @type {WeakMap<Node, Proxy>} */
const cache = new WeakMap()

/**
 * @param {Node} node
 *   Create a proxy of `node` that acts like the original tree upon reading, but
 *   each proxied node has a reference to its parent node.
 * @returns {Proxy}
 *   Proxy of `node`.
 */
export function parents(node) {
  return wrapNode(node, null)
}

/**
 * @param {Node} node
 *   Node to wrap.
 * @param {Parent|null} parent
 *   Parent of `node`.
 * @returns {Proxy}
 *   Proxy of `node`.
 */
function wrapNode(node, parent) {
  if (cache.has(node)) {
    return cache.get(node)
  }

  /** @type {Proxy} */
  const proxy = {}
  /** @type {string} */
  let key

  for (key in node) {
    if (key !== 'children') {
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
    // @ts-expect-error `node` is a parent.
    return node.children.map((/** @type {Node} */ c) => wrapNode(c, proxy))
  }
}
