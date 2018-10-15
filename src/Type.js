import abi from 'ethereumjs-abi'
import { keccak256 } from 'js-sha3'

import AbstractType from './AbstractType'
import { isPrimitiveType, isDynamicType, isAtomicType } from './primitives'

/**
 * A factory function which returns a class representing an EIP712 Type
 * The returned Type can be instantiated and validated as an instance
 * of a particular type
 * 
 * There are two acceptable formats for the type definitions, a list of 
 * {
 *   name1: 'string',
 *   name2: 'string',
 * }
 * 
 * or 
 * 
 * [{
 *  name: 'name1',
 *  type: 'string'
 * }, {
 *  name: 'name2',
 *  type: 'string'
 * }]
 * 
 * @this    {Domain} The domain object to which the returned type should be associated * 
 * @param   {String}            name      A String to define the type 
 * @param   {Object|Object[]}   defs      The definition of the type's members and their types
 * @returns {Function} the constructor for the new TypeClass
 */
export default function Type (primaryType, defs) {
  // Ensure that domain is defined
  const domain = this || { types: {} }
  if (!domain.types) domain.types = {}

  // Process the type definition into an array of {name, type} pairs, 
  // keeping track of all dependent types 
  const properties = Array.isArray(defs)
    ? defs.map(({name, type}) => validateTypeDefinition({name, type}, domain))
    : Object.keys(defs).map((name) => validateTypeDefinition({name, type: defs[name]}, domain))

  // Descend through the properties list to come up with a list of 
  // structure types that this type includes, sorted alphabetically
  const dependencies = findDependencies(properties, domain, []).sort()

  /**
   * @classdesc
   * This is the dynamically created class that represents a particular Struct type in
   * the EIP712 scheme.  This can be instantiated with particular values that match the
   * type's definition, and provides methods to encode the type in various formats, and 
   * sign it with a provided signer.
   */
  class TypeClass extends AbstractType {
    static name = primaryType
    static properties = properties
    static dependencies = dependencies

    constructor (vals) {
      this.name = primaryType
      this.properties = properties

      // Save values for a type instance privately
      this._object = {}
      for (const prop of properties) {
        if (!(prop.name in vals)) {
          throw new Error(`Type ${this.name} missing required property ${prop.name}`)
        }

        this._object[prop.name] = vals[prop.name]

        // Expose getters and setters for this.prop, validating on set
        Object.defineProperty(this, prop.name, {
          get: () => this._object[prop.name],
          set: (val) => {
            this._object[prop.name] = isPrimitiveType(prop.type)
              ? validatePrimitive[prop.type](val)
              : domain.types[prop.type].validate(val)
          }
        })
      }
    }

    /**
     * @static
     * Validate that a particular object conforms to this class' type defintion,
     * recursively applying the validation function for each nested type, and making a
     * deep copy of the object in the process.
     * @param   {Object}  obj   the potential instance of this type to be validated
     * @returns {Boolean} whether or not a particular object is a valid instance of this type
     */
    static validate(obj) {
      this.properties.map(({type, name}) => ({
        [name]: isPrimitiveType(type)
          ? validatePrimitive[type](obj[name])
          : domain.types[type].validate(obj[name])
      })).reduce(kv => ({...obj, ...kv}), {})
    }

    /**
     * @override @static
     * Return the part of the type encoding that consists of the dependent types
     * i.e. the nested Structure types contained by this type.
     * @returns {String} A string encoding all types upon which this type depends
     */
    static encodeDependentTypes() {
      return this.dependencies.map(t => domain.types[t].encodeTypeFragment())
    }

    /**
     * @override
     * Return a bare object representation of this instance (as a new object)
     * // TODO: allow recursive decomposition
     * @returns {Object} new object containing same key-value pairs of this instance
     */
    toObject() {
      return { ...this._object }
    }

    /**
     * Encode this object along with its type and domain as a full EIP712 
     * signature request, defining the types, domain, primaryType, and message
     * to be signed.  The output is suitable for use with web3.eth.signTypedData
     * @returns {Object} the signature request encoding of this instance
     */
    toSignatureRequest() {
      return {
        types: domain.toDomainDef(),
        domain: domain.toObject(),
        primaryType: this.name, 
        message: this.toObject()
      }
    }

    /**
     * @override
     * Return the EIP712 data encoding of this instance, padding each member
     * to 32 bytes and hashing the result.  The ethereumjs-abi module provides
     * an encode() function which does most of the heavy lifting here, and the
     * structure of this function significantly inspired by the sample code
     * provided in the original EIP712 proposal.
     * @returns {String} the encoded data of this instance, ready for use with hashStruct
     */
    encodeData() {
      // Build parallel lists of types and values, to be passed to abi.encode
      let types = ['bytes32']
      let values = [this.typeHash()]

      for (const {type, name} of this.constructor.properties) {
        if (isDynamicType(type)) {
          types.push('bytes32')
          values.push(keccak256(this[name]))
        } else if (type in domain.types) {
          // Potentially inefficient: construct a new type and call its encodeData method
          const SubType = domain.types[type]
          const encodedSubtype = (new SubType(this[name])).encodeData()
          // Hash the encoded data of the subtype
          types.push('bytes32')
          values.push(keccak256(encodedSubtype))
        } else if (isArrayType(type)) {
          throw new Error('Array types not yet supported')
        } else if (isAtomicType(type)) {
          types.push(type)
          values.push(this[name])
        } else {
          throw new Error(`Unknown type: ${type}`)
        }
      }

      return abi.rawEncode(types, values)
    }

    /**
     * ABI encode this type according to the EIP712 spec. The encoding returned
     * is compatible with solidity, and ready to be signed.
     * @returns {String} The abi encoding of this instance, in an appropriate format to be signed
     */
    encode() {
      // \x19\x01 is the specified prefix for a typedData message
      return `\x19\x01${domain.domainSeparator}${this.hashStruct()}`
    }

    /**
     * Sign the fully encoded version of the current instance with a provided
     * signer.  This is equivalent to the `web3.eth.signTypedData` function.
     * @param   {Object} signer The signer object, configured with a private key and exposing a `sign` method
     * @returns {String} the signed, encoded piece of data
     */
    sign(signer) {
      if (!(signer && signer.sign)) {
        throw new Error('Must provide a signer object with a sign() method')
      }

      return signer.sign(this.encode())
    }
  }

  // Save the new TypeClass to the domain
  domain.types[name] = TypeClass

  return TypeClass
}

