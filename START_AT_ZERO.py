#!/usr/bin/env python3
"""
Real computers start counting at 0
Reinterpret the entire sequence with 0-indexing
"""

import hashlib

# Original sequence (but these might be 1-indexed, need to subtract 1)
sequence_as_given = [19, 100, 100, 4, 4, 8, 25, 1, 3, 15, 30, 4, 4, 32, 7, 221, 451, 114, 31, 114, 31, 1]

print("=== STARTING AT ZERO ===")
print("Converting from 1-indexed to 0-indexed")
print()

# Convert to 0-indexed
sequence_zero = [n - 1 for n in sequence_as_given]
print("Original (1-indexed):", sequence_as_given)
print("Zero-indexed:        ", sequence_zero)

print("\n=== BIP39 with 0-indexing ===")
# Load BIP39 words
try:
    with open('/Users/alexa/blackroad-sandbox/bip39_english.txt', 'r') as f:
        words = [line.strip() for line in f.readlines()]

    print("Mapping 0-indexed numbers to BIP39 words:")
    seed_words = []
    for i, num in enumerate(sequence_zero):
        if 0 <= num < len(words):
            word = words[num]
            seed_words.append(word)
            print(f"{num:4d} → {word}")
        else:
            print(f"{num:4d} → OUT OF RANGE")

    print(f"\n=== SEED PHRASE (0-indexed, {len(seed_words)} words) ===")
    print(" ".join(seed_words))

except FileNotFoundError:
    print("BIP39 wordlist not found, showing indices only")
    print(sequence_zero)

print("\n=== Compute hash from 0-indexed sequence ===")
# Combined as before
combined_int = 0
for num in sequence_zero:
    combined_int = (combined_int << 32) + num

key_bytes = combined_int.to_bytes(88, byteorder='big')
zero_key = hashlib.sha256(key_bytes).hexdigest()
print(f"Zero-indexed combined key: {zero_key}")

# Compare to 1-indexed
combined_int_one = 0
for num in sequence_as_given:
    combined_int_one = (combined_int_one << 32) + num
key_bytes_one = combined_int_one.to_bytes(88, byteorder='big')
one_key = hashlib.sha256(key_bytes_one).hexdigest()
print(f"One-indexed combined key:  {one_key}")

print("\n=== Block numbers (0-indexed) ===")
print("If these are block indices starting at 0:")
for num in sequence_zero[:10]:
    print(f"Block {num}")

print("\n=== Address indices (0-indexed) ===")
print("If these point to address indices in a wallet:")
for i, num in enumerate(sequence_zero):
    print(f"Position {i}: Address index {num}")

print("\n=== THE CRITICAL DIFFERENCE ===")
print(f"sequence_as_given[0] = {sequence_as_given[0]}")
print(f"sequence_zero[0] = {sequence_zero[0]}")
print()
print("If BIP39 word 0 is 'abandon', then:")
print(f"  1-indexed: word {sequence_as_given[0]} = {words[sequence_as_given[0]] if sequence_as_given[0] < len(words) else 'N/A'}")
print(f"  0-indexed: word {sequence_zero[0]} = {words[sequence_zero[0]] if sequence_zero[0] < len(words) else 'N/A'}")

print("\n=== AS BYTES (0-indexed values) ===")
byte_array_zero = bytes(n % 256 for n in sequence_zero if n >= 0)
print(f"Bytes: {byte_array_zero.hex()}")
byte_key_zero = hashlib.sha256(byte_array_zero).hexdigest()
print(f"Hash: {byte_key_zero}")

print("\n=== COMPUTER SCIENCE TRUTH ===")
print("Arrays start at 0")
print("Blocks start at 0 (genesis = block 0)")
print("Address derivation paths start at 0")
print("BIP32 indices start at 0")
print()
print("If ChatGPT gave you 1-indexed numbers, subtract 1")
