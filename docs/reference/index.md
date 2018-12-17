## Classes

<dl>
<dt><a href="#Domain">Domain</a></dt>
<dd><p>A domain is a scope in which we can define multiple Types which can
reference each other. A domain behaves similarly to a Type, with the 
primary difference that it also includes a set of types that can 
reference each other within it.  The primary method of a 
domain is <code>createType()</code> which will return a new constructor
for a type that lives within this domain.</p>
</dd>
<dt><a href="#StructureType">StructureType</a></dt>
<dd><p>This is the dynamically created class that represents a particular Struct type in
the EIP712 scheme.  This can be instantiated with particular values that match the
type&#39;s definition, and provides methods to encode the type in various formats, and 
sign it with a provided signer.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#validate">validate</a></dt>
<dd><p>Validation functions for unifying javascript representations of solidity types</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#encodeTypeFragment">encodeTypeFragment()</a> ⇒ <code>String</code></dt>
<dd></dd>
<dt><a href="#encodeDependentTypes">encodeDependentTypes()</a></dt>
<dd></dd>
<dt><a href="#encodeType">encodeType()</a> ⇒ <code>String</code></dt>
<dd></dd>
<dt><a href="#typeHash">typeHash()</a> ⇒ <code>String</code></dt>
<dd></dd>
<dt><a href="#typeDef">typeDef()</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#hashStruct">hashStruct()</a> ⇒ <code>String</code></dt>
<dd><p>Calculate the EIP712 hash for this object according to the specification</p>
</dd>
<dt><a href="#encodeData">encodeData()</a></dt>
<dd></dd>
<dt><a href="#toObject">toObject()</a></dt>
<dd></dd>
<dt><a href="#validateTypeDefinition">validateTypeDefinition(item, domain)</a></dt>
<dd><p>Check the validity of a particular name/type pair within a given domain,
and return an object containing the name and type.</p>
</dd>
<dt><a href="#findDependencies">findDependencies(props, domain, found)</a></dt>
<dd><p>Recursively search a list of properties to uncover a list of all dependent types
Each non-primitive type delegates to the dependencies of that type</p>
</dd>
<dt><a href="#isArrayType">isArrayType(type)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Return true if the argument is an array type</p>
</dd>
<dt><a href="#getElementaryType">getElementaryType(type)</a> ⇒ <code>String</code></dt>
<dd><p>Return the type</p>
</dd>
<dt><a href="#isAtomicType">isAtomicType(type)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Return true if the argument is an atomic type in the EIP712 schema</p>
</dd>
<dt><a href="#isDynamicType">isDynamicType(type)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Return true if the argument is the name of a dynamic type in the EIP712 schema</p>
</dd>
<dt><a href="#isPrimitiveType">isPrimitiveType(type)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Determine if the argument is a EIP712 primitive type, i.e. a dynamic or atomic type</p>
</dd>
<dt><a href="#verify">verify()</a></dt>
<dd><p>Verify that a particular object was signed by a given</p>
</dd>
<dt><a href="#verifyRawSignatureFromAddress">verifyRawSignatureFromAddress(data, signature, address)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify a signed hash made by the owner of a particular ethereum address
returning true if the signature is valid, and false otherwise</p>
</dd>
<dt><a href="#toEthereumAddress">toEthereumAddress(hexPublicKey)</a> ⇒ <code>String</code></dt>
<dd><p>Convert a hex encoded secp256k1 public key to the equivalent ethereum address</p>
</dd>
<dt><a href="#normalizeSignature">normalizeSignature(sig)</a> ⇒ <code>Object</code></dt>
<dd><p>Convert a string, or buffer signature to an object containing
the three signature parameters r, s, v</p>
</dd>
</dl>

<a name="Domain"></a>

## Domain
A domain is a scope in which we can define multiple Types which can
reference each other. A domain behaves similarly to a Type, with the 
primary difference that it also includes a set of types that can 
reference each other within it.  The primary method of a 
domain is `createType()` which will return a new constructor
for a type that lives within this domain.

