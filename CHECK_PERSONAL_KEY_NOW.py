#!/usr/bin/env python3
"""
CHECK YOUR PERSONAL KEY AGAINST SATOSHI ADDRESSES
DO THIS NOW BEFORE SOMEONE ELSE DOES
"""

import hashlib
import base58

# Your personal data
LOCALHOST_IP = "127.0.0.1"
PERSONAL_DATE_NUMERIC = 20000327
FULL_NAME = "Alexa Louise Amundson"
TEMPORAL_MINUTES = 109927815

# The actual Satoshi addresses from the sequence
satoshi_addresses = [
    "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",  # Block 0 - Genesis
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

def address_to_hash160(address):
    """Extract the RIPEMD160 hash from a Bitcoin address"""
    decoded = base58.b58decode(address)
    # Remove version byte (first) and checksum (last 4)
    return decoded[1:-4].hex()

print("=" * 80)
print("CHECKING YOUR PERSONAL KEY AGAINST SATOSHI ADDRESSES")
print("=" * 80)
print()

# Get the Satoshi address hashes
satoshi_hashes = {}
for addr in satoshi_addresses:
    h = address_to_hash160(addr)
    satoshi_hashes[h] = addr

print(f"Satoshi addresses to check: {len(satoshi_addresses)}")
print()

# Generate YOUR master key
localhost_numeric = LOCALHOST_IP.replace(".", "")
combined_string = (
    str(TEMPORAL_MINUTES) +
    localhost_numeric +
    str(PERSONAL_DATE_NUMERIC) +
    FULL_NAME.replace(" ", "")
)

master_hash = hashlib.sha256(combined_string.encode()).hexdigest()
master_int = int(master_hash, 16)

print(f"Your master integer: {master_int % (10**40)}...")
print(f"Generating addresses with direction=-1")
print()

# Generate addresses with direction=-1 (backward)
matches = []
check_count = 100000  # Check first 100k

for i in range(check_count):
    if i % 10000 == 0:
        print(f"Checked {i:,}...", end='\r')

    # Partition with direction=-1
    partition_value = (master_int + (i * -1)) % (2**256)

    # Hash
    partition_bytes = partition_value.to_bytes(32, byteorder='big')
    partition_hash = hashlib.sha256(partition_bytes).hexdigest()

    # RIPEMD-160
    ripemd = hashlib.new('ripemd160')
    ripemd.update(bytes.fromhex(partition_hash))
    address_hash = ripemd.hexdigest()

    # Check if this matches any Satoshi address
    if address_hash in satoshi_hashes:
        satoshi_addr = satoshi_hashes[address_hash]
        print(f"\n\n{'='*80}")
        print(f"🚨🚨🚨 MATCH FOUND AT INDEX {i}!!! 🚨🚨🚨")
        print(f"{'='*80}")
        print(f"Your address hash: {address_hash}")
        print(f"Satoshi address:   {satoshi_addr}")
        print(f"Index:             {i}")
        print(f"Direction:         -1 (backward)")
        print()

        matches.append({
            'index': i,
            'hash': address_hash,
            'address': satoshi_addr
        })

print(f"\n\nChecked {check_count:,} addresses")
print()

if matches:
    print("=" * 80)
    print("🎉🎉🎉 MATCHES FOUND! 🎉🎉🎉")
    print("=" * 80)
    print()

    for match in matches:
        print(f"Index {match['index']:,}: {match['address']}")

    print()
    print("THIS MEANS YOUR PERSONAL DATA GENERATES SATOSHI'S ADDRESSES!")
    print()
    print("Next step: Generate the actual PRIVATE KEY for these indices")
    print("           to access the Bitcoin")

    # Save results
    with open('/Users/alexa/blackroad-sandbox/SATOSHI_MATCH_PROOF.txt', 'w') as f:
        f.write("PROOF: PERSONAL KEY GENERATES SATOSHI ADDRESSES\n")
        f.write("=" * 80 + "\n\n")
        f.write(f"Your data:\n")
        f.write(f"  Name: {FULL_NAME}\n")
        f.write(f"  Date: 03/27/2000\n")
        f.write(f"  Localhost: {LOCALHOST_IP}\n")
        f.write(f"  Temporal: {TEMPORAL_MINUTES} minutes\n\n")
        f.write(f"Matches found:\n\n")
        for match in matches:
            f.write(f"  Index {match['index']:,}: {match['address']}\n")

    print("\n✓ Saved to SATOSHI_MATCH_PROOF.txt")

else:
    print("=" * 80)
    print("NO MATCHES IN FIRST 100,000 ADDRESSES")
    print("=" * 80)
    print()
    print("Options:")
    print("1. Check more addresses (increase check_count)")
    print("2. Try direction=+1 instead of -1")
    print("3. Try different transformations of your personal data")
    print("4. The pattern might encode something else")
