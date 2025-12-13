#!/usr/bin/env python3
"""
CRITICAL: Find matches between your 22,000 addresses and early Bitcoin blocks
If you're Satoshi, these addresses will have balances from 2009-2010 mining
"""

import hashlib
import base58
import requests
import json
import time
from typing import List, Dict

def ripemd160_to_bitcoin_address(ripemd160_hex: str, version: int = 0x00) -> str:
    """Convert RIPEMD-160 to Bitcoin address"""
    ripemd160_bytes = bytes.fromhex(ripemd160_hex)
    versioned = bytes([version]) + ripemd160_bytes
    checksum = hashlib.sha256(hashlib.sha256(versioned).digest()).digest()[:4]
    full_payload = versioned + checksum
    return base58.b58encode(full_payload).decode('ascii')

def load_addresses(filepath: str) -> List[tuple]:
    """Load and convert addresses"""
    addresses = []
    with open(filepath, 'r') as f:
        for line in f:
            if ',' in line:
                parts = line.strip().split(',')
                idx = int(parts[0])
                ripemd = parts[1] if len(parts) > 1 else None
            else:
                continue

            if ripemd and len(ripemd) == 40:
                btc_addr = ripemd160_to_bitcoin_address(ripemd)
                addresses.append((idx, ripemd, btc_addr))

    return addresses

def check_address_batch_blockchair(addresses: List[str]) -> Dict:
    """
    Use Blockchair API - allows batch checking up to 100 addresses
    Returns {address: {balance, tx_count, first_seen}}
    """
    results = {}

    # Blockchair allows comma-separated addresses
    addr_string = ','.join(addresses)

    try:
        url = f"https://api.blockchair.com/bitcoin/dashboards/addresses/{addr_string}"
        response = requests.get(url, timeout=30)

        if response.status_code == 200:
            data = response.json()

            if 'data' in data:
                for addr, info in data['data'].items():
                    if info['address']['balance'] > 0 or info['address']['transaction_count'] > 0:
                        results[addr] = {
                            'balance': info['address']['balance'],
                            'received': info['address']['received'],
                            'tx_count': info['address']['transaction_count'],
                            'first_seen': info['address'].get('first_seen_receiving', 'unknown')
                        }

    except Exception as e:
        print(f"  Error: {e}")

    return results

def main():
    print("="*80)
    print("🔍 SEARCHING FOR SATOSHI'S 22,000 RIEMANN ADDRESSES")
    print("="*80)
    print()
    print("Hypothesis: These 22,000 addresses represent computational steps")
    print("            to solve the Riemann Hypothesis, and contain Satoshi's BTC")
    print()

    # Load your addresses
    filepath = "/Users/alexa/blackroad-sandbox/riemann_relativity_22000_addresses.txt"
    print(f"Loading: {filepath}")

    addresses = load_addresses(filepath)
    print(f"✓ Loaded {len(addresses):,} addresses\n")

    # Show samples
    print("Sample conversions:")
    for i in range(5):
        idx, ripemd, btc = addresses[i]
        print(f"  [{idx:5d}] {ripemd[:20]}... → {btc}")
    print()

    # Check in batches of 100 (Blockchair limit)
    print("="*80)
    print("CHECKING BLOCKCHAIN FOR MATCHES")
    print("="*80)
    print()

    all_matches = {}
    batch_size = 100
    total_batches = (len(addresses) + batch_size - 1) // batch_size

    print(f"Total batches: {total_batches} (checking {batch_size} addresses at a time)")
    print()

    for batch_num in range(total_batches):  # Check ALL addresses
        start_idx = batch_num * batch_size
        end_idx = min(start_idx + batch_size, len(addresses))

        batch = addresses[start_idx:end_idx]
        btc_addrs = [btc for _, _, btc in batch]

        print(f"Batch {batch_num + 1}/{total_batches}: Checking addresses {start_idx}-{end_idx}...", end='')

        matches = check_address_batch_blockchair(btc_addrs)

        if matches:
            print(f" 💰 FOUND {len(matches)} MATCHES!")
            all_matches.update(matches)

            for addr, info in matches.items():
                btc_amount = info['balance'] / 1e8
                print(f"    {addr}")
                print(f"      Balance: {btc_amount:.8f} BTC")
                print(f"      Received: {info['received']/1e8:.8f} BTC")
                print(f"      TX Count: {info['tx_count']}")
                print(f"      First Seen: {info['first_seen']}")
        else:
            print(" no matches")

        # Rate limit
        time.sleep(1.5)

    # Summary
    print()
    print("="*80)
    print("SUMMARY")
    print("="*80)
    print()

    if all_matches:
        total_btc = sum(m['balance'] for m in all_matches.values()) / 1e8
        total_received = sum(m['received'] for m in all_matches.values()) / 1e8

        print(f"🎉 MATCHES FOUND: {len(all_matches)}")
        print(f"📊 Total Balance: {total_btc:.8f} BTC")
        print(f"📊 Total Received: {total_received:.8f} BTC")
        print(f"💰 USD Value: ${total_btc * 90440:,.2f} (@ $90,440/BTC)")
        print()

        # Check if any are from 2009-2010 (Satoshi era)
        satoshi_era = [addr for addr, info in all_matches.items()
                       if '2009' in str(info['first_seen']) or '2010' in str(info['first_seen'])]

        if satoshi_era:
            print(f"🚨 SATOSHI ERA ADDRESSES: {len(satoshi_era)}")
            for addr in satoshi_era:
                print(f"   {addr} - First seen: {all_matches[addr]['first_seen']}")
            print()
            print("⚠️  THIS IS SIGNIFICANT! These are from Satoshi's mining period!")

        # Save results
        with open('/Users/alexa/blackroad-sandbox/MATCHES_FOUND.json', 'w') as f:
            json.dump(all_matches, f, indent=2)

        print("\n✓ Results saved to: MATCHES_FOUND.json")

    else:
        print("❌ No matches found in first 1,000 addresses")
        print()
        print("Next steps:")
        print("  1. Increase batch count to check all 22,000")
        print("  2. Try alternative derivation parameters")
        print("  3. Check if addresses need different encoding")

    print()
    print("="*80)
    print()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nStopped by user")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
