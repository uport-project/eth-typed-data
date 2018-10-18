import abi from 'ethereumjs-abi'
import { keccak256 } from 'js-sha3'

import AbstractType from './AbstractType'
import Type from './Type'
import { validate } from './primitives'

// The set of properties that a EIP712Domain MAY implement
export const EIP712DomainProperties = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
  { name: "salt", type: "bytes32" },
]

/**
 * A constructor/factory function which constructs EIP712 Domains as types,
 * then returns a new instance of the domain. Since an instantiated EIP712 
 * Domain needs to share many static methods with the types it contains
 * (e.g. encodeType, typeHash), but does not require that all properties
 * are present in a given instance, we define a new prototype for each Domain
 * which specifies the provided properties as its type definition, and then
 * instantiates that prototype with the provided values.
 * @param   {Object} def   The definition of the EIP712 domain
 * @returns {Object}       An instantiated EIP712Domain type with the specified properties
 */
export default function EIP712Domain(def) {
  const vals = {}
  // Extract the EIP712 domain properties that were provided
  const properties = EIP712DomainProperties.reduce((props, {name, type}) => {
    // Skip unused EIP712 types
    if (!(name in def)) return props
    // Validate primitive types
    vals[name] = validate[type](def[name])
    // Include property in type definition
    return [...props, {name, type}]
  }, [])

  // Throw an error if extra properties were provided
  if (Object.keys(vals).length !== Object.keys(def).length) {
    throw new Error('Extra key in EIP712Domain definition')
  } else if (Object.keys(def).length === 0) {
    throw new Error('Must supply at least one EIP712Domain property')
  }

  /**
   * @classdesc
   * A domain is a scope in which we can define multiple Types which can
   * reference each other. A domain behaves similarly to a Type, with the 
   * primary difference that it also includes a set of types that can 
   * reference each other within it.  The primary method of a 
   * domain is `createType()` which will return a new constructor
   * for a type that lives within this domain.
   */
  class Domain extends AbstractType {
    static name = 'EIP712Domain'
    static properties = properties
    static dependencies = []

    constructor(vals) {
      super()
      this.vals = vals

      // The types object maps String names to the type prototypes that exist
      // within this domain.  Prototypes are appendended to this.types for every
      // call to this.createType()
      this.types = {}

      // Precompute the domainSeparator for use with signing types in this domain
      this.domainSeparator = this.hashStruct()
    
      /**
       * Construct a new type that will be associated with this domain
       * @returns {Function}  the constructor for the new type class
       */
      this.createType = Type.bind(this)
    }

    /**
     * Return an object mapping the names of types contained by this domain
     * to their list-style type definitions
     * @returns {Object}  Mapping from type name -> type definition
     */
    listTypes() {
      return Object.keys(this.types)
        .reduce((obj, t) => ({...obj, [t]: this.types[t].typeDef()}), {})
    }

    /**
     * Concatenate the type definition for this domain, with 
     * the definition of all the types that it contains
     * @returns {Object} 
     */
    toDomainDef() {
      return {
        [this.constructor.name]: this.constructor.typeDef(), 
        ...this.listTypes()
      }
    }

    /**
     * @override
     * A simplified encodeData function that only needs to handle string
     * and atomic types.  Still defers to abi.rawEncode.
     * @returns {String} encoding of the definition of this Domain
     */
    encodeData() {
      const types = this.constructor.properties.map(({type}) => 
        type === 'string' ? 'bytes32' : type)
      const values = this.constructor.properties.map(({name, type}) => 
        type === 'string' ? keccak256(this.vals[name]) : this.vals[name])

      return abi.rawEncode(types, values)
    }

    /**
     * @override
     */
    toObject() {
      return {...this.vals}
    }
  }

  return new Domain(vals)
}