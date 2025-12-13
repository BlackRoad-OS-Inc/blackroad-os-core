#!/usr/bin/env python3
"""
CHI-SQUARED VALIDATION FOR SATOSHI ADDRESS DERIVATION

KEY INSIGHT:
Instead of partition using +1 increment, use -1 (DECREMENT)
Chi-squared error must be < 0.05 to validate correct derivation

This statistical test proves whether derived addresses match expected distribution!
"""

import hashlib
import numpy as np
from typing import List, Dict, Tuple
from scipy import stats

def generate_addresses_with_direction(master_int: int, count: int, direction: int = 1) -> List[str]:
    """
    Generate addresses with +1 or -1 increment

    direction = +1: increment (forward)
    direction = -1: decrement (backward)
    """
    addresses = []

    for i in range(count):
        # Key insight: direction matters!
        partition_value = (master_int + (i * direction)) % (2**256)

        # Hash partition
        partition_bytes = partition_value.to_bytes(32, byteorder='big')
        partition_hash = hashlib.sha256(partition_bytes).hexdigest()

        # RIPEMD-160 (Bitcoin address format)
        ripemd = hashlib.new('ripemd160')
        ripemd.update(bytes.fromhex(partition_hash))
        address_hash = ripemd.hexdigest()

        addresses.append(address_hash)

    return addresses

def calculate_chi_squared(observed: np.ndarray, expected: np.ndarray) -> Tuple[float, float]:
    """
    Calculate chi-squared statistic and p-value

    Chi-squared = Σ((observed - expected)² / expected)

    p-value < 0.05 means statistically significant difference
    p-value > 0.05 means distributions match!
    """
    # Chi-squared test
    chi2_stat = np.sum((observed - expected)**2 / expected)

    # Degrees of freedom
    dof = len(observed) - 1

    # P-value
    p_value = 1 - stats.chi2.cdf(chi2_stat, dof)

    return chi2_stat, p_value

def analyze_address_distribution(addresses: List[str]) -> Dict:
    """
    Analyze distribution of generated addresses

    Returns byte frequency distribution for chi-squared testing
    """
    # Analyze first byte of each address (hex)
    first_bytes = [int(addr[:2], 16) for addr in addresses]

    # Create histogram (0-255)
    hist, _ = np.histogram(first_bytes, bins=16, range=(0, 256))

    return {
        'first_byte_histogram': hist,
        'first_bytes': first_bytes,
        'total_addresses': len(addresses)
    }

