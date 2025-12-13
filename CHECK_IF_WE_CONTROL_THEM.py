#!/usr/bin/env python3
"""
Check if our derived seed phrase can generate any of the Satoshi addresses
"""

import hashlib
from mnemonic import Mnemonic
from bip32 import BIP32

# Our seed phrase (0-indexed)
seed_phrase = "across arrest arrest about about abstract adapt abandon able achieve admit about about advance absorb breeze debate athlete adult athlete adult abandon"

# The Satoshi addresses we found
satoshi_addresses = [
    "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",  # Block 0 (Genesis) - 104.46 BTC
    "1HLoD9E4SDFFPDiYfNYnkBLQ85Y51J3Zb1",  # Block 2 - 50.08 BTC
    "1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR",  # Block 3 - 50.01 BTC
    "1GkQmKAmHtNfnD3LHhTkewJxKHVSta4m2a",  # Block 6 - 50.00 BTC
    "16LoW7y83wtawMg5XmT4M3Q7EdjjUmenjM",  # Block 7 - 50.02 BTC
    "1DMGtVnRrgZaji7C9noZS3a1QtoaAN2uRG",  # Block 14 - 50.00 BTC
    "1DJkjSqW9cX9XWdU71WX3Aw6s6Mk4C3TtN",  # Block 18 - 50.00 BTC
    "1JXLFv719ec3bzTXaSq7vqRFS634LErtJu",  # Block 24 - 50.00 BTC
    "1GnYgH4V4kHdYEdHwAczRHXwqxdY7xars1",  # Block 29 - 53.00 BTC
    "17x23dNjXJLzGMev6R63uyRhMWP1VHawKc",  # Block 30 - 50.00 BTC
    "1PHB5i7JMEZCKvcjYSQXPbi5oSK8DoJucS",  # Block 31 - 50.00 BTC
    "16cAVR3SQbNzu8KZtGdo8cG1iueWpcngxz",  # Block 99 - 50.00 BTC
    "19K4cNVYVyNiwZ5xkzjW9ZtMb8XvBS2LkT",  # Block 113 - 50.00 BTC
    "1MUuVeuS6DDS5QKR2BNZ9fipXCEsFujaMH",  # Block 220 - 50.00 BTC
    "1LfjLrBDYyPbvGMiD9jURxyAupdYujsBdK",  # Block 450 - 0.00 BTC (spent)
]

print("=" * 80)
print("CHECKING IF OUR SEED PHRASE CAN ACCESS SATOSHI'S BITCOIN")
print("=" * 80)
print(f"\nSeed phrase: {seed_phrase}")
print(f"Target addresses: {len(satoshi_addresses)}")
print()

# Generate seed from mnemonic
mnemo = Mnemonic("english")
seed = mnemo.to_seed(seed_phrase, passphrase="")
print(f"Seed (hex, first 32 bytes): {seed[:32].hex()}")

# Initialize BIP32 from seed
bip32 = BIP32.from_seed(seed)

print("\n" + "=" * 80)
print("TESTING DERIVATION PATHS")
print("=" * 80)

# Test different derivation paths
paths_to_test = [
    # Standard BIP44 Bitcoin paths
    ("m/44'/0'/0'/0/0", "BIP44 first address"),
    ("m/44'/0'/0'/0/1", "BIP44 second address"),

    # Legacy Bitcoin Core
    ("m/0/0", "Bitcoin Core legacy first"),
    ("m/0/1", "Bitcoin Core legacy second"),

    # Direct derivation
    ("m", "Master key"),
]

# Also test the indices from our sequence
sequence_indices = [18, 99, 3, 7, 24, 0, 2, 14, 29, 31, 6, 220, 450, 113, 30]

for idx in sequence_indices[:10]:
    paths_to_test.append((f"m/44'/0'/0'/0/{idx}", f"BIP44 index {idx}"))
    paths_to_test.append((f"m/0/{idx}", f"Legacy index {idx}"))

matches_found = []

