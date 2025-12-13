#!/usr/bin/env python3
"""
Treat addresses as hexadecimal hrefs (references)
Decode the hex IN the addresses themselves
"""

import base58
import hashlib
import ecdsa

satoshi_addresses = {
    0: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    2: "1HLoD9E4SDFFPDiYfNYnkBLQ85Y51J3Zb1",
    3: "1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR",
    6: "1GkQmKAmHtNfnD3LHhTkewJxKHVSta4m2a",
    7: "16LoW7y83wtawMg5XmT4M3Q7EdjjUmenjM",
    14: "1DMGtVnRrgZaji7C9noZS3a1QtoaAN2uRG",
    18: "1DJkjSqW9cX9XWdU71WX3Aw6s6Mk4C3TtN",
    24: "1JXLFv719ec3bzTXaSq7vqRFS634LErtJu",
    29: "1GnYgH4V4kHdYEdHwAczRHXwqxdY7xars1",
    30: "17x23dNjXJLzGMev6R63uyRhMWP1VHawKc",
    31: "1PHB5i7JMEZCKvcjYSQXPbi5oSK8DoJucS",
    99: "16cAVR3SQbNzu8KZtGdo8cG1iueWpcngxz",
    113: "19K4cNVYVyNiwZ5xkzjW9ZtMb8XvBS2LkT",
    220: "1MUuVeuS6DDS5QKR2BNZ9fipXCEsFujaMH",
    450: "1LfjLrBDYyPbvGMiD9jURxyAupdYujsBdK",
}

sequence = [18, 99, 99, 3, 3, 7, 24, 0, 2, 14, 29, 3, 3, 31, 6, 220, 450, 113, 30, 113, 30, 0]

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

print("="*80)
print("HEXADECIMAL HREF - DECODE ADDRESSES AS HEX REFERENCES")
print("="*80)
print()

print("METHOD 1: Decode addresses from base58 to hex")
print("-"*80)

for block, addr in list(satoshi_addresses.items())[:5]:
    # Decode base58
    decoded = base58.b58decode(addr)
    hex_data = decoded.hex()

    print(f"Block {block:3d}: {addr}")
    print(f"  Decoded hex: {hex_data}")
    print(f"  Length: {len(decoded)} bytes")

    # The first byte is version (0x00)
    # Last 4 bytes are checksum
    # Middle is the hash160
    version = decoded[0]
    hash160 = decoded[1:-4]
    checksum = decoded[-4:]

    print(f"  Version: 0x{version:02x}")
    print(f"  Hash160: {hash160.hex()}")
    print(f"  Checksum: {checksum.hex()}")
    print()

print()

# METHOD 2: Look for HEX PATTERNS in the addresses
print("METHOD 2: Extract hex digits from address strings")
print("-"*80)

for block, addr in list(satoshi_addresses.items())[:5]:
    # Find all hex digits (0-9, A-F) in the address
    hex_chars = ''.join(c for c in addr if c in '0123456789ABCDEFabcdef')

    print(f"Block {block:3d}: {addr}")
    print(f"  Hex chars: {hex_chars}")

    if len(hex_chars) >= 64:
        # Try as private key
        privkey_hex = hex_chars[:64]
        print(f"  As privkey: {privkey_hex}")

        try:
            # Validate it's in range
            privkey_int = int(privkey_hex, 16)
            if privkey_int < SECP256K1_ORDER and privkey_int > 0:
                test_addr = privkey_to_address(privkey_hex)
                match = " 🚨 MATCH!" if test_addr == addr else ""
                print(f"  Generated: {test_addr}{match}")
        except:
            pass

    print()

print()

# METHOD 3: Use hash160 FROM the address as the private key
print("METHOD 3: Use hash160 as private key")
print("-"*80)

matches = []
for block, addr in satoshi_addresses.items():
    decoded = base58.b58decode(addr)
    hash160 = decoded[1:-4]

    # Pad hash160 (20 bytes) to 32 bytes for private key
    privkey_hex = hash160.hex().zfill(64)

    try:
        privkey_int = int(privkey_hex, 16)
        if privkey_int >= SECP256K1_ORDER:
            privkey_int = privkey_int % SECP256K1_ORDER
        if privkey_int == 0:
            privkey_int = 1

        privkey_hex = hex(privkey_int)[2:].zfill(64)
        test_addr = privkey_to_address(privkey_hex)

        match = " 🚨 MATCH!" if test_addr == addr else ""

        if block < 10 or match:
            print(f"Block {block:3d}: {test_addr[:30]}...{match}")

        if match:
            matches.append((block, addr, privkey_hex))

    except Exception as e:
        if block < 10:
            print(f"Block {block:3d}: Error - {e}")