**Kind**: global class  

* [Domain](#Domain)
    * [.createType](#Domain+createType) ⇒ <code>function</code>
    * [.validate(type, val)](#Domain+validate) ⇒ <code>Any</code>
    * [.serialize(type, val)](#Domain+serialize) ⇒ <code>Object</code>
    * [.listTypes()](#Domain+listTypes) ⇒ <code>Object</code>
    * [.toDomainDef()](#Domain+toDomainDef) ⇒ <code>Object</code>
    * [.encodeData()](#Domain+encodeData) ⇒ <code>String</code>
    * [.toObject()](#Domain+toObject)

<a name="Domain+createType"></a>

### domain.createType ⇒ <code>function</code>
Construct a new type that will be associated with this domain

**Kind**: instance property of [<code>Domain</code>](#Domain)  
**Returns**: <code>function</code> - the constructor for the new type class  
<a name="Domain+validate"></a>

### domain.validate(type, val) ⇒ <code>Any</code>
Validate that a particular object conforms to a valid type definition in this domain, 
and return a standardized version of input value.  In particular, structure types will
be coerced to an instance of the corresponding structure class, array types will validate
each item according to the base type of the array, and primitive types will be validated
by the appropriate validator in `validatePrimitive`

**Kind**: instance method of [<code>Domain</code>](#Domain)  
**Returns**: <code>Any</code> - the standardized/validated representation of this  
**Throws**:

- <code>Error</code> if the input is an invalid instance of the given type


| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | the string name of the type of the value being validated |
| val | <code>Any</code> | the candidate value of the type to be validated/standardized |

<a name="Domain+serialize"></a>

### domain.serialize(type, val) ⇒ <code>Object</code>
Recursively expand an object containing instances of structure type classes,
and return a bare javascript object with the same hierarchical structure
Conceptually the opposite of this.validate

**Kind**: instance method of [<code>Domain</code>](#Domain)  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | the string name of the type of value being serialized |
| val | <code>Any</code> | the type instance or primitive literal being serialized |

<a name="Domain+listTypes"></a>

### domain.listTypes() ⇒ <code>Object</code>
Return an object mapping the names of types contained by this domain
to their list-style type definitions

**Kind**: instance method of [<code>Domain</code>](#Domain)  
**Returns**: <code>Object</code> - Mapping from type name -> type definition  
<a name="Domain+toDomainDef"></a>

### domain.toDomainDef() ⇒ <code>Object</code>
Concatenate the type definition for this domain, with 
the definition of all the types that it contains

**Kind**: instance method of [<code>Domain</code>](#Domain)  
<a name="Domain+encodeData"></a>

### domain.encodeData() ⇒ <code>String</code>
**Kind**: instance method of [<code>Domain</code>](#Domain)  
**Returns**: <code>String</code> - encoding of the definition of this Domain  
<a name="Domain+toObject"></a>

### domain.toObject()
**Kind**: instance method of [<code>Domain</code>](#Domain)  
<a name="StructureType"></a>

## StructureType
This is the dynamically created class that represents a particular Struct type in
the EIP712 scheme.  This can be instantiated with particular values that match the
type's definition, and provides methods to encode the type in various formats, and 
sign it with a provided signer.

**Kind**: global class  

* [StructureType](#StructureType)
    * _instance_
        * [.toObject()](#StructureType+toObject) ⇒ <code>Object</code>
        * [.toSignatureRequest()](#StructureType+toSignatureRequest) ⇒ <code>Object</code>
        * [.encodeData()](#StructureType+encodeData) ⇒ <code>String</code>
        * [.encode()](#StructureType+encode) ⇒ <code>String</code>
        * [.signHash()](#StructureType+signHash) ⇒ <code>String</code>
        * [.sign(signer)](#StructureType+sign) ⇒ <code>String</code>
        * [.verifySignature(signature, address)](#StructureType+verifySignature) ⇒ <code>Boolean</code>
    * _static_
        * [.encodeDependentTypes()](#StructureType.encodeDependentTypes) ⇒ <code>String</code>

<a name="StructureType+toObject"></a>

### structureType.toObject() ⇒ <code>Object</code>
**Kind**: instance method of [<code>StructureType</code>](#StructureType)  
**Returns**: <code>Object</code> - new object containing same key-value pairs of this instance  
<a name="StructureType+toSignatureRequest"></a>

### structureType.toSignatureRequest() ⇒ <code>Object</code>
Encode this object along with its type and domain as a full EIP712 
signature request, defining the types, domain, primaryType, and message
to be signed.  The output is suitable for use with web3.eth.signTypedData

**Kind**: instance method of [<code>StructureType</code>](#StructureType)  
**Returns**: <code>Object</code> - the signature request encoding of this instance  
<a name="StructureType+encodeData"></a>

### structureType.encodeData() ⇒ <code>String</code>
**Kind**: instance method of [<code>StructureType</code>](#StructureType)  
**Returns**: <code>String</code> - the encoded data of this instance, ready for use with hashStruct  
<a name="StructureType+encode"></a>

### structureType.encode() ⇒ <code>String</code>
ABI encode this type according to the EIP712 spec. The encoding returned
is compatible with solidity, and ready to be hashed and signed.

**Kind**: instance method of [<code>StructureType</code>](#StructureType)  
**Returns**: <code>String</code> - The abi encoding of this instance, in an appropriate format to be hashed and signed  
<a name="StructureType+signHash"></a>

### structureType.signHash() ⇒ <code>String</code>
Return the hash to be signed, simply the Keccak256 of the encoding

**Kind**: instance method of [<code>StructureType</code>](#StructureType)  
**Returns**: <code>String</code> - The hash, ready to be signed  
<a name="StructureType+sign"></a>

### structureType.sign(signer) ⇒ <code>String</code>
Sign the fully encoded version of the current instance with a provided
signer.  This is equivalent to the `web3.eth.signTypedData` function.

**Kind**: instance method of [<code>StructureType</code>](#StructureType)  
**Returns**: <code>String</code> - the signed, encoded piece of data  

| Param | Type | Description |
| --- | --- | --- |
| signer | <code>Object</code> | The signer function, which takes a buffer and return a signature |

<a name="StructureType+verifySignature"></a>

### structureType.verifySignature(signature, address) ⇒ <code>Boolean</code>
Verify a signature made by an address over this object

**Kind**: instance method of [<code>StructureType</code>](#StructureType)  
**Returns**: <code>Boolean</code> - whether the given signature is valid over this object  

| Param | Type |
| --- | --- |
| signature | <code>Object</code> | 
| address | <code>String</code> | 

<a name="StructureType.encodeDependentTypes"></a>

### StructureType.encodeDependentTypes() ⇒ <code>String</code>
**Kind**: static method of [<code>StructureType</code>](#StructureType)  
**Returns**: <code>String</code> - A string encoding all types upon which this type depends  
<a name="validate"></a>

## validate
Validation functions for unifying javascript representations of solidity types

**Kind**: global constant  
<a name="encodeTypeFragment"></a>

## encodeTypeFragment() ⇒ <code>String</code>
**Kind**: global function  
<a name="encodeDependentTypes"></a>

## encodeDependentTypes()
**Kind**: global function  
<a name="encodeType"></a>

## encodeType() ⇒ <code>String</code>
**Kind**: global function  
**Returns**: <code>String</code> - The full encoding of the type, including all dependent types (if applicable)  
<a name="typeHash"></a>

## typeHash() ⇒ <code>String</code>
**Kind**: global function  
**Returns**: <code>String</code> - the typeHash of this type  
<a name="typeDef"></a>

## typeDef() ⇒ <code>Array.&lt;Object&gt;</code>
**Kind**: global function  
<a name="hashStruct"></a>

## hashStruct() ⇒ <code>String</code>
Calculate the EIP712 hash for this object according to the specification

**Kind**: global function  
**Returns**: <code>String</code> - the keccak256 hash of the concatenation of the typeHash,
                  and the encoded data of this instance  
<a name="encodeData"></a>

## *encodeData()*
**Kind**: global abstract function  
<a name="toObject"></a>

## *toObject()*
**Kind**: global abstract function  
<a name="validateTypeDefinition"></a>

## validateTypeDefinition(item, domain)
Check the validity of a particular name/type pair within a given domain,
and return an object containing the name and type.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>Object</code> | the item being validated, must contain `name` and `type` keys |
| domain | <code>Object</code> | the domain in which the item should be validated |

<a name="findDependencies"></a>

## findDependencies(props, domain, found)
Recursively search a list of properties to uncover a list of all dependent types
Each non-primitive type delegates to the dependencies of that type

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>Array.&lt;Object&gt;</code> | The properties of a particular |
| domain | <code>Object</code> \| [<code>Domain</code>](#Domain) | The domain object in which the dependencies are being resolved |
| found | <code>Array.&lt;String&gt;</code> | A list of structure type names found so far |

<a name="isArrayType"></a>

## isArrayType(type) ⇒ <code>Boolean</code>
Return true if the argument is an array type

**Kind**: global function  

| Param | Type |
| --- | --- |
| type | <code>String</code> | 

<a name="getElementaryType"></a>

## getElementaryType(type) ⇒ <code>String</code>
Return the type

**Kind**: global function  

| Param | Type |
| --- | --- |
| type | <code>String</code> | 

<a name="isAtomicType"></a>

## isAtomicType(type) ⇒ <code>Boolean</code>
Return true if the argument is an atomic type in the EIP712 schema

**Kind**: global function  

| Param | Type |
| --- | --- |
| type | <code>String</code> | 

<a name="isDynamicType"></a>

## isDynamicType(type) ⇒ <code>Boolean</code>
Return true if the argument is the name of a dynamic type in the EIP712 schema

**Kind**: global function  

| Param | Type |
| --- | --- |
| type | <code>String</code> | 

<a name="isPrimitiveType"></a>

## isPrimitiveType(type) ⇒ <code>Boolean</code>
Determine if the argument is a EIP712 primitive type, i.e. a dynamic or atomic type

**Kind**: global function  

| Param | Type |
| --- | --- |
| type | <code>String</code> | 

<a name="verify"></a>

## verify()
Verify that a particular object was signed by a given

**Kind**: global function  
<a name="verifyRawSignatureFromAddress"></a>

## verifyRawSignatureFromAddress(data, signature, address) ⇒ <code>Boolean</code>
Verify a signed hash made by the owner of a particular ethereum address
returning true if the signature is valid, and false otherwise

**Kind**: global function  
**Returns**: <code>Boolean</code> - indicator of the signature's validity  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Buffer</code> | qq |
| signature | <code>Object</code> |  |
| address | <code>String</code> |  |

<a name="toEthereumAddress"></a>

## toEthereumAddress(hexPublicKey) ⇒ <code>String</code>
Convert a hex encoded secp256k1 public key to the equivalent ethereum address

**Kind**: global function  
**Returns**: <code>String</code> - address of account with given public key  

| Param | Type |
| --- | --- |
| hexPublicKey | <code>String</code> | 

<a name="normalizeSignature"></a>

## normalizeSignature(sig) ⇒ <code>Object</code>
Convert a string, or buffer signature to an object containing
the three signature parameters r, s, v

**Kind**: global function  
**Returns**: <code>Object</code> - A normalized signature object, containing strings r,s,v  

| Param | Type |
| --- | --- |
| sig | <code>String</code> \| <code>Object</code> | 