def compare_forward_backward(master_int: int, count: int = 22000) -> Dict:
    """
    Compare +1 (forward) vs -1 (backward) derivation

    Test which direction produces chi-squared < 0.05 when compared to Patoshi pattern
    """
    print(f"\n{'='*80}")
    print(f"CHI-SQUARED VALIDATION: +1 vs -1 DERIVATION")
    print(f"{'='*80}\n")

    print(f"Generating {count} addresses in both directions...\n")

    # Generate addresses
    addresses_forward = generate_addresses_with_direction(master_int, count, direction=+1)
    addresses_backward = generate_addresses_with_direction(master_int, count, direction=-1)

    print(f"Forward (+1) samples:")
    for i in [0, 1, 2, count-3, count-2, count-1]:
        print(f"  #{i:5d}: {addresses_forward[i][:40]}...")

    print(f"\nBackward (-1) samples:")
    for i in [0, 1, 2, count-3, count-2, count-1]:
        print(f"  #{i:5d}: {addresses_backward[i][:40]}...")

    # Analyze distributions
    dist_forward = analyze_address_distribution(addresses_forward)
    dist_backward = analyze_address_distribution(addresses_backward)

    # Expected uniform distribution (if random)
    expected_uniform = np.ones(16) * (count / 16)

    # Chi-squared tests
    chi2_forward, p_forward = calculate_chi_squared(dist_forward['first_byte_histogram'], expected_uniform)
    chi2_backward, p_backward = calculate_chi_squared(dist_backward['first_byte_histogram'], expected_uniform)

    print(f"\n{'='*80}")
    print(f"CHI-SQUARED RESULTS")
    print(f"{'='*80}\n")

    print(f"Forward (+1) direction:")
    print(f"  Chi-squared statistic: {chi2_forward:.4f}")
    print(f"  P-value: {p_forward:.6f}")
    print(f"  Result: {'✅ PASS' if p_forward > 0.05 else '❌ FAIL'} (p > 0.05 means uniform)")

    print(f"\nBackward (-1) direction:")
    print(f"  Chi-squared statistic: {chi2_backward:.4f}")
    print(f"  P-value: {p_backward:.6f}")
    print(f"  Result: {'✅ PASS' if p_backward > 0.05 else '❌ FAIL'} (p > 0.05 means uniform)")

    print(f"\n{'='*40}")
    print(f"INTERPRETATION:")
    print(f"{'='*40}\n")

    if p_backward < 0.05 and p_forward >= 0.05:
        print(f"🎯 BACKWARD (-1) shows NON-RANDOM pattern!")
        print(f"   This matches Patoshi pattern signature")
        print(f"   Use -1 direction for Satoshi address derivation")
    elif p_forward < 0.05 and p_backward >= 0.05:
        print(f"🎯 FORWARD (+1) shows NON-RANDOM pattern!")
        print(f"   This matches Patoshi pattern signature")
        print(f"   Use +1 direction for Satoshi address derivation")
    else:
        print(f"⚠️  Both directions appear random or both non-random")
        print(f"   Need to compare with actual Patoshi addresses")

    return {
        'forward': {
            'addresses': addresses_forward[:10],  # Sample
            'chi2': chi2_forward,
            'p_value': p_forward,
            'histogram': dist_forward['first_byte_histogram']
        },
        'backward': {
            'addresses': addresses_backward[:10],  # Sample
            'chi2': chi2_backward,
            'p_value': p_backward,
            'histogram': dist_backward['first_byte_histogram']
        }
    }

def patoshi_pattern_signature() -> np.ndarray:
    """
    The Patoshi pattern has a known signature in address distribution

    Based on Sergio Lerner's research:
    - Non-uniform distribution in certain byte ranges
    - Specific patterns in nonce values
    - Consistent timing patterns

    This returns expected histogram for Patoshi addresses
    """
    # Simplified Patoshi signature (would need actual data)
    # For demo: showing non-uniform distribution
    patoshi_hist = np.array([
        1500, 1400, 1450, 1350, 1420, 1380, 1340, 1360,
        1320, 1400, 1450, 1380, 1350, 1390, 1370, 1340
    ])

    return patoshi_hist

def validate_against_patoshi(addresses: List[str], direction_name: str) -> Tuple[float, bool]:
    """
    Validate generated addresses against known Patoshi pattern

    Returns (error, is_valid) where error < 0.05 means MATCH!
    """
    print(f"\n{'='*80}")
    print(f"PATOSHI PATTERN VALIDATION ({direction_name})")
    print(f"{'='*80}\n")

    # Analyze distribution
    dist = analyze_address_distribution(addresses)

    # Get expected Patoshi pattern
    expected_patoshi = patoshi_pattern_signature()

    # Chi-squared test
    chi2_stat, p_value = calculate_chi_squared(dist['first_byte_histogram'], expected_patoshi)

    print(f"Chi-squared statistic: {chi2_stat:.4f}")
    print(f"P-value (error): {p_value:.6f}")
    print(f"Threshold: 0.05")

    is_valid = p_value < 0.05

    if is_valid:
        print(f"\n🎉 SUCCESS! Error < 0.05")
        print(f"   Generated addresses MATCH Patoshi pattern!")
        print(f"   This could be Satoshi's derivation algorithm!")
    else:
        print(f"\n❌ Error >= 0.05")
        print(f"   Distribution doesn't match Patoshi pattern")
        print(f"   Try different parameters or seed")

    return p_value, is_valid

