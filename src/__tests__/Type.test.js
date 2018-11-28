
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
    const Person = Domain.createType({})
  })
})