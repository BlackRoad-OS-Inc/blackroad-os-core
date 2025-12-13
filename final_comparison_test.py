#!/usr/bin/env python3
"""
FINAL COMPARISON TEST
Testing if Alexa's personal master key generates Satoshi's addresses
This is the last hope.
"""

import hashlib
import json
from datetime import datetime

print("""
╔══════════════════════════════════════════════════════════════════════════╗
║                                                                          ║
║                        THE FINAL TEST                                    ║
║                                                                          ║
║              Does your personal key generate Satoshi's addresses?        ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
""")

# ============================================================================
# YOUR PERSONAL DATA (from personal_master_key_FINAL.py)
# ============================================================================

LOCALHOST_IP = "127.0.0.1"
PERSONAL_DATE = datetime(2000, 3, 27)
FULL_NAME = "Alexa Louise Amundson"
BITCOIN_GENESIS = datetime(2009, 1, 3, 18, 15, 5)
GAUSS_EASTER_DATE = datetime(1800, 1, 1)

print("="*80)
print("STEP 1: Generating your personal master key")
print("="*80)
print()
print(f"Personal data:")
print(f"  Name:      {FULL_NAME}")
print(f"  Date:      {PERSONAL_DATE.strftime('%B %d, %Y')}")
print(f"  Localhost: {LOCALHOST_IP}")
print(f"  Temporal:  Gauss (1800) → Bitcoin (2009)")
print()

# Generate master key
temporal_delta = BITCOIN_GENESIS - GAUSS_EASTER_DATE
temporal_minutes = int(temporal_delta.total_seconds() / 60)
localhost_numeric = LOCALHOST_IP.replace(".", "")
personal_numeric = int(PERSONAL_DATE.strftime("%Y%m%d"))

combined_string = (
    str(temporal_minutes) +
    localhost_numeric +
    str(personal_numeric) +
    FULL_NAME.replace(" ", "")
)

master_hash = hashlib.sha256(combined_string.encode()).hexdigest()
master_int = int(master_hash, 16)

print(f"Master hash: {master_hash}")
print(f"Master int:  {hex(master_int)[:60]}...")
print()

# ============================================================================
# GENERATE ADDRESSES
# ============================================================================

print("="*80)
print("STEP 2: Generating addresses (testing multiple directions)")
print("="*80)
print()

def generate_addresses(master_int, count, direction):
    """Generate addresses from master key"""
    addresses = []
    for i in range(count):
        partition_value = (master_int + (i * direction)) % (2**256)
        partition_bytes = partition_value.to_bytes(32, byteorder='big')
        partition_hash = hashlib.sha256(partition_bytes).hexdigest()
        ripemd = hashlib.new('ripemd160')
        ripemd.update(bytes.fromhex(partition_hash))
        address_hash = ripemd.hexdigest()
        addresses.append({
            'index': i,
            'hash': address_hash,
            'sha256': partition_hash
        })
    return addresses

# Test both directions
print("Generating with direction = -1 (backward)...")
addresses_backward = generate_addresses(master_int, 1000, -1)
print(f"✓ Generated {len(addresses_backward)} addresses (backward)")

print("\nGenerating with direction = +1 (forward)...")
addresses_forward = generate_addresses(master_int, 1000, +1)
print(f"✓ Generated {len(addresses_forward)} addresses (forward)")

# Show samples
print("\nSample generated addresses (backward):")
for i in [0, 1, 2, 10, 100]:
    print(f"  [{i:4d}] {addresses_backward[i]['hash']}")

# ============================================================================
# LOAD PATOSHI ADDRESSES
# ============================================================================

print("\n" + "="*80)
print("STEP 3: Loading Patoshi addresses")
print("="*80)
print()

with open('/Users/alexa/blackroad-sandbox/patoshi_addresses.json', 'r') as f:
    patoshi_data = json.load(f)

patoshi_addresses = patoshi_data['addresses']
print(f"✓ Loaded {len(patoshi_addresses)} Patoshi addresses")
print()
print("Patoshi addresses:")
for addr in patoshi_addresses[:5]:
    print(f"  Block {addr['block']:4d}: {addr['address']}")
print()

# ============================================================================
# CONVERT PATOSHI ADDRESSES TO RIPEMD-160
# ============================================================================

print("="*80)
print("STEP 4: Converting Bitcoin addresses to RIPEMD-160 hashes")
print("="*80)
print()

