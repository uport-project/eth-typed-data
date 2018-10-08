import { Type } from './Type'

/**
 * @abstract
 * @classdesc
 * A domain is a scope in which we can define multiple Types which can
 * reference each other. A domain behaves similarly to a Type, with the 
 * primary difference that it also includes a set of types that can 
 * reference each other within it.  The primary method of a 
 * domain is `createType()` which will return a new constructor
 * for a type that lives within this domain.
 */
export class Domain {
  constructor(name, properties) {
    this.name = name
    this.properties = properties

    this.types = {}
  }

  /**
   * Return an object mapping the names of types contained by this domain
   * to their list-style type definitions
   * @returns {Object}  Mapping from type name -> type definition
   */
  listTypes() {
    return Object.keys(this.types)
      .map((t) => ({[t]: this.types[t].toTypeDef()}))
      .reduce((obj, typedef) => ({...obj, typedef}), {})
  }

  /**
   * Return a list of {name, type} pairs that define this domain
   * @returns {Object[]}
   */
  toTypeDef() {
    return this.properties.map(({name, type}) => ({name, type}))
  }

  /**
   * Concatenate the type definition for this domain, with 
   * the definition of all the types that it contains
   * @returns {Object} 
   */
  toDomainDef() {
    return {
      [name]: this.toTypeDef(), 
      ...this.listTypes()
    }
  }

  /**
   * Construct a new type that will be associated with this domain
   * @returns {Function}  the constructor for the new type class
   */
  createType = Type.bind(this)
}

// ALl of the 
const EIP712DomainProperties = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
  { name: "salt", type: "bytes32" },
]

export default class EIP712Domain extends Domain {
  constructor(vals) {
    super('EIP712Domain', EIP712DomainProperties)

    this.domainSeporator = this.typeHash()
  }
}