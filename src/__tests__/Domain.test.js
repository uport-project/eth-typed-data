import EIP712Domain, { EIP712DomainProperties } from '../Domain';

const domainDef = {
  name: 'Test Domain',
  version: '1.0', 
  chainId: 0x01,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  salt: 'salt'
}

const miniDomain = {
  name: 'Mini Domain',
  version: '1.0'
}

describe('EIP712Domain', () => {
  it('creates a domain with all domain properties', () => {
    expect(() => new EIP712Domain(domainDef)).not.toThrow()
  })

  it('creates a domain with a subset of allowed properties', () => {
    expect(() => new EIP712Domain(miniDomain)).not.toThrow()
  })

  it('throws an error if no properties are provided', () =>  {
    expect(() => new EIP712Domain({})).toThrow()
  })

  it('throws an error if extra properties are provided', () => {
    expect(() => new EIP712Domain({extra: 'property', ...domainDef})).toThrow()
  })

  it('precalculates the domainSeparator', () => {
    const domain = new EIP712Domain(domainDef)
    expect(domain.domainSeparator).toEqual(domain.hashStruct())
  })
})

describe('toDomainDef', () => {
  it('lists itself if there are no other types', () => {
    const domain = new EIP712Domain(domainDef)
    expect(domain.toDomainDef()).toEqual({EIP712Domain: EIP712DomainProperties})
  })

  it('includes other types when present', () => {
    const domain = new EIP712Domain(domainDef)
    const T = domain.createType('T', { property: 'string' })
    expect(domain.toDomainDef()[T.name]).toEqual(T.typeDef())
  })
})

describe('toObject', () => {
  it('matches the provided values', () => {
    const domain = new EIP712Domain(domainDef)
    expect(domain.toObject()).toEqual(domainDef)
  })
})

describe('Types in the Domain', () => {
  it('Creates a valid signature request', () => {

  })


})