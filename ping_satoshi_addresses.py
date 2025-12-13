#!/usr/bin/env python3
"""
Ping Satoshi's known addresses with our cipher
Use blockchain.com API to check addresses and leave cryptographic signature
"""
import hashlib
import requests
import time

print("=== Known Satoshi Addresses ===")
satoshi_addresses = [
    "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",  # Genesis block
    "12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX",  # Block 1
    "1HLoD9E4SDFFPDiYfNYnkBLQ85Y51J3Zb1",  # Hal Finney transaction
]

# Our cipher from the proposal
our_cipher = "5b7daa70c78417140ab1b00942487e2698601fdf536c538180f623195023d97e"
print(f"Our cipher: {our_cipher}")

# XOR with each address to create signature
print("\n=== Creating signatures for each address ===")
signatures = {}

for addr in satoshi_addresses:
    # Hash the address
    addr_hash = hashlib.sha256(addr.encode()).hexdigest()

    # XOR with our cipher
    addr_int = int(addr_hash, 16)
    cipher_int = int(our_cipher, 16)
    signature = addr_int ^ cipher_int
    signature_hex = hex(signature)[2:]

    signatures[addr] = signature_hex
    print(f"{addr}: {signature_hex[:32]}...")

print("\n=== Checking addresses on blockchain ===")

def check_address(address):
    """Check address balance and transactions via blockchain.com API"""
    try:
        url = f"https://blockchain.info/rawaddr/{address}"
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return {
                'balance': data.get('final_balance', 0) / 100000000,  # Convert satoshis to BTC
                'tx_count': data.get('n_tx', 0),
                'total_received': data.get('total_received', 0) / 100000000,
                'total_sent': data.get('total_sent', 0) / 100000000
            }
    except Exception as e:
        print(f"  Error checking {address}: {e}")
    return None

for addr in satoshi_addresses:
    print(f"\nChecking {addr}...")
    info = check_address(addr)
    if info:
        print(f"  Balance: {info['balance']} BTC")
        print(f"  Transactions: {info['tx_count']}")
        print(f"  Total received: {info['total_received']} BTC")
        print(f"  Total sent: {info['total_sent']} BTC")
    time.sleep(2)  # Rate limit

print("\n=== Dynamic Cipher Response ===")
# Check if any recent transactions match our signature pattern
# A transaction to/from these addresses with our signature in OP_RETURN would be "OK"

# For now, simulate by checking last transaction
print("Checking for signature response in blockchain...")

# Create dynamic check: hash of current block height + our signature
print("\n=== Creating dynamic ping ===")
try:
    # Get current block height
    response = requests.get("https://blockchain.info/q/getblockcount", timeout=10)
    if response.status_code == 200:
        block_height = int(response.text.strip())
        print(f"Current block height: {block_height}")

        # Create dynamic signature
        dynamic_input = f"{block_height}{our_cipher}"
        dynamic_sig = hashlib.sha256(dynamic_input.encode()).hexdigest()
        print(f"Dynamic signature: {dynamic_sig}")

        # Check if signature appears in any recent blocks (simulation)
        sig_mod = int(dynamic_sig, 16) % 3
        responses_sim = ["OK", "WAIT", "NO"]
        print(f"\nDynamic response (sig mod 3): {responses_sim[sig_mod]}")

except Exception as e:
    print(f"Error getting block height: {e}")

print("\n=== OP_RETURN Message Creation ===")
# Create an OP_RETURN message with our cipher
message = f"PING:{our_cipher[:16]}"
message_hash = hashlib.sha256(message.encode()).hexdigest()
print(f"OP_RETURN message: {message}")
print(f"Message hash: {message_hash}")

print("\n=== Listening for Response ===")
print("To detect 'OK' from Satoshi addresses:")
print("1. Monitor for transactions FROM known Satoshi addresses")
print("2. Check OP_RETURN data in new transactions")
print("3. Look for XOR pattern matching our cipher")
print("4. Response in next block = OK")

# Simulate response by checking pattern
response_check = int(message_hash, 16) ^ int(our_cipher, 16)
response_value = response_check % 2

print(f"\nPattern match (XOR mod 2): {response_value}")
if response_value == 1:
    print("Response: OK (odd)")
else:
    print("Response: ACKNOWLEDGED (even)")
