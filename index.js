/**
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('unist').Node} Node
 *
 * @typedef {Node} Proxy
 * @property {parent|null} parent
 */

/** @type {WeakMap<Node, Proxy>} */
var cache = new WeakMap()

/**
 * @param {Node} tree
 * @returns {Proxy}
 */
export function parents(tree) {
  return wrapNode(tree, null)
}

/**
 * @param {Node} node
 * @param {Parent|null} parent
 * @returns {Proxy}
 */
function wrapNode(node, parent) {
  /** @type {Node} */
  var proxy
  /** @type {string} */
  var key

  if (cache.has(node)) {
    return cache.get(node)
  }

  // @ts-ignore Assume `node` is a valid node.
  proxy = {}

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

  function getParent() {
    return parent
  }

  /**
   * @param {Parent} newParent
   */
  function setParent(newParent) {
    parent = newParent
  }

  function getChildren() {
    // @ts-ignore `node` is a parent.
    return node.children.map((/** @type {Node} */ c) => wrapNode(c, proxy))
  }
}
