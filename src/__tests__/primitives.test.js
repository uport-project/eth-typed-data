import { isPrimitiveType, isAtomicType, isDynamicType } from '../primitives'

const POWERS = [1, 2, 4, 8, 16, 32]

describe('type indicators', () => {
  it('identifies atomic types', () => {
    for (const p of POWERS) {
      expect(isAtomicType(`bytes${p}`)).toBe(true)
      expect(isAtomicType(`int${8*p}`)).toBe(true)
      expect(isAtomicType(`uint${8*p}`)).toBe(true)
    }

    expect(isAtomicType('address')).toBe(true)
    expect(isAtomicType('bool')).toBe(true)

    expect(isAtomicType('string')).toBe(false)
    expect(isAtomicType('bytes')).toBe(false)
    
  })
  
  it('identifies dynamic types', () => {
    expect(isDynamicType('string')).toBe(true)
    expect(isDynamicType('bytes')).toBe(true)

    for (const p of POWERS) {
      expect(isDynamicType(`bytes${p}`)).toBe(false)
      expect(isDynamicType(`int${8*p}`)).toBe(false)
      expect(isDynamicType(`uint${8*p}`)).toBe(false)
    }

    expect(isDynamicType('address')).toBe(false)
    expect(isDynamicType('bool')).toBe(false)
  })

  it('identifies primitive types', () => {
    for (const p of POWERS) {
      expect(isPrimitiveType(`bytes${p}`)).toBe(true)
      expect(isPrimitiveType(`int${8*p}`)).toBe(true)
      expect(isPrimitiveType(`uint${8*p}`)).toBe(true)
    }
    
    expect(isPrimitiveType('address')).toBe(true)
    expect(isPrimitiveType('bool')).toBe(true)
    expect(isPrimitiveType('string')).toBe(true)
    expect(isPrimitiveType('bytes')).toBe(true)

    expect(isPrimitiveType('EIP712Domain')).toBe(false)
  })
})

describe.skip('validate', () => {
  it('', () => {

  })
})