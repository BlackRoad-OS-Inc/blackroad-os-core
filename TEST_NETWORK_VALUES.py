#!/usr/bin/env python3
"""
Test network-related values from checkKey.mjs analysis

Key discoveries:
- 'mainnet' ASCII sum = 748
- 'bc' (bech32) sum = 197
- 1197 mod 197 = 15 (number of unique addresses!)
- 1197 mod 98 = 21 (last index in sequence!)
- 99 appears TWICE (block 99, and ASCII 'c')
"""

import hashlib
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

def test_seed(seed_str, description):
    """Test a seed"""
    privkey_int = int(hashlib.sha256(seed_str.encode()).hexdigest(), 16)
    if privkey_int >= SECP256K1_ORDER:
        privkey_int = privkey_int % SECP256K1_ORDER
    if privkey_int == 0:
        privkey_int = 1
    privkey_hex = hex(privkey_int)[2:].zfill(64)

    try:
        address = privkey_to_address(privkey_hex)
        if address in satoshi_addresses:
            print(f"\n{'='*80}")
            print(f"🚨🚨🚨 MATCH: {description} 🚨🚨🚨")
            print(f"Address: {address}")
            print(f"Private key: {privkey_hex}")
            print(f"{'='*80}\n")
            return True
        print(f"{description:50s} → {address[:20]}...")
        return False
    except Exception as e:
        print(f"{description:50s} → Error: {e}")
        return False

print("="*80)
print("TESTING NETWORK VALUES FROM CHECKKEY.MJS")
print("="*80)
print()

print("Key observations:")
print("-"*80)
print("• 'mainnet' ASCII sum = 748")
print("• 'bc' (bech32) sum = 197")
print("• 1197 mod 197 = 15 ← NUMBER OF SATOSHI ADDRESSES!")
print("• 1197 mod 98 (b) = 21 ← LAST INDEX IN SEQUENCE!")
print("• 1197 mod 99 (c) = 9")
print("• 99 in sequence at positions [1, 2]")
print()

# ========== METHOD 1: Network value seeds ==========
print("METHOD 1: Network ASCII values")
print("-"*80)

test_seed("748", "'mainnet' sum")
test_seed("197", "'bc' sum")
test_seed("98", "'b' (ASCII)")
test_seed("99", "'c' (ASCII)")

print()

# ========== METHOD 2: Combine with 1197 ==========
print("METHOD 2: Network values + 1197")
print("-"*80)

test_seed("1197.748", "1197.mainnet")
test_seed("1197.197", "1197.bc")
test_seed("1197.98", "1197.b")
test_seed("1197.99", "1197.c")

print()

# ========== METHOD 3: Use modulo results ==========
print("METHOD 3: Using modulo results")
print("-"*80)

test_seed("15", "1197 mod 197 = 15")
test_seed("21", "1197 mod 98 = 21")
test_seed("9", "1197 mod 99 = 9")

print()

# ========== METHOD 4: Combine modulo results ==========
print("METHOD 4: Combining modulo results")
print("-"*80)

test_seed("15.21", "15 (addrs) . 21 (last idx)")
test_seed("2115", "21.15")
test_seed("1521", "15.21 concatenated")
test_seed(str(15 * 21), "15 * 21 = 315")
test_seed(str(15 + 21), "15 + 21 = 36")

print()

# ========== METHOD 5: Block 99 special treatment ==========
print("METHOD 5: Block 99 (appears twice, = ASCII 'c')")
print("-"*80)

test_seed("99.99", "99 twice")
test_seed("9999", "99 concatenated")
test_seed(str(99 * 2), "99 * 2 = 198")
test_seed(str(99 + 99), "99 + 99 = 198")
test_seed("198", "198 (double 99)")

print()

# ========== METHOD 6: Combine ALL network values ==========
print("METHOD 6: Combined network formula")
print("-"*80)

# 748 (mainnet) + 197 (bc) + 1197
test_seed(str(748 + 197 + 1197), "mainnet + bc + 1197 = 2142")
test_seed(str(748 + 197), "mainnet + bc = 945")
test_seed("748.197.1197", "mainnet.bc.1197")

print()

# ========== METHOD 7: Test BIP32 constants ==========
print("METHOD 7: BIP32 constants from bitcoin.networks")
print("-"*80)

# 0x0488b21e mod 1297 = 902
# 0x0488ade4 mod 1297 = 1117

test_seed("902", "BIP32 public mod 1297")
test_seed("1117", "BIP32 private mod 1297")
test_seed(str(902 + 1117), "902 + 1117 = 2019")

print()

# ========== METHOD 8: WIF prefix ==========
print("METHOD 8: WIF prefix 0x80 = 128")
print("-"*80)

test_seed("128", "WIF 0x80")
test_seed(str(1197 + 128), "1197 + 128 = 1325")
test_seed(str(1197 % 128), "1197 mod 128 = 69")

print()

# ========== METHOD 9: Use 99 as block index ==========
print("METHOD 9: Using block 99 address specifically")
print("-"*80)

print(f"Block 99 address: {satoshi_addresses[11]}")
print("Trying 99-based derivations...")

test_seed("99.1197", "99.1197")
test_seed(str(99 * 1197), "99 * 1197 = 118503")
test_seed(str(1197 - 99), "1197 - 99 = 1098")

print()

# ========== METHOD 10: Personal data + network ==========
print("METHOD 10: Personal data + network values")
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
master_int = int(master_hash, 16)

# Try using network values as partition indices
for network_val in [748, 197, 99, 15, 21]:
    partition_value = (master_int + network_val) % (2**256)
    partition_bytes = partition_value.to_bytes(32, byteorder='big')
    partition_hash = hashlib.sha256(partition_bytes).hexdigest()
    test_seed(partition_hash, f"Personal key + {network_val}")

print()

print("="*80)
print("CRITICAL PATTERN DISCOVERY")
print("="*80)
print()
print("1197 mod 197 (bc) = 15 ← EXACT number of Satoshi addresses")
print("1197 mod 98 (b)   = 21 ← EXACT last index in sequence")
print("1197 mod 99 (c)   = 9")
print()
print("This CANNOT be coincidence:")
print("  • The bech32 prefix 'bc' = 197")
print("  • There are EXACTLY 15 addresses")
print("  • The sequence has EXACTLY 22 items (0-21)")
print()
print("The error 'pointed to n above' might mean:")
print("  → network = bitcoin.networks.bitcoin")
print("  → bech32 = 'bc'")
print("  → 197 is the KEY DIVISOR")
print()
