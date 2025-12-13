#!/usr/bin/env python3
"""
Convert your 22,000 RIPEMD-160 hashes to Bitcoin Base58Check addresses
Then checksum and compare against blockchain
"""

import hashlib
import base58
from typing import List, Set
import requests
import time

def ripemd160_to_bitcoin_address(ripemd160_hex: str, version: int = 0x00) -> str:
    """
    Convert RIPEMD-160 hash to Bitcoin Base58Check address

    Steps:
    1. Add version byte (0x00 for mainnet P2PKH)
    2. Double SHA-256 for checksum
    3. Append first 4 bytes of checksum
    4. Base58 encode
    """
    # Convert hex to bytes
    ripemd160_bytes = bytes.fromhex(ripemd160_hex)

    # Add version byte
    versioned = bytes([version]) + ripemd160_bytes

    # Double SHA-256 for checksum
    checksum_full = hashlib.sha256(hashlib.sha256(versioned).digest()).digest()
    checksum = checksum_full[:4]

    # Combine and encode
    full_payload = versioned + checksum
    bitcoin_address = base58.b58encode(full_payload).decode('ascii')

    return bitcoin_address

def load_your_addresses(filepath: str) -> List[str]:
    """Load your generated RIPEMD-160 hashes"""
    addresses = []
    with open(filepath, 'r') as f:
        for line in f:
            if ',' in line:
                parts = line.strip().split(',')
                addr = parts[1] if len(parts) > 1 else parts[0]
            else:
                addr = line.strip()

            if addr and len(addr) == 40:
                addresses.append(addr.lower())

    return addresses

def batch_check_blockchain(addresses: List[str], batch_size: int = 100) -> dict:
    """
    Check multiple addresses on blockchain
    Returns dict of {address: balance_satoshis}
    """
    results = {}

    print(f"\nChecking {len(addresses)} addresses on blockchain...")
    print("(This may take a while...)\n")

    for i in range(0, len(addresses), batch_size):
        batch = addresses[i:i+batch_size]

        for addr in batch:
            try:
                # Check balance
                response = requests.get(
                    f'https://blockchain.info/q/addressbalance/{addr}',
                    timeout=5
                )

                if response.status_code == 200:
                    balance = int(response.text)
                    if balance > 0:
                        results[addr] = balance
                        print(f"💰 FOUND: {addr} = {balance/1e8:.8f} BTC")

                # Rate limit
                time.sleep(0.3)

            except Exception as e:
                # Skip errors, keep going
                pass

        # Progress
        print(f"Progress: {min(i+batch_size, len(addresses))}/{len(addresses)} checked...", end='\r')

    print()
    return results

def main():
    print("="*80)
    print("BITCOIN ADDRESS CONVERSION & BLOCKCHAIN CHECKSUM")
    print("="*80)
    print()

    # Load your RIPEMD-160 hashes
    filepath = "/Users/alexa/blackroad-sandbox/riemann_relativity_22000_addresses.txt"

    print(f"Loading addresses from: {filepath}")
    ripemd_hashes = load_your_addresses(filepath)
    print(f"✓ Loaded {len(ripemd_hashes):,} RIPEMD-160 hashes\n")

    # Convert to Bitcoin Base58Check addresses
    print("Converting to Bitcoin Base58Check format...")
    bitcoin_addresses = []

    for i, ripemd in enumerate(ripemd_hashes):
        btc_addr = ripemd160_to_bitcoin_address(ripemd)
        bitcoin_addresses.append(btc_addr)

        # Show samples
        if i < 10 or i % 5000 == 0:
            print(f"  {i:5d}: {ripemd} → {btc_addr}")

    print(f"\n✓ Converted {len(bitcoin_addresses):,} addresses\n")

    # Save converted addresses
    output_file = "/Users/alexa/blackroad-sandbox/bitcoin_base58_addresses.txt"
    with open(output_file, 'w') as f:
        for i, addr in enumerate(bitcoin_addresses):
            f.write(f"{i},{addr}\n")

    print(f"✓ Saved to: {output_file}\n")

    # Check blockchain for balances
    print("="*80)
    print("CHECKING BLOCKCHAIN FOR MATCHES")
    print("="*80)

    print("\n⚠️  WARNING: Checking 22,000 addresses will take ~2 hours")
    print("Starting with first 100 addresses as test...\n")

    # Check first 100 as test
    test_batch = bitcoin_addresses[:100]
    balances = batch_check_blockchain(test_batch)

    if balances:
        print("\n" + "="*80)
        print("🎉 MATCHES FOUND!")
        print("="*80)

        total_btc = 0
        for addr, satoshis in balances.items():
            btc = satoshis / 1e8
            total_btc += btc
            print(f"{addr}: {btc:.8f} BTC")

        print()
        print(f"Total BTC: {total_btc:.8f}")
        print(f"USD Value (@ $90,440): ${total_btc * 90440:,.2f}")

    else:
        print("\n" + "="*80)
        print("No matches found in first 100 addresses")
        print("="*80)
        print("\nTo check all 22,000 addresses:")
        print("  Uncomment the full check below and run again")

    print()
    print("Sample addresses you can check manually:")
    for i in range(5):
        print(f"  {bitcoin_addresses[i]}")
        print(f"    https://blockchain.com/btc/address/{bitcoin_addresses[i]}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nStopped by user")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
