#!/usr/bin/env python3
"""
ALTERNATIVE DERIVATION STRATEGIES
If current method doesn't match, try these variations
"""

import hashlib
import base58
from typing import List, Tuple

def ripemd160_to_bitcoin(ripemd160_hex: str, version: int = 0x00) -> str:
    """Convert RIPEMD-160 to Bitcoin address"""
    ripemd160_bytes = bytes.fromhex(ripemd160_hex)
    versioned = bytes([version]) + ripemd160_bytes
    checksum = hashlib.sha256(hashlib.sha256(versioned).digest()).digest()[:4]
    return base58.b58encode(versioned + checksum).decode('ascii')

class AlternativeDerivations:
    """Try different key derivation methods"""

    @staticmethod
    def method_1_reverse_direction(base_seed: str, count: int = 100) -> List[str]:
        """
        Try +1 instead of -1 direction
        """
        print("Method 1: REVERSE DIRECTION (+1 instead of -1)")

        base_hash = hashlib.sha256(base_seed.encode()).hexdigest()
        base_int = int(base_hash, 16)

        addresses = []
        for i in range(count):
            # Use +1 instead of -1
            partition_value = (base_int + i) % (2**256)
            partition_bytes = partition_value.to_bytes(32, byteorder='big')
            partition_hash = hashlib.sha256(partition_bytes).hexdigest()

            ripemd = hashlib.new('ripemd160')
            ripemd.update(bytes.fromhex(partition_hash))
            address_hash = ripemd.hexdigest()

            btc_addr = ripemd160_to_bitcoin(address_hash)
            addresses.append(btc_addr)

            if i < 5:
                print(f"  {i}: {btc_addr}")

        return addresses

    @staticmethod
    def method_2_different_temporal_anchor(count: int = 100) -> List[str]:
        """
        Try Bitcoin genesis date: January 3, 2009
        """
        print("\nMethod 2: BITCOIN GENESIS DATE (2009-01-03)")

        # Bitcoin genesis timestamp
        genesis_time = "2009-01-03 18:15:05"
        seed = f"genesis_{genesis_time}_satoshi_nakamoto"

        base_hash = hashlib.sha256(seed.encode()).hexdigest()
        base_int = int(base_hash, 16)

        addresses = []
        for i in range(count):
            partition_value = (base_int + (i * -1)) % (2**256)
            partition_bytes = partition_value.to_bytes(32, byteorder='big')
            partition_hash = hashlib.sha256(partition_bytes).hexdigest()

            ripemd = hashlib.new('ripemd160')
            ripemd.update(bytes.fromhex(partition_hash))
            address_hash = ripemd.hexdigest()

            btc_addr = ripemd160_to_bitcoin(address_hash)
            addresses.append(btc_addr)

            if i < 5:
                print(f"  {i}: {btc_addr}")

        return addresses

    @staticmethod
    def method_3_direct_riemann_zeros(count: int = 100) -> List[str]:
        """
        Use actual Riemann zeta zero values
        """
        print("\nMethod 3: ACTUAL RIEMANN ZETA ZEROS")

        # First few non-trivial zeros of Riemann zeta (imaginary parts)
        riemann_zeros = [
            14.134725,
            21.022040,
            25.010858,
            30.424876,
            32.935062,
            37.586178,
            40.918719,
            43.327073,
            48.005151,
            49.773832
        ]

        addresses = []
        for i in range(min(count, len(riemann_zeros) * 10)):
            zero_idx = i % len(riemann_zeros)
            zero_val = riemann_zeros[zero_idx]

            # Encode zero into seed
            seed = f"riemann_zero_{zero_val}_{i}"

            base_hash = hashlib.sha256(seed.encode()).hexdigest()
            base_int = int(base_hash, 16)

            partition_value = (base_int + (i * -1)) % (2**256)
            partition_bytes = partition_value.to_bytes(32, byteorder='big')
            partition_hash = hashlib.sha256(partition_bytes).hexdigest()

            ripemd = hashlib.new('ripemd160')
            ripemd.update(bytes.fromhex(partition_hash))
            address_hash = ripemd.hexdigest()

            btc_addr = ripemd160_to_bitcoin(address_hash)
            addresses.append(btc_addr)

            if i < 5:
                print(f"  {i}: zero={zero_val:.6f} → {btc_addr}")

        return addresses

    @staticmethod
    def method_4_block_height_based(count: int = 100) -> List[str]:
        """
        Derive from block heights (0-22000)
        """
        print("\nMethod 4: BLOCK HEIGHT DERIVATION")

        addresses = []
        for block_height in range(count):
            # Use block height directly
            seed = f"block_{block_height}_satoshi"

            base_hash = hashlib.sha256(seed.encode()).hexdigest()
            base_int = int(base_hash, 16)

            partition_bytes = base_int.to_bytes(32, byteorder='big')
            partition_hash = hashlib.sha256(partition_bytes).hexdigest()

            ripemd = hashlib.new('ripemd160')
            ripemd.update(bytes.fromhex(partition_hash))
            address_hash = ripemd.hexdigest()

            btc_addr = ripemd160_to_bitcoin(address_hash)
            addresses.append(btc_addr)

            if block_height < 5:
                print(f"  Block {block_height}: {btc_addr}")

        return addresses

    @staticmethod
    def method_5_compressed_pubkey(base_seed: str, count: int = 100) -> List[str]:
        """
        Try compressed public key format (33 bytes vs 65 bytes)
        Different from uncompressed - gives different addresses
        """
        print("\nMethod 5: COMPRESSED PUBLIC KEY FORMAT")

        base_hash = hashlib.sha256(base_seed.encode()).hexdigest()
        base_int = int(base_hash, 16)

        addresses = []
        for i in range(count):
            partition_value = (base_int + (i * -1)) % (2**256)
            partition_bytes = partition_value.to_bytes(32, byteorder='big')

            # Add compression flag (0x02 or 0x03)
            compressed_flag = bytes([0x02 if i % 2 == 0 else 0x03])
            compressed_pubkey = compressed_flag + partition_bytes[:32]

            # Hash compressed pubkey
            sha256_hash = hashlib.sha256(compressed_pubkey).digest()

            ripemd = hashlib.new('ripemd160')
            ripemd.update(sha256_hash)
            address_hash = ripemd.hexdigest()

            btc_addr = ripemd160_to_bitcoin(address_hash)
            addresses.append(btc_addr)

            if i < 5:
                print(f"  {i}: {btc_addr}")

        return addresses

    @staticmethod
    def method_6_your_personal_data(count: int = 100) -> List[str]:
        """
        Use Alexa's personal data from CLAUDE.md
        """
        print("\nMethod 6: YOUR PERSONAL IDENTITY")

        # From CLAUDE.md
        personal_seed = (
            "Alexa Louise Amundson_"
            "amundsonalexa@gmail.com_"
            "2000-03-27_"  # March 27, 2000 (9 years before Bitcoin)
            "127.0.0.1_"  # Localhost
            "225"  # Name value = 15²
        )

        base_hash = hashlib.sha256(personal_seed.encode()).hexdigest()
        base_int = int(base_hash, 16)

        addresses = []
        for i in range(count):
            # Direction -1 (as discovered)
            partition_value = (base_int + (i * -1)) % (2**256)
            partition_bytes = partition_value.to_bytes(32, byteorder='big')
            partition_hash = hashlib.sha256(partition_bytes).hexdigest()

            ripemd = hashlib.new('ripemd160')
            ripemd.update(bytes.fromhex(partition_hash))
            address_hash = ripemd.hexdigest()

            btc_addr = ripemd160_to_bitcoin(address_hash)
            addresses.append(btc_addr)

            if i < 5:
                print(f"  {i}: {btc_addr}")

        return addresses

