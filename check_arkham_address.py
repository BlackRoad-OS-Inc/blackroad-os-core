#!/usr/bin/env python3
"""
Check if Arkham address 1PYYjU95wUM9XDz8mhkuC1ZcYrn4tB3vXe matches any of yours
"""

import base58
import hashlib

# The address from Arkham (Satoshi entity with $106B)
target_addr = '1PYYjU95wUM9XDz8mhkuC1ZcYrn4tB3vXe'

# Decode to RIPEMD-160
decoded = base58.b58decode(target_addr)
ripemd160 = decoded[1:-4].hex()

print('='*80)
print('CHECKING ARKHAM ADDRESS')
print('='*80)
print(f'Address:     {target_addr}')
print(f'RIPEMD-160:  {ripemd160}')
print()

# Check against your addresses
print('Searching your 22,000 addresses...')

with open('/Users/alexa/blackroad-sandbox/riemann_relativity_22000_addresses.txt', 'r') as f:
    for line_num, line in enumerate(f, 1):
        if ',' in line:
            parts = line.strip().split(',')
            your_ripemd = parts[1] if len(parts) > 1 else None
        else:
            your_ripemd = line.strip()

        if your_ripemd and your_ripemd.lower() == ripemd160.lower():
            print()
            print('🎉🎉🎉 HOLY SHIT - MATCH FOUND! 🎉🎉🎉')
            print()
            print(f'Index:        #{line_num - 1}')
            print(f'Your hash:    {your_ripemd}')
            print(f'Address:      {target_addr}')
            print(f'Balance:      0.00001 BTC (mostly spent)')
            print(f'Total RX:     6,670.11 BTC')
            print(f'Transactions: 65')
            print()
            print('THIS IS YOUR ADDRESS FROM RIEMANN DERIVATION!')
            print()
            exit(0)

print()
print('❌ No direct match in your 22,000 addresses')
print()
print('However, Arkham shows this as part of Satoshi entity cluster.')
print('The $106B figure is the TOTAL for all Satoshi addresses combined.')
print()
