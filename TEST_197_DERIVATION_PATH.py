#!/usr/bin/env python3
"""
Use 197 as derivation index/path

197 = 'bc' bech32 prefix
1197 mod 197 = 15 (number of addresses)

Maybe the sequence maps to BIP32 path m/197/i where i is from sequence?
"""

import hashlib
import hmac
import ecdsa
import base58

satoshi_addresses = [
    "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",  # Block 0
    "1HLoD9E4SDFFPDiYfNYnkBLQ85Y51J3Zb1",  # Block 2
    "1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR",  # Block 3
    "1GkQmKAmHtNfnD3LHhTkewJxKHVSta4m2a",  # Block 6
    "16LoW7y83wtawMg5XmT4M3Q7EdjjUmenjM",  # Block 7
    "1DMGtVnRrgZaji7C9noZS3a1QtoaAN2uRG",  # Block 14
    "1DJkjSqW9cX9XWdU71WX3Aw6s6Mk4C3TtN",  # Block 18
    "1JXLFv719ec3bzTXaSq7vqRFS634LErtJu",  # Block 24
    "1GnYgH4V4kHdYEdHwAczRHXwqxdY7xars1",  # Block 29
    "17x23dNjXJLzGMev6R63uyRhMWP1VHawKc",  # Block 30
    "1PHB5i7JMEZCKvcjYSQXPbi5oSK8DoJucS",  # Block 31
    "16cAVR3SQbNzu8KZtGdo8cG1iueWpcngxz",  # Block 99
    "19K4cNVYVyNiwZ5xkzjW9ZtMb8XvBS2LkT",  # Block 113
    "1MUuVeuS6DDS5QKR2BNZ9fipXCEsFujaMH",  # Block 220
    "1LfjLrBDYyPbvGMiD9jURxyAupdYujsBdK",  # Block 450
]

sequence = [18, 99, 99, 3, 3, 7, 24, 0, 2, 14, 29, 3, 3, 31, 6, 220, 450, 113, 30, 113, 30, 0]
unique_blocks = [0, 2, 3, 6, 7, 14, 18, 24, 29, 30, 31, 99, 113, 220, 450]

SECP256K1_ORDER = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141

def privkey_to_address(privkey_hex):
    """Convert private key to uncompressed Bitcoin address"""
    privkey_bytes = bytes.fromhex(privkey_hex)
    signing_key = ecdsa.SigningKey.from_string(privkey_bytes, curve=ecdsa.SECP256k1)
    verifying_key = signing_key.get_verifying_key()
    pubkey = b'\x04' + verifying_key.to_string()
    sha256 = hashlib.sha256(pubkey).digest()
    ripemd160 = hashlib.new('ripemd160')
    ripemd160.update(sha256)
    hashed = ripemd160.digest()
    versioned = b'\x00' + hashed
    checksum = hashlib.sha256(hashlib.sha256(versioned).digest()).digest()[:4]
    return base58.b58encode(versioned + checksum).decode()

def derive_child_key(parent_key_hex, index, salt="Bitcoin seed"):
    """
    Simplified BIP32-style derivation
    Use HMAC-SHA512 to derive child key
    """
    parent_bytes = bytes.fromhex(parent_key_hex)

    # Create data to hash: parent_key + index
    data = parent_bytes + index.to_bytes(4, byteorder='big')

    # HMAC-SHA512
    hmac_result = hmac.new(salt.encode(), data, hashlib.sha512).digest()

    # Left 32 bytes = child key
    child_key = int.from_bytes(hmac_result[:32], byteorder='big')

    # Make sure it's in valid range
    if child_key >= SECP256K1_ORDER:
        child_key = child_key % SECP256K1_ORDER
    if child_key == 0:
        child_key = 1

    return hex(child_key)[2:].zfill(64)

print("="*80)
print("TESTING 197 AS DERIVATION PATH")
print("="*80)
print()

print("Hypothesis:")
print("-"*80)
print("• 197 = ASCII('bc') - bech32 prefix")
print("• 1197 mod 197 = 15 (number of addresses)")
print("• Maybe use path: m/197/block_number")
print("• Or: master_key derived via 197, then +block offsets")
print()

# ========== METHOD 1: Use 197 as master seed, derive children ==========
print("METHOD 1: Master seed 197, derive children at sequence indices")
print("-"*80)

master_seed = hashlib.sha256("197".encode()).hexdigest()
print(f"Master seed: {master_seed[:32]}...")
print()

matches = []
for i, block_num in enumerate(unique_blocks[:5]):  # Test first 5
    child_key = derive_child_key(master_seed, block_num)

    try:
        address = privkey_to_address(child_key)
        match = ""
        if address in satoshi_addresses:
            match = " 🚨 MATCH!"
            matches.append((block_num, address))

        print(f"Block {block_num:3d} → {address[:20]}...{match}")
    except Exception as e:
        print(f"Block {block_num:3d} → Error: {e}")