def base58_decode(address):
    """Decode Base58 Bitcoin address"""
    alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
    decoded = 0
    for char in address:
        decoded = decoded * 58 + alphabet.index(char)
    # Convert to bytes (25 bytes total)
    hex_str = hex(decoded)[2:].zfill(50)  # 25 bytes = 50 hex chars
    # Extract RIPEMD-160 (skip version byte, skip checksum)
    # Format: [1 byte version][20 bytes RIPEMD-160][4 bytes checksum]
    ripemd160 = hex_str[2:42]  # Skip first 2 chars (version), take next 40 (RIPEMD-160)
    return ripemd160

patoshi_ripemd = []
for addr_data in patoshi_addresses:
    try:
        ripemd = base58_decode(addr_data['address'])
        patoshi_ripemd.append({
            'block': addr_data['block'],
            'address': addr_data['address'],
            'ripemd160': ripemd
        })
        print(f"  Block {addr_data['block']:4d}: {ripemd}")
    except Exception as e:
        print(f"  Block {addr_data['block']:4d}: Error - {e}")

print(f"\n✓ Converted {len(patoshi_ripemd)} addresses")

# ============================================================================
# COMPARE ADDRESSES
# ============================================================================

print("\n" + "="*80)
print("STEP 5: COMPARING YOUR ADDRESSES WITH SATOSHI'S")
print("="*80)
print()

# Create sets for comparison
your_hashes_backward = {addr['hash'] for addr in addresses_backward}
your_hashes_forward = {addr['hash'] for addr in addresses_forward}
patoshi_hashes = {addr['ripemd160'] for addr in patoshi_ripemd}

# Find exact matches
matches_backward = your_hashes_backward & patoshi_hashes
matches_forward = your_hashes_forward & patoshi_hashes

print(f"Backward direction (-1):")
print(f"  Your addresses:     {len(your_hashes_backward):,}")
print(f"  Patoshi addresses:  {len(patoshi_hashes)}")
print(f"  EXACT MATCHES:      {len(matches_backward)}")
print()

print(f"Forward direction (+1):")
print(f"  Your addresses:     {len(your_hashes_forward):,}")
print(f"  Patoshi addresses:  {len(patoshi_hashes)}")
print(f"  EXACT MATCHES:      {len(matches_forward)}")
print()

# ============================================================================
# PARTIAL MATCHES (first few bytes)
# ============================================================================

print("="*80)
print("STEP 6: Checking for partial matches (statistical relevance)")
print("="*80)
print()

def check_partial_matches(your_addrs, patoshi_addrs, min_bytes=2):
    """Check for partial hash matches"""
    partial = []
    for gen in your_addrs:
        for pat in patoshi_addrs:
            gen_hash = gen['hash']
            pat_hash = pat['ripemd160']

            # Check how many leading bytes match
            for bytes_matching in range(20, min_bytes-1, -1):
                hex_chars = bytes_matching * 2
                if gen_hash[:hex_chars] == pat_hash[:hex_chars]:
                    partial.append({
                        'index': gen['index'],
                        'block': pat['block'],
                        'bytes': bytes_matching,
                        'gen_hash': gen_hash,
                        'pat_hash': pat_hash,
                        'pat_address': pat['address']
                    })
                    break
    return partial

print("Checking backward direction...")
partial_backward = check_partial_matches(addresses_backward, patoshi_ripemd, min_bytes=2)

print("Checking forward direction...")
partial_forward = check_partial_matches(addresses_forward, patoshi_ripemd, min_bytes=2)

print(f"\nPartial matches (≥2 bytes):")
print(f"  Backward: {len(partial_backward)}")
print(f"  Forward:  {len(partial_forward)}")

if partial_backward:
    print(f"\nBest backward matches:")
    for match in sorted(partial_backward, key=lambda x: x['bytes'], reverse=True)[:5]:
        print(f"  {match['bytes']:2d} bytes match | Index {match['index']:4d} ↔ Block {match['block']:4d}")
        print(f"    Your: {match['gen_hash'][:40]}...")
        print(f"    Sat:  {match['pat_hash'][:40]}... ({match['pat_address']})")

if partial_forward:
    print(f"\nBest forward matches:")
    for match in sorted(partial_forward, key=lambda x: x['bytes'], reverse=True)[:5]:
        print(f"  {match['bytes']:2d} bytes match | Index {match['index']:4d} ↔ Block {match['block']:4d}")
        print(f"    Your: {match['gen_hash'][:40]}...")
        print(f"    Sat:  {match['pat_hash'][:40]}... ({match['pat_address']})")

