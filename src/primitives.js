export const ATOMICS = new Set([
  'bytes1', 'bytes2', 'bytes4', 'bytes8', 'bytes16', 'bytes32',
  'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256',
  'int8', 'int16', 'int32', 'int64', 'int128', 'int256',
  'address', 'bool'
])

export const DYNAMICS = new Set([
  'string', 'bytes'
])

/**
 * Return true if the argument is an array type
 * @param   {String}  type 
 * @returns {Boolean} 
 */
export function isArrayType(type) {
  return type.length > 2 && type.slice(-2) === '[]'
}

/**
 * Return the type
 * @param   {String} type 
 * @returns {String} 
 */
export function getElementaryType(type) {
  if (isArrayType(type)) return type.slice(0,-2)
  throw new Error("Can't get element of non-array type")
}

/**
 * Return true if the argument is an atomic type in the EIP712 schema
 * @param {String} type 
 * @returns {Boolean}
 */
export function isAtomicType(type) {
  return ATOMICS.has(type)
}

/**
 * Return true if the argument is the name of a dynamic type in the EIP712 schema
 * @param {String} type 
 * @returns {Boolean}
 */
export function isDynamicType(type) {
  return DYNAMICS.has(type)
}

/**
 * Determine if the argument is a EIP712 primitive type, i.e. a dynamic or atomic type
 * @param {String} type 
 * @returns {Boolean}
 */
export function isPrimitiveType(type) {
  return isAtomicType(type) || isDynamicType(type)
}

/**
 * Determine if the argument is not a structure type, i.e. it is a primitive type or an
 * arbitrarily nested array of structure types
 * @param {String} type
 * @returns {Boolean}
 */
export function isNotStructureType(type) {
  if (isPrimitiveType(type)) return true
  if (isArrayType(type)) return isNotStructureType(getElementaryType(type))
  return false
}

/**
 * Return a validation function which will switch on the javascript type of the sole argument
 * and handle each case with a function for that type, defined by the mapping in {handlers}
 * @param   {String}    target    The string name of the solidity primitive type to which we are converting
 * @param   {Object}    handlers  An object mapping javascript types to a validation function for that type
 * @returns {Function}  a validation function which will delegate to one of the provided validators
 *                      according to the type of the input
 */
function handleByType(target, handlers) {
  return input => {
    const jstype = typeof input
    if (jstype in handlers) return handlers[jstype](input)
    throw new Error(`Cannot convert javascript type ${jstype} to solidity type ${target}`)
  }
}

/**
 * Throw an error with a given message. This is convenient for throwing
 * an error inside an expression without having to create a full function.
 * @param {String} message message for the error to be thrown
 */
function reject(message) {
  throw new Error(message)
}

function inRange(lo, hi, type) {
  return x => x >= lo && x < hi ? x : reject(`Value ${x} is outside the valid range for type ${type}`)
}

/**
 * Validation functions for unifying javascript representations of solidity types
 */
export const validate = {
  bytes1: x => x,
  bytes2: x => x,
  bytes4: x => x,
  bytes8: x => x,
  bytes16: x => x,
  bytes32: x => x,
  uint8: x => x,
  uint16: x => x,
  uint32: x => x,
  uint64: x => x,
  uint128: x => x,
  uint256: x => x,
  int8: handleByType('int8', {
    number: inRange(-127, 128, 'int8'),
    string: ,
  }),
  int16: x => x,
  int32: x => x,
  int64: x => x,
  int128: x => x,
  int256: x => x,
  address: handleByType('address', {
    string: x => x.slice(2) === '0x' ? x : `0x${x}`,
    object: x => x instanceof Buffer ? `0x${x.toString('hex')}` : reject('Cannot coerce object to address: must be string or Buffer')
  }),
  bool: x => x,
  string: x => x,
  bytes: x => Buffer.from(x)
}
