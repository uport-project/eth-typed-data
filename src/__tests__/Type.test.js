
const util = require('ethereumjs-util')

import Type from '../Type'
import { EIP712Domain } from '..';

describe('Type [factory]', () => {
  let Domain
  beforeAll(() => {
    Domain = new EIP712Domain({
      name: 'Test Domain',
      version: '1.0', 
      chainId: 0x01,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      salt: 'salt'
    })
  })

  it('Creates a new instantiable class with no properties', () => {
    const Empty = Domain.createType('Empty', [])
    
    expect(Empty.hasOwnProperty('properties')).toBe(true)
    expect(Empty.hasOwnProperty('dependencies')).toBe(true)
    expect(Empty.hasOwnProperty('name')).toBe(true)

    expect(() => new Empty({})).not.toThrow()
  })

  it('Encodes itself including dependent types', () => {
    Domain.createType('Test', {test: 'string'})
    const Nest = Domain.createType('Nest', {nest: 'Test', more: 'string'})

    expect(Nest.encodeType()).toEqual('Nest(Test nest,string more)Test(string test)')
  })

  it('Throws error if type definition is invalid', () => {
    const bad1 = [{name: 'hello'}, {name: 'goodbye', type: 'string'}]
    const bad2 = [{name: 'hello', type: 'Missing'}]
    const bad3 = [{name: 'hello', type: [{name: 'nested', type: 'string'}]}]
    expect(() => Domain.createType('Bad', bad1)).toThrow()
    expect(() => Domain.createType('Bad', bad2)).toThrow()
    expect(() => Domain.createType('Bad', bad3)).toThrow()
  })
})


describe('MailExample', () => {
  // The provided example from the EIP712 PR
  const MailExample = require('./data/Mail.json')
  const { 
    Person: personDef, 
    Mail: mailDef, 
  } = MailExample.request.types
  const {
    encodeType, typeHash, encodeData, hashStruct, signHash
  } = MailExample.results.Mail

  let Domain, Person, Mail, message
  beforeAll(() => {
    // Build domain
    Domain = new EIP712Domain(MailExample.request.domain)
    // Build type constructors
    Person = Domain.createType('Person', personDef)
    Mail = Domain.createType('Mail', mailDef)
    // Build an instance of mail to test
    message = new Mail(MailExample.request.message)
  })

  test('domainSeparator', () => {
    expect(util.bufferToHex(Domain.domainSeparator)).toEqual(MailExample.results.domainSeparator)
  })

  test('toSignatureRequest', () => {
    expect(message.toSignatureRequest()).toEqual(MailExample.request)
  })

  test('toObject', () => {
    expect(message.toObject()).toEqual(MailExample.request.message)
  })

  test('encodeType', () => {
    expect(Mail.encodeType()).toEqual(encodeType)
  })

  test('typeHash', () => {
    expect(util.bufferToHex(Mail.typeHash())).toEqual(typeHash)
  })

  test('encodeData', () => {
    expect(util.bufferToHex(message.encodeData())).toEqual(encodeData)
  })

  test('hashStruct', () => {
    expect(util.bufferToHex(message.hashStruct())).toEqual(hashStruct)
  })

  test('signHash', () => {
    expect(util.bufferToHex(message.signHash())).toEqual(signHash)
  })
})

// Add more examples with different data structures here:
// TODO