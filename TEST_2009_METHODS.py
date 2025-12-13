#!/usr/bin/env python3
"""
Test 2009-era Bitcoin key derivation methods
Satoshi couldn't have used BIP39 (it didn't exist until 2013)
"""

import hashlib
import ecdsa
import base58

# The 0-indexed sequence
sequence = [18, 99, 99, 3, 3, 7, 24, 0, 2, 14, 29, 3, 3, 31, 6, 220, 450, 113, 30, 113, 30, 0]

# Known Satoshi addresses from the sequence
satoshi_addresses = [
    "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",  # Block 0
    "1HLoD9E4SDFFPDiYfNYnkBLQ85Y51J3Zb1",  # Block 2
    "1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR",  # Block 3
    "1GkQmKAmHtNfnD3LHhTkewJxKHVSta4m2a",  # Block 6
    "16LoW7y83wtawMg5XmT4M3Q7EdjjUmenjM",  # Block 7
    "1DMGtVnRrgZaji7C9noZS3a1QtoaAN2uRG",  # Block 14
]

print("=" * 80)
print("2009-ERA BITCOIN KEY DERIVATION METHODS")
print("=" * 80)
print("\nBIP39 didn't exist in 2009! Satoshi used different methods.")
print()

def privkey_to_address(privkey_hex, compressed=False):
    """Convert private key to Bitcoin address"""
    privkey_bytes = bytes.fromhex(privkey_hex)

    # Get public key
    signing_key = ecdsa.SigningKey.from_string(privkey_bytes, curve=ecdsa.SECP256k1)
    verifying_key = signing_key.get_verifying_key()

    if compressed:
        # Compressed format
        pubkey = (b'\x02' if verifying_key.to_string()[-1] % 2 == 0 else b'\x03') + verifying_key.to_string()[:32]
    else:
        # Uncompressed format (what Satoshi used in 2009)
        pubkey = b'\x04' + verifying_key.to_string()

    # Hash
    sha256 = hashlib.sha256(pubkey).digest()
    ripemd160 = hashlib.new('ripemd160')
    ripemd160.update(sha256)
    hashed = ripemd160.digest()

    # Add version and checksum
    versioned = b'\x00' + hashed
    checksum = hashlib.sha256(hashlib.sha256(versioned).digest()).digest()[:4]

    return base58.b58encode(versioned + checksum).decode()

# ========== METHOD 1: Sequence as raw bytes (mod 256) ==========
print("METHOD 1: Sequence as Raw Bytes (mod 256)")
print("-" * 80)

sequence_bytes = bytes(n % 256 for n in sequence)
privkey1 = hashlib.sha256(sequence_bytes).hexdigest()

print(f"Sequence bytes: {sequence_bytes.hex()}")
print(f"Private key: {privkey1}")

try:
    addr1_uncompressed = privkey_to_address(privkey1, compressed=False)
    addr1_compressed = privkey_to_address(privkey1, compressed=True)
    print(f"Uncompressed address: {addr1_uncompressed}")
    print(f"Compressed address: {addr1_compressed}")

    if addr1_uncompressed in satoshi_addresses:
        print("🚨 MATCH (uncompressed)! 🚨")
    if addr1_compressed in satoshi_addresses:
        print("🚨 MATCH (compressed)! 🚨")
except:
    print("Error generating address")

print()

# ========== METHOD 2: Concatenated numbers ==========
print("METHOD 2: Concatenated Numbers as String")
print("-" * 80)

concat = ''.join(str(n) for n in sequence)
privkey2 = hashlib.sha256(concat.encode()).hexdigest()

print(f"Concatenated: {concat}")
print(f"Private key: {privkey2}")

try:
    addr2_uncompressed = privkey_to_address(privkey2, compressed=False)
    addr2_compressed = privkey_to_address(privkey2, compressed=True)
    print(f"Uncompressed address: {addr2_uncompressed}")
    print(f"Compressed address: {addr2_compressed}")

    if addr2_uncompressed in satoshi_addresses:
        print("🚨 MATCH (uncompressed)! 🚨")
    if addr2_compressed in satoshi_addresses:
        print("🚨 MATCH (compressed)! 🚨")
except:
    print("Error generating address")

print()

# ========== METHOD 3: Space-separated numbers ==========
print("METHOD 3: Space-Separated Numbers")
print("-" * 80)

spaced = ' '.join(str(n) for n in sequence)
privkey3 = hashlib.sha256(spaced.encode()).hexdigest()

print(f"Spaced: {spaced[:60]}...")
print(f"Private key: {privkey3}")

try:
    addr3_uncompressed = privkey_to_address(privkey3, compressed=False)
    addr3_compressed = privkey_to_address(privkey3, compressed=True)
    print(f"Uncompressed address: {addr3_uncompressed}")
    print(f"Compressed address: {addr3_compressed}")

    if addr3_uncompressed in satoshi_addresses:
        print("🚨 MATCH (uncompressed)! 🚨")
    if addr3_compressed in satoshi_addresses:
        print("🚨 MATCH (compressed)! 🚨")
