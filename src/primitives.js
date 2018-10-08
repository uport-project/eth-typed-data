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
  bytes1: () => null,
  bytes2: () => null,
  bytes4: () => null,
  bytes8: () => null,
  bytes16: () => null,
  bytes32: () => null,
  uint8: () => null,
  uint16: () => null,
  uint32: () => null,
  uint64: () => null,
  uint128: () => null,
  uint256: () => null,
  int8: () => null,
  int16: () => null,
  int32: () => null,
  int64: () => null,
  int128: () => null,
  int256: () => null,
  address: () => null,
  bool: () => null,
  string: x => x,
  bytes: x => Buffer.from(x)
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


