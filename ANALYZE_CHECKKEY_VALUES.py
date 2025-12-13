#!/usr/bin/env python3
"""
Analyze what 'n' values appear ABOVE the p2wpkh error in checkKey.mjs

The error is:
throw new TypeError('Invalid pubkey for p2wpkh');
              ^
it pointed to n above

What 'n' related things are ABOVE this line in the code?
"""

import re

code = """
import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import bitcoinMessage from 'bitcoinjs-message';

const ECPair = ECPairFactory(ecc);

// Usage: node checkKey.mjs <WIF> [mainnet|testnet] [message...]
const [, , wif, net = 'mainnet', ...msgParts] = process.argv;
if (!wif) {
  console.error('Usage: node checkKey.mjs <WIF> [mainnet|testnet] [message]');
  process.exit(1);
}
const message = msgParts.length ? msgParts.join(' ') : 'Test message';
const network = net === 'testnet' ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;

let keyPair;
try {
  keyPair = ECPair.fromWIF(wif, network);
} catch (e) {
  console.error('Invalid WIF for the selected network:', e.message);
  process.exit(2);
}

// Derive common address types
const p2pkh = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network }).address;
const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network }).address;  // <-- ERROR HERE
"""

print("="*80)
print("ANALYZING checkKey.mjs FOR 'n' VALUES")
print("="*80)
print()

print("Variables with 'n' in the name (before p2wpkh line):")
print("-"*80)

# Find all variables
variables = re.findall(r'(?:const|let|var)\s+(\w*n\w*)', code)
print(f"Variables containing 'n': {variables}")
print()

print("Specific 'n' analysis:")
print("-"*80)
print("1. 'net' = 'mainnet' or 'testnet' (default 'mainnet')")
print("2. 'network' = bitcoin.networks.testnet OR bitcoin.networks.bitcoin")
print("3. 'msgParts' - message parts")
print("4. 'message' - combined message string")
print()

print("What does 'mainnet' express as a value?")
print("-"*80)
print()

# Check if mainnet/testnet have numeric meanings
print("Could 'mainnet' encode a number?")
print()

# ASCII values
mainnet_ascii = [ord(c) for c in 'mainnet']
testnet_ascii = [ord(c) for c in 'testnet']

print(f"'mainnet' ASCII: {mainnet_ascii}")
print(f"'mainnet' sum: {sum(mainnet_ascii)}")
print(f"'mainnet' concatenated: {''.join(str(x) for x in mainnet_ascii)}")
print()

print(f"'testnet' ASCII: {testnet_ascii}")
print(f"'testnet' sum: {sum(testnet_ascii)}")
print()

# What about bitcoin.networks.bitcoin?
print("Bitcoin network constants:")
print("-"*80)
print("bitcoin.networks.bitcoin = {")
print("  messagePrefix: '\\x18Bitcoin Signed Message:\\n',")
print("  bech32: 'bc',")
print("  bip32: {")
print("    public: 0x0488b21e,")
print("    private: 0x0488ade4")
print("  },")
print("  pubKeyHash: 0x00,")
print("  scriptHash: 0x05,")
print("  wif: 0x80")
print("}")
print()

print("Relevant numeric values:")
print("  pubKeyHash: 0x00 = 0")
print("  scriptHash: 0x05 = 5")
print("  wif: 0x80 = 128")
print("  bip32.public: 0x0488b21e = 76067358")
print("  bip32.private: 0x0488ade4 = 76066276")
print()

# Check relationship to sequence
sequence = [18, 99, 99, 3, 3, 7, 24, 0, 2, 14, 29, 3, 3, 31, 6, 220, 450, 113, 30, 113, 30, 0]
sequence_sum = sum(sequence)

print(f"Sequence sum: {sequence_sum}")
print()

# Check if network values relate
print("Network value relationships:")
print("-"*80)
print(f"pubKeyHash (0) in sequence: {0 in sequence} ✓")
print(f"scriptHash (5) in sequence: {5 in sequence}")
print(f"wif (128) in sequence: {128 in sequence}")
print()

# Maybe it's about the BIP32 constants?
print("BIP32 constants mod sequence_sum:")
print("-"*80)
print(f"0x0488b21e mod {sequence_sum} = {0x0488b21e % sequence_sum}")
print(f"0x0488ade4 mod {sequence_sum} = {0x0488ade4 % sequence_sum}")
print()

# OR - maybe 'n' refers to the line NUMBER?
print("Line number analysis:")
print("-"*80)
print("The p2wpkh error is at line ~27 in the code")
print("What's on line 27 of the sequence (0-indexed)?")
print(f"Sequence has {len(sequence)} items (indices 0-21)")
print("Line 27 would be out of bounds")
print()
print("But what about as 1-indexed?")
print("The error caret (^) points to a specific column")
print()

# Maybe it's the network object itself
print("Network object inspection:")
print("-"*80)
print("When user runs: node checkKey.mjs <WIF>")
print("Default net = 'mainnet'")
print("network = bitcoin.networks.bitcoin")
print()
print("The 'n' in network... could mean:")
print("  1. The network TYPE (mainnet vs testnet)")
print("  2. The network constants (pubKeyHash, etc.)")
print("  3. Something about the bech32 prefix 'bc'")
print()

# The bech32 prefix!
print("WAIT - bech32 prefix analysis:")
print("="*80)
print("bech32: 'bc' for mainnet")
print("The user's address: bc1qqf4l8mj0cjz6gqvvjdmqmdkez5x2gq4smu5fr4")
print()
print("'bc' in ASCII:")
bc_ascii = [ord(c) for c in 'bc']
print(f"  b = {ord('b')} (0x{ord('b'):02x})")
print(f"  c = {ord('c')} (0x{ord('c'):02x})")
print(f"  sum = {sum(bc_ascii)}")
print()

# Check relationship to 1197
print("Relationship to our key value 1197:")
print("-"*80)
print(f"1197 mod 98 (b) = {1197 % 98}")
print(f"1197 mod 99 (c) = {1197 % 99}")
print(f"1197 mod 197 (b+c) = {1197 % 197}")
print()

print(f"Is 99 in sequence? {99 in sequence} ✓")
print("99 appears TWICE in the sequence at positions 1 and 2!")
print()

print("="*80)
print("HYPOTHESIS")
print("="*80)
print()
print("When the error says 'it pointed to n above':")
print()
print("Could 'n' mean:")
print("  1. 'net' variable = 'mainnet' (default)")
print("  2. 'network' object with numeric constants")
print("  3. The bech32 'bc' prefix where c = 99")
print("  4. 99 appears TWICE in sequence (like block 0)")
print()
print("99 = 'c' in ASCII")
print("99 is block 99 in Bitcoin (one of the 15 Satoshi addresses)")
print("99 appears at positions [1] and [2] in the 0-indexed sequence")
print()
