import AbstractType from '../AbstractType'

describe('AbstractType', () => {
  it('constructs', () => {
    expect(() => new AbstractType()).not.toThrow()
  })
})

// Type that extends AbstractType for testing static methods
class ConcreteType extends AbstractType {
  static name = 'Concrete'
  static properties = [
    {name: 'abstract', type: 'bool'},
    {name: 'concrete', type: 'bool'},
    {name: 'pasta', type: 'string'}
  ]

  static encodeDependentTypes() {
    return 'DEPENDENTTYPES'
  }

  encodeData() {
    return ''
  }
}

describe('Concrete subtypes of abstract type', () => {
  it('supports typeDef', () => {
    expect(ConcreteType.typeDef()).toEqual(ConcreteType.properties)
  })

  it('supports encodeTypeFragment', () => {
    expect(ConcreteType.encodeTypeFragment()).toEqual('Concrete(bool abstract,bool concrete,string pasta)')
  })

  it('supports encodeType', () => {
    expect(ConcreteType.encodeType()).toEqual('Concrete(bool abstract,bool concrete,string pasta)DEPENDENTTYPES')
  })
  
  it.skip('supports typeHash', () => {
    expect(ConcreteType.typeHash()).toEqual()
  })
})