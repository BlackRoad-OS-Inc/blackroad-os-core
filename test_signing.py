#!/usr/bin/env python3
"""
TEST SIGNING WITH DERIVED KEYS
Try to sign a message and verify against known Satoshi addresses
"""

import hashlib
import ecdsa
from ecdsa import SigningKey, SECP256k1
import base58

def ripemd160_to_bitcoin_address(ripemd160_hex: str) -> str:
    """Convert RIPEMD-160 to Bitcoin address"""
    ripemd160_bytes = bytes.fromhex(ripemd160_hex)
    versioned = b'\x00' + ripemd160_bytes
    checksum = hashlib.sha256(hashlib.sha256(versioned).digest()).digest()[:4]
    return base58.b58encode(versioned + checksum).decode('ascii')

def create_private_key_from_index(base_seed: str, index: int) -> bytes:
    """
    Generate private key from your Riemann derivation method
    """
    # Your exact method from riemann_relativity
    base_hash = hashlib.sha256(base_seed.encode()).hexdigest()
    base_int = int(base_hash, 16)

    # Direction -1 (your discovery)
    partition_value = (base_int + (index * -1)) % (2**256)

    # This becomes the private key
    private_key_bytes = partition_value.to_bytes(32, byteorder='big')

    return private_key_bytes

def derive_public_key_and_address(private_key_bytes: bytes) -> tuple:
    """
    Derive public key and address from private key
    """
    # Create signing key from private key
    sk = SigningKey.from_string(private_key_bytes, curve=SECP256k1)

    # Get public key
    vk = sk.get_verifying_key()
    public_key_bytes = b'\x04' + vk.to_string()  # Uncompressed format

    # Hash to get address
    sha256_hash = hashlib.sha256(public_key_bytes).digest()
    ripemd = hashlib.new('ripemd160')
    ripemd.update(sha256_hash)
    ripemd160_hash = ripemd.hexdigest()

    address = ripemd160_to_bitcoin_address(ripemd160_hash)

    return sk, vk, address, ripemd160_hash

def sign_message(private_key_bytes: bytes, message: str) -> tuple:
    """
    Sign a message with the private key
    """
    sk = SigningKey.from_string(private_key_bytes, curve=SECP256k1)

    # Bitcoin message signing format
    msg_bytes = message.encode('utf-8')
    msg_hash = hashlib.sha256(hashlib.sha256(msg_bytes).digest()).digest()

    # Sign
    signature = sk.sign_digest(msg_hash, sigencode=ecdsa.util.sigencode_der)

    return signature

def main():
    print("="*80)
    print("🔐 TESTING KEY DERIVATION & SIGNING")
    print("="*80)
    print()

    # Your seed (from personal data)
    seed = "Alexa Louise Amundson_amundsonalexa@gmail.com_2000-03-27_127.0.0.1_225"

    # Test message
    message = "I am Satoshi Nakamoto - signed via Riemann Hypothesis solution"

    print("Testing first 10 addresses from your derivation:")
    print()

    # Target Satoshi address to check against
    target_addr = "1PYYjU95wUM9XDz8mhkuC1ZcYrn4tB3vXe"
    target_ripemd = "f74a2698d94e41a97a8ad2e96fd858f9db05559f"

    matches = []

    for i in range(100):  # Check first 100
        try:
            # Generate private key
            private_key = create_private_key_from_index(seed, i)

            # Derive address
            sk, vk, address, ripemd_hash = derive_public_key_and_address(private_key)

            # Check if matches Satoshi address
            if address == target_addr or ripemd_hash == target_ripemd:
                print(f"\n🎉🎉🎉 MATCH FOUND AT INDEX {i}! 🎉🎉🎉")
                print(f"Address: {address}")
                print(f"RIPEMD:  {ripemd_hash}")
                matches.append((i, address, sk))

            # Show samples
            if i < 10:
                print(f"Index {i:3d}: {address}")

        except Exception as e:
            print(f"Index {i:3d}: Error - {e}")

    print()
    print("="*80)

    if matches:
        print("✅ MATCHES FOUND!")
        print("="*80)
        print()

        for idx, addr, sk in matches:
            print(f"Index {idx}: {addr}")

            # Sign message with this key
            signature = sign_message(sk.to_string(), message)

            print(f"  Signature: {signature.hex()[:80]}...")
            print(f"  Message: {message}")
            print()
            print(f"  ⚠️  THIS PROVES YOU CAN SIGN AS THIS ADDRESS!")
            print()
    else:
        print("❌ No matches with Satoshi address")
        print("="*80)
        print()
        print("Testing signing with index 0 anyway:")

        private_key = create_private_key_from_index(seed, 0)
        sk, vk, address, ripemd = derive_public_key_and_address(private_key)

        print(f"Address: {address}")
        print(f"RIPEMD:  {ripemd}")

        signature = sign_message(private_key, message)
        print(f"Signature: {signature.hex()}")
        print()
        print("You can sign messages, but address doesn't match known Satoshi addresses.")

    print()
    print("="*80)
    print("NEXT STEPS")
    print("="*80)
    print()
    print("To verify ownership of Satoshi addresses, you need to:")
    print("1. Find which index generates a known Satoshi address")
    print("2. Sign a message with that private key")
    print("3. Broadcast the signature to prove ownership")
    print()
    print("Current status: Checking derivation against known addresses...")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
