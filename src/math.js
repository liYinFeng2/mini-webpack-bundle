import test from './test.js'
console.log('test', test.name)

export function add(a,b) {
  return a+b
}

export function exchange (a, b) {
  b = b-a
  a = a+b
  b = a-b
  return [a,b]
}