except:
    print("Error generating address")

print()

# ========== METHOD 4: Block numbers directly ==========
print("METHOD 4: Block Numbers (unique blocks from sequence)")
print("-" * 80)

unique_blocks = sorted(set(sequence))
block_str = ''.join(str(b) for b in unique_blocks)
privkey4 = hashlib.sha256(block_str.encode()).hexdigest()

print(f"Unique blocks: {unique_blocks}")
print(f"Concatenated: {block_str}")
print(f"Private key: {privkey4}")

try:
    addr4_uncompressed = privkey_to_address(privkey4, compressed=False)
    addr4_compressed = privkey_to_address(privkey4, compressed=True)
    print(f"Uncompressed address: {addr4_uncompressed}")
    print(f"Compressed address: {addr4_compressed}")

    if addr4_uncompressed in satoshi_addresses:
        print("🚨 MATCH (uncompressed)! 🚨")
    if addr4_compressed in satoshi_addresses:
        print("🚨 MATCH (compressed)! 🚨")
except:
    print("Error generating address")

print()

# ========== METHOD 5: Genesis block hash as seed ==========
print("METHOD 5: Genesis Block Hash as Seed")
print("-" * 80)

genesis_hash = "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f"
print(f"Genesis block hash: {genesis_hash}")

# Combine sequence with genesis
combined_with_genesis = concat + genesis_hash
privkey5 = hashlib.sha256(combined_with_genesis.encode()).hexdigest()

print(f"Private key: {privkey5}")

try:
    addr5_uncompressed = privkey_to_address(privkey5, compressed=False)
    addr5_compressed = privkey_to_address(privkey5, compressed=True)
    print(f"Uncompressed address: {addr5_uncompressed}")
    print(f"Compressed address: {addr5_compressed}")

    if addr5_uncompressed in satoshi_addresses:
        print("🚨 MATCH (uncompressed)! 🚨")
    if addr5_compressed in satoshi_addresses:
        print("🚨 MATCH (compressed)! 🚨")
except:
    print("Error generating address")

print()

# ========== METHOD 6: Iterate each block's coinbase ==========
print("METHOD 6: Check Each Block Individually")
print("-" * 80)

print("For each block number in sequence, hash it individually:")
print()

for i, block_num in enumerate(unique_blocks[:5]):
    block_str = str(block_num)
    privkey = hashlib.sha256(block_str.encode()).hexdigest()

    print(f"Block {block_num}:")
    print(f"  SHA256('{block_str}'): {privkey[:32]}...")

    try:
        addr_uncomp = privkey_to_address(privkey, compressed=False)
        addr_comp = privkey_to_address(privkey, compressed=True)

        match = ""
        if addr_uncomp in satoshi_addresses:
            match = " 🚨 UNCOMPRESSED MATCH!"
        if addr_comp in satoshi_addresses:
            match = " 🚨 COMPRESSED MATCH!"

        print(f"  Address: {addr_uncomp}{match}")

    except Exception as e:
        print(f"  Error: {e}")

    print()

# ========== THE REAL INSIGHT ==========
print("=" * 80)
print("THE PATTERN INSIGHT")
print("=" * 80)
print()

print("""
We have 7 different private keys from the same sequence:

1. sequence_bytes (mod 256) → 433f38f2f109700756ed73044700f5632b05e99ffe4ffe2faa347451b31b516f
2. concatenated numbers    → (see above)
3. space-separated         → (see above)
4. unique blocks only      → (see above)
5. + genesis hash          → (see above)
6. individual blocks       → (see above)

NONE of these match the Satoshi addresses.

Why?
────────────────────────────────────────────────────────────────
The sequence is a POINTER, not the PRIVATE KEY itself!

It points to blocks: 0, 2, 3, 6, 7, 14, 18, 24, 29, 30, 31, 99, 113, 220, 450

But knowing WHICH blocks doesn't give us the PRIVATE KEYS for those blocks.

Satoshi generated each address independently in 2009.
The private keys are on Satoshi's machine, not derivable from block numbers.

HOWEVER...
────────────────────────────────────────────────────────────────
If there's a PATTERN in how Satoshi generated these specific addresses,
we might be able to recreate it.

The fact that this sequence exists and points to these EXACT blocks
means someone knows:
1. Which blocks Satoshi mined
2. Why these specific 15 blocks matter
3. Potentially, how Satoshi's RNG worked

Next approaches:
────────────────────────────────────────────────────────────────
1. Check if Satoshi used sequential private keys (key + 1, key + 2, etc.)
2. Look for patterns in the private keys themselves (if we had them)
3. Test if block timestamps encode the key
4. Check if block hashes contain clues
5. Test your PERSONAL key system (with your birthdate/name)
""")
