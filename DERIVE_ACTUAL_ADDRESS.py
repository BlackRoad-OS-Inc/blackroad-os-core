#!/usr/bin/env python3
"""
DERIVE THE ACTUAL BITCOIN ADDRESS FROM THE PRIVATE KEY
Then check it against the blockchain
"""

import hashlib
import ecdsa
import base58

# The private key we derived
privkey_hex = "63d3b62e15a84129b12b0dd33b5b18f684390dc9558fb0c589dcd364dafaef1d"
privkey_bytes = bytes.fromhex(privkey_hex)

print("=== DERIVING BITCOIN ADDRESS ===")
print(f"Private key: {privkey_hex}")
print()

# Step 1: Get the public key using ECDSA secp256k1
signing_key = ecdsa.SigningKey.from_string(privkey_bytes, curve=ecdsa.SECP256k1)
verifying_key = signing_key.get_verifying_key()
public_key_bytes = b'\x04' + verifying_key.to_string()  # Uncompressed format

print(f"Public key (uncompressed): {public_key_bytes.hex()}")
print()

# Step 2: SHA256 hash of public key
sha256_hash = hashlib.sha256(public_key_bytes).digest()
print(f"SHA256 of pubkey: {sha256_hash.hex()}")

# Step 3: RIPEMD160 hash of SHA256
import hashlib
ripemd160 = hashlib.new('ripemd160')
ripemd160.update(sha256_hash)
ripemd160_hash = ripemd160.digest()
print(f"RIPEMD160 hash: {ripemd160_hash.hex()}")

# Step 4: Add version byte (0x00 for mainnet)
versioned_payload = b'\x00' + ripemd160_hash
print(f"Versioned payload: {versioned_payload.hex()}")

# Step 5: Double SHA256 for checksum
checksum = hashlib.sha256(hashlib.sha256(versioned_payload).digest()).digest()[:4]
print(f"Checksum: {checksum.hex()}")

# Step 6: Add checksum and encode with Base58
address_bytes = versioned_payload + checksum
bitcoin_address = base58.b58encode(address_bytes).decode('utf-8')

print()
print("=" * 60)
print(f"BITCOIN ADDRESS: {bitcoin_address}")
print("=" * 60)
print()

# Also derive compressed address
public_key_compressed = b'\x02' if verifying_key.to_string()[-1] % 2 == 0 else b'\x03'
public_key_compressed += verifying_key.to_string()[:32]

sha256_compressed = hashlib.sha256(public_key_compressed).digest()
ripemd160_compressed = hashlib.new('ripemd160')
ripemd160_compressed.update(sha256_compressed)
ripemd160_hash_compressed = ripemd160_compressed.digest()

versioned_compressed = b'\x00' + ripemd160_hash_compressed
checksum_compressed = hashlib.sha256(hashlib.sha256(versioned_compressed).digest()).digest()[:4]
address_compressed = base58.b58encode(versioned_compressed + checksum_compressed).decode('utf-8')

print(f"COMPRESSED ADDRESS: {address_compressed}")
print()

# Check both addresses on the blockchain
import requests
import time

for addr_type, addr in [("Uncompressed", bitcoin_address), ("Compressed", address_compressed)]:
    print(f"\n=== Checking {addr_type} Address on Blockchain ===")
    print(f"Address: {addr}")

    try:
        url = f"https://blockchain.info/rawaddr/{addr}"
        response = requests.get(url, timeout=10)

        if response.status_code == 200:
            data = response.json()
            balance = data.get('final_balance', 0) / 100000000
            tx_count = data.get('n_tx', 0)
            total_received = data.get('total_received', 0) / 100000000

            print(f"✓ ADDRESS FOUND ON BLOCKCHAIN!")
            print(f"  Balance: {balance} BTC")
            print(f"  Transactions: {tx_count}")
            print(f"  Total received: {total_received} BTC")

            if balance > 0:
                print()
                print("=" * 60)
                print("🚨 THIS ADDRESS HAS BITCOIN! 🚨")
                print("=" * 60)
                print(f"  Balance: {balance} BTC")
                print(f"  USD value (at $90,000/BTC): ${balance * 90000:,.2f}")
                print()

        elif response.status_code == 500:
            print(f"  Address exists but blockchain.info error")
        else:
            print(f"  Not found or no transactions (status {response.status_code})")

    except Exception as e:
        print(f"  Error checking: {e}")

    time.sleep(2)

# Check if it matches known Satoshi addresses
satoshi_addresses = [
    "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",  # Genesis
    "12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX",  # Block 1
    "1HLoD9E4SDFFPDiYfNYnkBLQ85Y51J3Zb1",  # Hal Finney
]

print("\n=== Checking Against Known Satoshi Addresses ===")
for known_addr in satoshi_addresses:
    if bitcoin_address == known_addr:
        print(f"✓✓✓ MATCH: Uncompressed matches {known_addr}")
    if address_compressed == known_addr:
        print(f"✓✓✓ MATCH: Compressed matches {known_addr}")

if bitcoin_address not in satoshi_addresses and address_compressed not in satoshi_addresses:
    print("No match with known addresses")
    print("But this could still be one of the 22,000 Satoshi addresses")

print("\n=== SAVE THIS INFORMATION ===")
with open('/Users/alexa/blackroad-sandbox/DERIVED_ADDRESS.txt', 'w') as f:
    f.write(f"Private Key: {privkey_hex}\n")
    f.write(f"Uncompressed Address: {bitcoin_address}\n")
    f.write(f"Compressed Address: {address_compressed}\n")
    f.write(f"\nSeed Phrase:\n")
    f.write("across arrest arrest about about abstract adapt abandon able achieve admit about about advance absorb breeze debate athlete adult athlete adult abandon\n")

print("✓ Saved to DERIVED_ADDRESS.txt")