for path, description in paths_to_test:
    try:
        derived = bip32.get_privkey_from_path(path)
        pubkey = bip32.get_pubkey_from_path(path)

        # Generate P2PKH address (legacy format, what Satoshi used)
        # Hash the public key
        sha256 = hashlib.sha256(pubkey).digest()
        ripemd160 = hashlib.new('ripemd160')
        ripemd160.update(sha256)
        hashed_pubkey = ripemd160.digest()

        # Add version byte (0x00 for mainnet)
        versioned = b'\x00' + hashed_pubkey

        # Checksum
        checksum = hashlib.sha256(hashlib.sha256(versioned).digest()).digest()[:4]

        # Base58 encode
        import base58
        address = base58.b58encode(versioned + checksum).decode()

        # Check if this matches any Satoshi address
        if address in satoshi_addresses:
            idx = satoshi_addresses.index(address)
            print(f"\n🚨🚨🚨 MATCH FOUND!!! 🚨🚨🚨")
            print(f"Path: {path} ({description})")
            print(f"Address: {address}")
            print(f"This is Block {[0, 2, 3, 6, 7, 14, 18, 24, 29, 30, 31, 99, 113, 220, 450][idx]}")
            matches_found.append({
                'path': path,
                'address': address,
                'description': description
            })

    except Exception as e:
        print(f"Error testing {path}: {e}")

print("\n" + "=" * 80)
print("EXTENDED SEARCH - TESTING 1000 ADDRESSES")
print("=" * 80)

# Test first 1000 addresses on multiple paths
for base_path in ["m/44'/0'/0'/0", "m/0", "m"]:
    print(f"\nSearching {base_path}/...")

    for i in range(1000):
        if i % 100 == 0:
            print(f"  Checked {i}...", end='\r')

        try:
            if base_path == "m":
                path = f"{base_path}/{i}" if i > 0 else base_path
            else:
                path = f"{base_path}/{i}"

            derived = bip32.get_privkey_from_path(path)
            pubkey = bip32.get_pubkey_from_path(path)

            # Generate address
            sha256 = hashlib.sha256(pubkey).digest()
            ripemd160 = hashlib.new('ripemd160')
            ripemd160.update(sha256)
            hashed_pubkey = ripemd160.digest()
            versioned = b'\x00' + hashed_pubkey
            checksum = hashlib.sha256(hashlib.sha256(versioned).digest()).digest()[:4]

            import base58
            address = base58.b58encode(versioned + checksum).decode()

            if address in satoshi_addresses:
                idx = satoshi_addresses.index(address)
                print(f"\n🚨🚨🚨 MATCH FOUND AT INDEX {i}!!! 🚨🚨🚨")
                print(f"Path: {path}")
                print(f"Address: {address}")
                matches_found.append({
                    'path': path,
                    'address': address,
                    'index': i
                })
        except:
            pass

print("\n" + "=" * 80)
print("RESULTS")
print("=" * 80)

if matches_found:
    print(f"\n✓✓✓ FOUND {len(matches_found)} MATCHING ADDRESS(ES)! ✓✓✓\n")

    for match in matches_found:
        print(f"Path: {match['path']}")
        print(f"Address: {match['address']}")
        if 'description' in match:
            print(f"Description: {match['description']}")
        print()

    print("=" * 80)
    print("🚨 WE HAVE ACCESS TO SATOSHI'S BITCOIN 🚨")
    print("=" * 80)

    # Save the results
    with open('/Users/alexa/blackroad-sandbox/SATOSHI_ACCESS_PROOF.txt', 'w') as f:
        f.write("PROOF OF SATOSHI ACCESS\n")
        f.write("=" * 80 + "\n\n")
        f.write(f"Seed phrase: {seed_phrase}\n\n")
        f.write("Matching addresses:\n\n")
        for match in matches_found:
            f.write(f"Path: {match['path']}\n")
            f.write(f"Address: {match['address']}\n\n")

    print("\n✓ Saved to SATOSHI_ACCESS_PROOF.txt")

else:
    print("\n✗ NO MATCHES FOUND")
    print("\nThe seed phrase does not generate any of the Satoshi addresses.")
    print("\nPossibilities:")
    print("1. The sequence encodes something else (not a seed phrase)")
    print("2. Different derivation path or method needed")
    print("3. The addresses require a passphrase")
    print("4. The sequence is informational, not cryptographic")