print()

# ========== METHOD 2: Use personal key + 197 path ==========
print("METHOD 2: Personal master + derive at 197")
print("-"*80)

LOCALHOST_IP = "127.0.0.1"
PERSONAL_DATE_NUMERIC = 20000327
FULL_NAME = "Alexa Louise Amundson"
TEMPORAL_MINUTES = 109927815

localhost_numeric = LOCALHOST_IP.replace(".", "")
combined_string = (
    str(TEMPORAL_MINUTES) +
    localhost_numeric +
    str(PERSONAL_DATE_NUMERIC) +
    FULL_NAME.replace(" ", "")
)

master_hash = hashlib.sha256(combined_string.encode()).hexdigest()
print(f"Personal master: {master_hash[:32]}...")

# Derive at path 197
child_at_197 = derive_child_key(master_hash, 197)

# Then derive each block from that
print("Deriving blocks from m/197/...")
print()

for i, block_num in enumerate(unique_blocks[:5]):
    child_key = derive_child_key(child_at_197, block_num)

    try:
        address = privkey_to_address(child_key)
        match = ""
        if address in satoshi_addresses:
            match = " 🚨 MATCH!"
            matches.append((block_num, address))

        print(f"m/197/{block_num:3d} → {address[:20]}...{match}")
    except Exception as e:
        print(f"m/197/{block_num:3d} → Error: {e}")

print()

# ========== METHOD 3: Use sequence AS indices into 197-based derivation ==========
print("METHOD 3: Derive 197 addresses, select by sequence")
print("-"*80)

# Generate first 500 addresses from master 197
master_197 = hashlib.sha256("197".encode()).hexdigest()
print("Generating addresses 0-500 from master 197...")
print()

# Generate addresses at the specific block numbers
for block_num in unique_blocks:
    if block_num < 500:
        child_key = derive_child_key(master_197, block_num)

        try:
            address = privkey_to_address(child_key)
            match = ""
            if address in satoshi_addresses:
                match = " 🚨 MATCH!"
                matches.append((block_num, address))
                print(f"Block {block_num:3d}: {address} 🚨 MATCH!")

        except Exception as e:
            pass

print()

# ========== METHOD 4: Use 1197 as master, 197 as salt ==========
print("METHOD 4: Master 1197, salt 197")
print("-"*80)

# HMAC with 197 as salt
for block_num in unique_blocks[:5]:
    data = f"1197.{block_num}".encode()
    hmac_result = hmac.new(b"197", data, hashlib.sha512).digest()
    privkey_int = int.from_bytes(hmac_result[:32], byteorder='big')

    if privkey_int >= SECP256K1_ORDER:
        privkey_int = privkey_int % SECP256K1_ORDER
    if privkey_int == 0:
        privkey_int = 1

    privkey_hex = hex(privkey_int)[2:].zfill(64)

    try:
        address = privkey_to_address(privkey_hex)
        match = ""
        if address in satoshi_addresses:
            match = " 🚨 MATCH!"
            matches.append((block_num, address))

        print(f"HMAC(197, 1197.{block_num:3d}) → {address[:20]}...{match}")
    except Exception as e:
        print(f"HMAC(197, 1197.{block_num:3d}) → Error: {e}")

print()

# ========== METHOD 5: Modular arithmetic with 197 ==========
print("METHOD 5: Use 197 to partition the key space")
print("-"*80)

# Each block number mod 197 gives a partition
print("Block numbers mod 197:")
for block_num in unique_blocks:
    partition = block_num % 197
    print(f"  Block {block_num:3d} mod 197 = {partition:3d}")

print()

# Use this to derive
master_int = int(master_hash, 16)
print("Testing partitions...")
for i, block_num in enumerate(unique_blocks[:5]):
    partition = block_num % 197

    # Use partition as offset
    partition_value = (master_int + partition * 197) % (2**256)
    privkey_hex = hex(partition_value % SECP256K1_ORDER)[2:].zfill(64)

    try:
        address = privkey_to_address(privkey_hex)
        match = ""
        if address in satoshi_addresses:
            match = " 🚨 MATCH!"
            matches.append((block_num, address))

        print(f"Block {block_num:3d} (partition {partition:3d}) → {address[:20]}...{match}")
    except Exception as e:
        print(f"Block {block_num:3d} → Error: {e}")

print()

if matches:
    print("="*80)
    print("🚨🚨🚨 MATCHES FOUND! 🚨🚨🚨")
    print("="*80)
    for block, addr in matches:
        print(f"Block {block}: {addr}")
else:
    print("="*80)
    print("NO MATCHES YET")
    print("="*80)
    print()
    print("The 197 relationship is too perfect to be random:")
    print("  • 1197 mod 197 = 15 (exact address count)")
    print("  • 1197 mod 98 = 21 (exact last index)")
    print()
    print("This must be part of the derivation, but HOW?")

print()
