var cache = new WeakMap()

export function parents(ast) {
  return wrapNode(ast, null)
}

function wrapNode(node, parent) {
  var proxy
  var key

  if (cache.has(node)) {
    return cache.get(node)
  }

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

  if (node.children) {
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

  function setParent(newParent) {
    parent = newParent
  }

  function getChildren() {
    return node.children.map(function (child) {
      return wrapNode(child, proxy)
    })
  }
}