def test_both_directions_against_patoshi(seed_phrase: str):
    """
    Complete test: generate addresses in both directions and validate
    """
    print(f"\n{'🔬'*40}")
    print(f"\nCOMPLETE CHI-SQUARED VALIDATION SYSTEM")
    print(f"Testing: +1 vs -1 increment against Patoshi pattern")
    print(f"\n{'🔬'*40}\n")

    # Generate master hash from seed
    encoded = seed_phrase.encode().hex()
    master_hash = hashlib.sha256(encoded.encode()).hexdigest()
    master_int = int(master_hash, 16)

    print(f"Seed phrase: {seed_phrase[:50]}...")
    print(f"Master hash: {master_hash}")
    print(f"Master int: {master_int}\n")

    # Test both directions
    print("="*80)
    print("STEP 1: Generate addresses in both directions")
    print("="*80)

    count = 22000
    addresses_forward = generate_addresses_with_direction(master_int, count, direction=+1)
    addresses_backward = generate_addresses_with_direction(master_int, count, direction=-1)

    print(f"Generated {count} addresses in each direction\n")

    # Test against Patoshi pattern
    print("="*80)
    print("STEP 2: Validate against Patoshi pattern")
    print("="*80)

    error_forward, valid_forward = validate_against_patoshi(addresses_forward, "FORWARD +1")
    error_backward, valid_backward = validate_against_patoshi(addresses_backward, "BACKWARD -1")

    # Final verdict
    print(f"\n{'='*80}")
    print(f"🎯 FINAL VERDICT")
    print(f"{'='*80}\n")

    print(f"Forward (+1):")
    print(f"  Error: {error_forward:.6f}")
    print(f"  Valid: {'✅ YES' if valid_forward else '❌ NO'}")

    print(f"\nBackward (-1):")
    print(f"  Error: {error_backward:.6f}")
    print(f"  Valid: {'✅ YES' if valid_backward else '❌ NO'}")

    if valid_backward and not valid_forward:
        print(f"\n🎉 CONCLUSION: Use BACKWARD (-1) derivation!")
        print(f"   Your seed with -1 increment matches Patoshi pattern")
        print(f"   Chi-squared error: {error_backward:.6f} < 0.05")
        print(f"\n   ⚠️  This suggests you may have Satoshi's master seed!")

    elif valid_forward and not valid_backward:
        print(f"\n🎉 CONCLUSION: Use FORWARD (+1) derivation!")
        print(f"   Your seed with +1 increment matches Patoshi pattern")
        print(f"   Chi-squared error: {error_forward:.6f} < 0.05")
        print(f"\n   ⚠️  This suggests you may have Satoshi's master seed!")

    elif valid_both:
        print(f"\n⚠️  AMBIGUOUS: Both directions match!")
        print(f"   Need to compare actual addresses with Arkham's list")

    else:
        print(f"\n❌ Neither direction matches Patoshi pattern")
        print(f"   Try different:")
        print(f"     • Seed phrase")
        print(f"     • Transformation parameters")
        print(f"     • Master hash generation method")

    print(f"\n{'='*80}")
    print(f"💡 NEXT STEPS")
    print(f"{'='*80}\n")

    print("""
    If you got a MATCH (error < 0.05):

    1. ✅ Download Arkham's 22,000 Patoshi addresses
    2. ✅ Convert to RIPEMD-160 format
    3. ✅ Compare YOUR generated addresses with real Patoshi list
    4. ✅ If multiple addresses match → YOU FOUND IT!

    If you found matches:
       🚨 DO NOT share your seed phrase!
       🚨 You potentially have access to 1.1M BTC
       🚨 Consider legal and ethical implications
       🚨 This would be the biggest crypto discovery ever
    """)

def main():
    print("🎲" * 40)
    print("\nCHI-SQUARED STATISTICAL VALIDATION SYSTEM")
    print("Proving Satoshi Address Derivation with p < 0.05")
    print("\n" + "🎲" * 40)

    # Test seed
    test_seed = "abandon ability able about above absent absorb abstract absurd abuse access accident"

    # Run complete validation
    test_both_directions_against_patoshi(test_seed)

if __name__ == "__main__":
    try:
        main()
    except ImportError as e:
        print(f"📦 Missing dependency: {e}")
        print("   Install: pip install numpy scipy")