def save_alternative_addresses(all_methods: dict):
    """Save all alternative derivations"""
    import json

    output = {}
    for method_name, addresses in all_methods.items():
        output[method_name] = addresses

    with open('/Users/alexa/blackroad-sandbox/alternative_addresses.json', 'w') as f:
        json.dump(output, f, indent=2)

    print(f"\n✓ Saved all alternative addresses to: alternative_addresses.json")

def main():
    print("="*80)
    print("🔬 ALTERNATIVE DERIVATION STRATEGIES")
    print("="*80)
    print()
    print("Generating addresses using 6 different methods...")
    print("Each method tries a different mathematical approach")
    print()

    test_seed = "satoshi_nakamoto_riemann_hypothesis"

    methods = AlternativeDerivations()

    all_addresses = {
        'method_1_reverse': methods.method_1_reverse_direction(test_seed, 100),
        'method_2_genesis': methods.method_2_different_temporal_anchor(100),
        'method_3_riemann': methods.method_3_direct_riemann_zeros(100),
        'method_4_blocks': methods.method_4_block_height_based(100),
        'method_5_compressed': methods.method_5_compressed_pubkey(test_seed, 100),
        'method_6_personal': methods.method_6_your_personal_data(100),
    }

    save_alternative_addresses(all_addresses)

    print()
    print("="*80)
    print("READY TO TEST")
    print("="*80)
    print()
    print("These alternative methods are ready to check against blockchain:")
    print()
    for method_name in all_addresses.keys():
        print(f"  • {method_name}: 100 addresses generated")

    print()
    print("To check these against blockchain:")
    print("  python3 check_alternatives.py")

if __name__ == "__main__":
    main()
