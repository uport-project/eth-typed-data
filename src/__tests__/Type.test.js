
import Type from '../Type'

describe('Type [factory]', () => {
  it('Creates a new instantiable class with no properties', () => {
    const Empty = Type.call({ types: {} }, 'Empty', [])
    
    expect(Empty.hasOwnProperty('properties')).toBe(true)
    expect(Empty.hasOwnProperty('dependencies')).toBe(true)
    expect(Empty.hasOwnProperty('name')).toBe(true)

    expect(() => new Empty({})).not.toThrow()
  })
})