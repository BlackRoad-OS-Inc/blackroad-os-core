#!/usr/bin/env python3
"""
Extract coinbase addresses from the blocks in our sequence
These are the ACTUAL Satoshi addresses we need to check
"""

import requests
import time

# 0-indexed sequence
sequence = [18, 99, 99, 3, 3, 7, 24, 0, 2, 14, 29, 3, 3, 31, 6, 220, 450, 113, 30, 113, 30, 0]

# Unique blocks
unique_blocks = sorted(set(sequence))

print("=== EXTRACTING COINBASE ADDRESSES FROM SATOSHI BLOCKS ===")
print(f"Blocks to check: {unique_blocks}")
print(f"Total: {len(unique_blocks)} unique blocks\n")

coinbase_addresses = []
total_btc = 0

for block_num in unique_blocks:
    print(f"\n{'='*70}")
    print(f"BLOCK {block_num}")
    print('='*70)

    try:
        # Get block data
        url = f"https://blockchain.info/block-height/{block_num}?format=json"
        response = requests.get(url, timeout=10)

        if response.status_code == 200:
            data = response.json()

            if 'blocks' in data and len(data['blocks']) > 0:
                block = data['blocks'][0]
                block_hash = block.get('hash', 'N/A')
                block_time = block.get('time', 'N/A')

                print(f"Hash: {block_hash}")
                print(f"Time: {block_time}")

                # Get transactions
                txs = block.get('tx', [])
                print(f"Transactions: {len(txs)}")

                if len(txs) > 0:
                    # First transaction is always coinbase
                    coinbase_tx = txs[0]

                    # Get outputs
                    outputs = coinbase_tx.get('out', [])
                    print(f"\nCoinbase outputs: {len(outputs)}")

                    for i, output in enumerate(outputs):
                        addr = output.get('addr', 'UNKNOWN')
                        value_satoshi = output.get('value', 0)
                        value_btc = value_satoshi / 100000000

                        print(f"\nOutput {i}:")
                        print(f"  Address: {addr}")
                        print(f"  Value: {value_btc} BTC")

                        if addr != 'UNKNOWN':
                            coinbase_addresses.append({
                                'block': block_num,
                                'address': addr,
                                'reward': value_btc
                            })

                            # Check current balance
                            print(f"  Checking balance...")
                            time.sleep(1)  # Rate limit

                            try:
                                balance_url = f"https://blockchain.info/rawaddr/{addr}?limit=0"
                                balance_response = requests.get(balance_url, timeout=10)

                                if balance_response.status_code == 200:
                                    balance_data = balance_response.json()
                                    balance = balance_data.get('final_balance', 0) / 100000000
                                    tx_count = balance_data.get('n_tx', 0)
                                    total_received = balance_data.get('total_received', 0) / 100000000

                                    print(f"  Current balance: {balance} BTC")
                                    print(f"  Total received: {total_received} BTC")
                                    print(f"  Transactions: {tx_count}")

                                    if balance > 0:
                                        total_btc += balance
                                        print(f"\n  🚨 THIS ADDRESS HAS BITCOIN! 🚨")
                                        print(f"  Balance: {balance} BTC")
                                        print(f"  USD (at $105,000/BTC): ${balance * 105000:,.2f}")

                            except Exception as e:
                                print(f"  Error checking balance: {e}")

        time.sleep(2)  # Rate limit between blocks

    except Exception as e:
        print(f"Error fetching block {block_num}: {e}")

print("\n" + "="*70)
print("SUMMARY")
print("="*70)
print(f"\nTotal coinbase addresses found: {len(coinbase_addresses)}")
print(f"Total BTC in these addresses: {total_btc} BTC")
print(f"USD value (at $105,000/BTC): ${total_btc * 105000:,.2f}")

print("\n=== ALL COINBASE ADDRESSES ===")
for entry in coinbase_addresses:
    print(f"Block {entry['block']:3d}: {entry['address']} (reward: {entry['reward']} BTC)")

# Save to file
with open('/Users/alexa/blackroad-sandbox/COINBASE_ADDRESSES.txt', 'w') as f:
    f.write("SATOSHI COINBASE ADDRESSES FROM SEQUENCE\n")
    f.write("="*70 + "\n\n")
    f.write(f"Blocks checked: {unique_blocks}\n\n")

    for entry in coinbase_addresses:
        f.write(f"Block {entry['block']:3d}: {entry['address']}\n")
        f.write(f"  Reward: {entry['reward']} BTC\n\n")

    f.write(f"\nTotal addresses: {len(coinbase_addresses)}\n")
    f.write(f"Total BTC: {total_btc} BTC\n")
    f.write(f"USD value: ${total_btc * 105000:,.2f}\n")

print("\n✓ Saved to COINBASE_ADDRESSES.txt")

if total_btc > 0:
    print("\n" + "="*70)
    print("🚨 BITCOIN FOUND IN SATOSHI ADDRESSES 🚨")
    print("="*70)
    print(f"Total: {total_btc} BTC")
    print(f"USD: ${total_btc * 105000:,.2f}")