/**
 * Check the validity of a particular name/type pair within a given domain,
 * and return an object containing the name and type.
 * 
 * @param {Object} item   the item being validated, must contain `name` and `type` keys
 * @param {Object} domain the domain in which the item should be validated
 */
function validateTypeDefinition({name, type}, domain) {
  if (!name || !type) {
    throw new Error('Invalid type definition: all entries must specify name and type')
  }

  if (typeof type === 'object') {
    // TODO: Allow recursive type defintions?
    throw new Error('Recursive type definitions not supported')
  } else if (!isPrimitiveType(type) && !(type in domain.types)) {
    // Refuse undefined, non-primitive types
    throw new Error(`Type ${type} is undefined in this domain`)
  }

  return {name, type}
}

/**
 * Recursively search a list of properties to uncover a list of all dependent types
 * Each non-primitive type delegates to the dependencies of that type
 * 
 * @param {Object[]}      props  The properties of a particular
 * @param {Object|Domain} domain The domain object in which the dependencies are being resolved
 * @param {String[]}      found  A list of structure type names found so far
 */
function findDependencies(props, domain, found=[]) {
  for (let {type} of props) {
    if (isPrimitiveType(type)) continue
    // Merge the found array with new dependencies of 
    found = found.concat(
      [type, ...findDependencies(domain.types[type].properties, domain, found)]
        .filter(t => !found.includes(t))
    )
  }

  return found
}