# ============================================================================
# FINAL VERDICT
# ============================================================================

print("\n" + "="*80)
print("FINAL VERDICT")
print("="*80)
print()

if matches_backward or matches_forward:
    direction = "BACKWARD" if matches_backward else "FORWARD"
    match_count = len(matches_backward) if matches_backward else len(matches_forward)

    print(f"""
╔══════════════════════════════════════════════════════════════════════════╗
║                                                                          ║
║                      🎉 MATCHES FOUND! 🎉                                ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝

EXACT MATCHES: {match_count}
DIRECTION: {direction}

YOUR PERSONAL MASTER KEY SYSTEM GENERATES SATOSHI'S ADDRESSES!

This is STATISTICALLY IMPOSSIBLE by random chance.

WHAT THIS MEANS:
• Your algorithm (Time + Localhost + Date + Name) is CORRECT
• The direction ({direction}) is CORRECT
• You have discovered Satoshi's key generation method
• This is potentially the biggest cryptocurrency discovery in history

MATCHED ADDRESSES:
""")

    matches = matches_backward if matches_backward else matches_forward
    for i, match_hash in enumerate(sorted(list(matches)), 1):
        # Find which Patoshi address this is
        for pat in patoshi_ripemd:
            if pat['ripemd160'] == match_hash:
                print(f"  {i}. Block {pat['block']:4d}: {pat['address']}")
                print(f"     Hash: {match_hash}")
                break

    print(f"""
CRITICAL NEXT STEPS:
1. ✅ Verify this result multiple times (OFFLINE!)
2. ✅ Generate full 22,000 addresses
3. ✅ Compare with complete Patoshi list
4. ✅ DO NOT share your personal data publicly
5. ✅ Consult cryptography experts
6. ✅ Consult legal counsel
7. ✅ Understand the implications (~$106 billion)

This changes EVERYTHING.
""")

else:
    print(f"""
╔══════════════════════════════════════════════════════════════════════════╗
║                                                                          ║
║                      ❌ NO EXACT MATCHES FOUND                           ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝

Your personal master key system did not produce exact matches with the
15 verified Satoshi addresses tested.

TESTED:
• 1,000 addresses in backward direction (-1)
• 1,000 addresses in forward direction (+1)
• Against 15 verified Satoshi coinbase addresses

PARTIAL MATCHES:
• Backward: {len(partial_backward)} partial matches (≥2 bytes)
• Forward:  {len(partial_forward)} partial matches (≥2 bytes)

WHAT THIS MEANS:
The personal master key approach (Time + Localhost + Date + Name) does not
appear to generate Satoshi's addresses directly.

POSSIBLE EXPLANATIONS:
1. Different master key components needed
2. Additional parameters (passphrase, salt, etc.)
3. Different hash function or derivation method
4. Wrong temporal anchors
5. Satoshi used a completely different system

WHAT TO TRY NEXT:
1. Test with physics constants system (satoshi_final_system.py)
2. Try different temporal anchors (different dates)
3. Adjust the combined string format
4. Test with different hash functions
5. Try alternative compression methods

STATISTICAL NOTE:
Partial matches at ≥2 bytes are expected by random chance.
For a real match, you need 20 bytes (40 hex chars) exact match.
""")

# Save results
results = {
    'timestamp': datetime.now().isoformat(),
    'personal_data': {
        'name': FULL_NAME,
        'date': PERSONAL_DATE.strftime('%Y-%m-%d'),
        'localhost': LOCALHOST_IP
    },
    'master_hash': master_hash,
    'addresses_generated': len(addresses_backward),
    'patoshi_addresses_tested': len(patoshi_ripemd),
    'exact_matches_backward': len(matches_backward),
    'exact_matches_forward': len(matches_forward),
    'partial_matches_backward': len(partial_backward),
    'partial_matches_forward': len(partial_forward),
    'verdict': 'MATCH' if (matches_backward or matches_forward) else 'NO_MATCH'
}

with open('/Users/alexa/blackroad-sandbox/final_test_results.json', 'w') as f:
    json.dump(results, f, indent=2)

print("\n✓ Results saved to final_test_results.json")
print("\n" + "="*80)
print()
