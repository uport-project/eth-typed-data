import { keccak256 } from 'js-sha3'

export const simple = [{
  name: 'key1',
  type: 'string'
}, {
  name: 'key2',
  type: 'uint8'
}, {
  name: 'key3',
  type: 'address'
}]

export const simpleObj = {
  key1: 'string',
  key2: 'uint8',
  key3: 'address'
}

export const simpleTypeEncoded = 'Simple(string key1, uint8 key2, address key3)'
export const simpleTypeHash = keccak256(simpleTypeEncoded)

export const mail = {
  types: {
      EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
      ],
      Person: [
          { name: 'name', type: 'string' },
          { name: 'wallet', type: 'address' }
      ],
      Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' }
      ],
  },
  primaryType: 'Mail',
  domain: {
      name: 'Ether Mail',
      version: '1',
      chainId: 1,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  },
  message: {
      from: {
          name: 'Cow',
          wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
      },
      to: {
          name: 'Bob',
          wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      },
      contents: 'Hello, Bob!',
  },
};