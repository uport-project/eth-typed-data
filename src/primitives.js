const ATOMICS = [
  'bytes1', 'bytes2', 'bytes4', 'bytes8', 'bytes16', 'bytes32',
  'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256',
  'int8', 'int16', 'int32', 'int64', 'int128', 'int256',
  'address', 'bool'
]

const DYNAMICS = [
  'string', 'bytes'
]

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
  int8: x => x,
  int16: x => x,
  int32: x => x,
  int64: x => x,
  int128: x => x,
  int256: x => x,
  address: x => x,
  bool: x => x,
  string: x => x,
  bytes: x => Buffer.from(x)
}

/**
 * Return true if the argument is an array type
 * @param {String} type 
 */
export function isArrayType(type) {
  return type.slice(-2) === '[]'
}

/**
 * Return true if the argument is an atomic type in the EIP712 schema
 * @param {String} type 
 * @returns {Boolean}
 */
export function isAtomicType(type) {
  return ATOMICS.includes(type)
}

/**
 * Return true if the argument is the name of a dynamic type in the EIP712 schema
 * @param {String} type 
 * @returns {Boolean}
 */
export function isDynamicType(type) {
  return DYNAMICS.includes(type)
}

/**
 * Determine if the argument is a EIP712 primitive type, i.e. a dynamic or atomic type
 * @param {String} type 
 * @returns {Boolean}
 */
export function isPrimitiveType(type) {
  return isAtomicType(type) || isDynamicType(type)
}