if matches:
    print()
    print("🚨🚨🚨 MATCHES FOUND! 🚨🚨🚨")
    for block, addr, key in matches:
        print(f"Block {block}: {addr}")
        print(f"  Private key: {key}")
else:
    print()
    print("No matches using hash160 as private key")

print()

# METHOD 4: Treat entire decoded bytes as href to something
print("METHOD 4: Look for patterns in decoded bytes")
print("-"*80)

all_decoded = []
for block, addr in satoshi_addresses.items():
    decoded = base58.b58decode(addr)
    all_decoded.append((block, decoded))

# Check if bytes reference block numbers
for block, decoded_bytes in all_decoded[:5]:
    print(f"Block {block:3d}:")

    # Check each byte
    for i, byte in enumerate(decoded_bytes):
        if byte in sequence:
            print(f"  Byte {i}: 0x{byte:02x} ({byte}) ✓ in sequence")
        elif byte == block:
            print(f"  Byte {i}: 0x{byte:02x} ({byte}) ✓ matches block number!")

    print()

print()

# METHOD 5: XOR the hash160s together
print("METHOD 5: XOR all hash160s to find master key")
print("-"*80)

xor_result = bytes(20)  # 20 bytes for hash160

for block, addr in satoshi_addresses.items():
    decoded = base58.b58decode(addr)
    hash160 = decoded[1:-4]

    # XOR with running result
    xor_result = bytes(a ^ b for a, b in zip(xor_result, hash160))

print(f"XOR of all hash160s: {xor_result.hex()}")

# Pad to 32 bytes and try as key
privkey_hex = xor_result.hex().zfill(64)
print(f"As private key: {privkey_hex}")

try:
    privkey_int = int(privkey_hex, 16)
    if privkey_int >= SECP256K1_ORDER:
        privkey_int = privkey_int % SECP256K1_ORDER
    if privkey_int == 0:
        privkey_int = 1

    privkey_hex = hex(privkey_int)[2:].zfill(64)
    test_addr = privkey_to_address(privkey_hex)
    print(f"Generated address: {test_addr}")

    if test_addr in satoshi_addresses.values():
        print("🚨🚨🚨 MATCH!")
except Exception as e:
    print(f"Error: {e}")

print()

# METHOD 6: The SEQUENCE points to positions in the hex
print("METHOD 6: Sequence as indices into address hex")
print("-"*80)

# Use Genesis address
genesis_addr = satoshi_addresses[0]
decoded = base58.b58decode(genesis_addr)
hex_str = decoded.hex()

print(f"Genesis address hex: {hex_str}")
print(f"Length: {len(hex_str)} hex chars ({len(decoded)} bytes)")
print()

# Use sequence values as indices
extracted_hex = ''
for i, idx in enumerate(sequence):
    if idx < len(hex_str):
        char = hex_str[idx]
        extracted_hex += char
        if i < 10:
            print(f"  Position {i}: sequence[{i}]={idx:3d} → hex[{idx}]='{char}'")

print()
print(f"Extracted hex: {extracted_hex}")
print(f"Length: {len(extracted_hex)} chars")

if len(extracted_hex) == 64:
    try:
        test_addr = privkey_to_address(extracted_hex)
        print(f"Generated address: {test_addr}")
        if test_addr in satoshi_addresses.values():
            print("🚨🚨🚨 MATCH!")
    except Exception as e:
        print(f"Error: {e}")
elif len(extracted_hex) > 64:
    privkey_hex = extracted_hex[:64]
    print(f"Using first 64 chars: {privkey_hex}")
    try:
        test_addr = privkey_to_address(privkey_hex)
        print(f"Generated address: {test_addr}")
        if test_addr in satoshi_addresses.values():
            print("🚨🚨🚨 MATCH!")
    except Exception as e:
        print(f"Error: {e}")

print()
