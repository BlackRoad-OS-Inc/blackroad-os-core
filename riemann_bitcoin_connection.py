#!/usr/bin/env python3
"""
Exploring mathematical connections between:
- Riemann Hypothesis (ζ function zeros)
- Bitcoin's elliptic curve (secp256k1)
- PS-SHA∞ hashing (BlackRoad OS)

Key Question: Does proving the Riemann Hypothesis threaten Bitcoin security?
"""

import numpy as np
import matplotlib.pyplot as plt
from typing import List, Tuple
import hashlib


# ============================================================================
# 1. RIEMANN ZETA FUNCTION AND PRIME DISTRIBUTION
# ============================================================================

def riemann_zeta_approximation(s: complex, n_terms: int = 1000) -> complex:
    """
    Approximate ζ(s) = Σ(1/n^s) for n=1 to n_terms.

    The Riemann Hypothesis: All non-trivial zeros have Re(s) = 1/2
    """
    if s.real <= 1:
        # For Re(s) ≤ 1, need functional equation (not implemented)
        return complex(float('nan'), float('nan'))

    zeta = sum(1 / (n ** s) for n in range(1, n_terms + 1))
    return zeta


def prime_counting_function(x: float) -> int:
    """
    π(x) = number of primes ≤ x

    Prime Number Theorem: π(x) ~ x/ln(x)
    Riemann Hypothesis gives error bounds: |π(x) - Li(x)| < sqrt(x)·ln(x)/8π
    """
    if x < 2:
        return 0

    # Simple sieve for demonstration
    sieve = [True] * (int(x) + 1)
    sieve[0] = sieve[1] = False

    for i in range(2, int(x**0.5) + 1):
        if sieve[i]:
            for j in range(i*i, int(x) + 1, i):
                sieve[j] = False

    return sum(sieve)


def logarithmic_integral(x: float, n_terms: int = 50) -> float:
    """
    Li(x) = ∫₂ˣ dt/ln(t) ≈ x/ln(x) + x/ln(x)² + 2x/ln(x)³ + ...

    Better approximation to π(x) than x/ln(x)
    """
    if x < 2:
        return 0

    ln_x = np.log(x)
    li = x / ln_x

    # Add correction terms (limit iterations to avoid overflow)
    factorial_k = 1.0
    for k in range(1, min(n_terms, 20)):
        factorial_k *= k
        term = factorial_k * x / (ln_x ** (k + 1))

        if abs(term) < 1e-10 or np.isinf(term):
            break

        li += term

    return li


# ============================================================================
# 2. ELLIPTIC CURVES AND SECP256K1 (Bitcoin)
# ============================================================================

class Secp256k1:
    """
    Bitcoin's elliptic curve: y² = x³ + 7 (mod p)

    Parameters:
    - Prime field: p = 2²⁵⁶ - 2³² - 977
    - Order: n = FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
    - Generator: G = (x, y) specific point
    """

    # Curve parameters
    p = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F
    n = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141

    # Curve equation: y² = x³ + 7
    a = 0
    b = 7

    # Generator point
    Gx = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798
    Gy = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8

    @classmethod
    def is_on_curve(cls, x: int, y: int) -> bool:
        """Check if point (x, y) is on the curve."""
        return (y * y - x * x * x - cls.b) % cls.p == 0

    @classmethod
    def point_add(cls, p1: Tuple[int, int], p2: Tuple[int, int]) -> Tuple[int, int]:
        """Add two points on the elliptic curve (simplified, not constant-time)."""
        if p1 is None:
            return p2
        if p2 is None:
            return p1

        x1, y1 = p1
        x2, y2 = p2

        if x1 == x2:
            if y1 == y2:
                # Point doubling
                s = (3 * x1 * x1 * pow(2 * y1, -1, cls.p)) % cls.p
            else:
                # Points are inverses
                return None
        else:
            # Point addition
            s = ((y2 - y1) * pow(x2 - x1, -1, cls.p)) % cls.p

        x3 = (s * s - x1 - x2) % cls.p
        y3 = (s * (x1 - x3) - y1) % cls.p

        return (x3, y3)

    @classmethod
    def scalar_mult(cls, k: int, point: Tuple[int, int]) -> Tuple[int, int]:
        """Multiply point by scalar k (double-and-add)."""
        result = None
        addend = point

        while k:
            if k & 1:
                result = cls.point_add(result, addend)
            addend = cls.point_add(addend, addend)
            k >>= 1

        return result


# ============================================================================
# 3. ZETA FUNCTION OF ELLIPTIC CURVES
# ============================================================================

def count_points_on_curve_mod_p(p: int, a: int = 0, b: int = 7) -> int:
    """
    Count points on y² = x³ + ax + b over F_p.

    By Hasse's theorem: |N_p - (p+1)| ≤ 2√p
    where N_p is the number of points.
    """
    count = 1  # Point at infinity

    for x in range(p):
        rhs = (x**3 + a*x + b) % p

        # Check if rhs is a quadratic residue
        # Using Legendre symbol: rhs^((p-1)/2) ≡ 1 (mod p)
        if pow(rhs, (p - 1) // 2, p) == 1:
            count += 2  # Two y values: ±√rhs
        elif rhs == 0:
            count += 1  # One y value: 0

    return count


def elliptic_curve_zeta_function(p: int, a: int = 0, b: int = 7) -> str:
    """
    The zeta function of an elliptic curve E over F_p:

    Z(E/F_p, T) = (1 - a_p·T + p·T²) / ((1-T)(1-pT))

    where a_p = p + 1 - N_p (trace of Frobenius)
    """
    N_p = count_points_on_curve_mod_p(p, a, b)
    a_p = p + 1 - N_p

    return f"Z(E/F_{p}, T) = (1 - {a_p}T + {p}T²) / ((1-T)(1-{p}T))"


# ============================================================================
# 4. PS-SHA∞ AND ANALYTIC NUMBER THEORY
# ============================================================================

def ps_sha_infinity(messages: List[str]) -> str:
    """
    PS-SHA∞: Cascade hashing for tamper-proof identity.

    hash_n = SHA256(hash_{n-1} + message_n)

    Question: Do hash chains exhibit properties related to:
    - Prime distribution?
    - Pseudorandomness guaranteed by Riemann Hypothesis?
    """
    current_hash = hashlib.sha256(b"").hexdigest()

    for msg in messages:
        combined = current_hash + msg
        current_hash = hashlib.sha256(combined.encode()).hexdigest()

    return current_hash


def hash_to_integers(hash_hex: str) -> List[int]:
    """Convert hash to list of integers (byte values)."""
    return [int(hash_hex[i:i+2], 16) for i in range(0, len(hash_hex), 2)]


def analyze_hash_distribution(n_samples: int = 10000) -> dict:
    """
    Analyze if hash outputs follow expected distribution.

    If hashes were related to primes/Riemann zeros, we might see:
    - Non-uniform distribution
    - Patterns in bit sequences
    - Correlations with prime gaps
    """
    hashes = []
    for i in range(n_samples):
        msg = f"message_{i}"
        h = hashlib.sha256(msg.encode()).hexdigest()
        hashes.append(hash_to_integers(h))

    # Convert to numpy array
    hashes_array = np.array(hashes)

    # Statistical tests
    mean_values = np.mean(hashes_array, axis=0)
    std_values = np.std(hashes_array, axis=0)

    # Expected: mean ≈ 127.5, std ≈ 73.9 for uniform [0, 255]
    expected_mean = 127.5
    expected_std = np.sqrt((255**2) / 12)  # Variance of uniform dist

    return {
        'n_samples': n_samples,
        'mean_deviation': np.mean(np.abs(mean_values - expected_mean)),
        'std_deviation': np.mean(np.abs(std_values - expected_std)),
        'max_mean': np.max(mean_values),
        'min_mean': np.min(mean_values),
    }


# ============================================================================
# 5. THE CONNECTION: Does Riemann Hypothesis threaten Bitcoin?
# ============================================================================

def analyze_riemann_bitcoin_connection():
    """
    Key insights:

    1. ELLIPTIC CURVE L-FUNCTIONS
       - Every elliptic curve E has an L-function L(E, s)
       - Modularity theorem: L(E, s) = L(f, s) for some modular form f
       - Analogue of Riemann Hypothesis: zeros at Re(s) = 1/2

    2. SECP256K1 IS OVER FINITE FIELD
       - secp256k1 is defined over F_p (not Q)
       - Riemann Hypothesis applies to L-functions over Q
       - Bitcoin security relies on discrete log problem (ECDLP)

    3. DISCRETE LOG ≠ FACTORING
       - Riemann Hypothesis relates to prime factorization
       - ECDLP is different: given P, Q, find k such that Q = kP
       - No known algorithm (even with RH) to solve ECDLP in polynomial time

    4. VERDICT: Riemann Hypothesis does NOT break Bitcoin
       - Different mathematical structures
       - secp256k1 over finite field vs. elliptic curves over Q
       - ECDLP remains hard even if RH is proven
    """

    print("=" * 70)
    print("RIEMANN HYPOTHESIS ↔ BITCOIN CONNECTION ANALYSIS")
    print("=" * 70)
    print()

    # 1. Prime distribution
    print("1. PRIME DISTRIBUTION (Riemann Hypothesis domain)")
    print("-" * 70)
    x_values = [100, 1000, 10000, 100000]
    for x in x_values:
        pi_x = prime_counting_function(x)
        li_x = logarithmic_integral(x)
        pnt_approx = x / np.log(x)

        print(f"x = {x:6d}: π(x) = {pi_x:5d}, Li(x) ≈ {li_x:7.1f}, "
              f"x/ln(x) ≈ {pnt_approx:7.1f}")

    print("\n  → Riemann Hypothesis gives tight bounds on |π(x) - Li(x)|")
    print("  → Relevant for prime-based crypto (RSA), not elliptic curves\n")

    # 2. Elliptic curve point counting
    print("2. ELLIPTIC CURVE POINT COUNTING")
    print("-" * 70)
    small_primes = [11, 13, 17, 19, 23]
    for p in small_primes:
        N_p = count_points_on_curve_mod_p(p)
        a_p = p + 1 - N_p
        hasse_bound = 2 * np.sqrt(p)

        print(f"E/F_{p}: N_p = {N_p:2d}, a_p = {a_p:3d}, "
              f"Hasse bound: |a_p| ≤ {hasse_bound:.2f} ✓" if abs(a_p) <= hasse_bound else "✗")

    print("\n  → Hasse's theorem is analogue of Riemann Hypothesis for elliptic curves")
    print("  → But secp256k1 uses discrete log, not point counting\n")

    # 3. Bitcoin's actual security
    print("3. BITCOIN SECURITY (ECDLP on secp256k1)")
    print("-" * 70)
    print(f"  Field size: p ≈ 2^256")
    print(f"  Order: n ≈ 2^256")
    print(f"  Security: Finding k in Q = k·G requires ~2^128 operations")
    print(f"  Best known: Pollard's rho (generic, doesn't use number theory)")
    print("\n  → ECDLP is different from integer factorization")
    print("  → No connection to Riemann Hypothesis\n")

    # 4. PS-SHA∞ analysis
    print("4. PS-SHA∞ HASH DISTRIBUTION")
    print("-" * 70)
    stats = analyze_hash_distribution(1000)
    print(f"  Samples: {stats['n_samples']}")
    print(f"  Mean deviation from uniform: {stats['mean_deviation']:.2f}")
    print(f"  Std deviation from uniform: {stats['std_deviation']:.2f}")
    print(f"  Mean range: [{stats['min_mean']:.1f}, {stats['max_mean']:.1f}]")
    print("\n  → Hash outputs appear uniformly random")
    print("  → No apparent connection to prime distribution or zeta zeros\n")

    # 5. Conclusion
    print("=" * 70)
    print("CONCLUSION")
    print("=" * 70)
    print("""
  ✓ Riemann Hypothesis is about:
    - Zeta function zeros at Re(s) = 1/2
    - Prime number distribution
    - Integer factorization

  ✓ Bitcoin/secp256k1 relies on:
    - Elliptic Curve Discrete Logarithm Problem (ECDLP)
    - Finite field F_p (not rational numbers Q)
    - Point multiplication, not factoring

  ✓ Modularity Theorem connects:
    - Elliptic curves over Q to modular forms
    - Relevant for theoretical number theory
    - NOT applicable to secp256k1 over finite field

  ✗ VERDICT: Proving Riemann Hypothesis does NOT break Bitcoin
    - Different mathematical domains
    - ECDLP remains hard regardless of RH
    - Hash functions (PS-SHA∞) unaffected

  → However, quantum computers (Shor's algorithm) DO threaten ECDLP
    """)


def plot_comparison():
    """Visualize prime distribution vs. elliptic curve properties."""
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))

    # 1. Prime counting function
    ax1 = axes[0, 0]
    x_vals = np.logspace(1, 4, 50)
    pi_vals = [prime_counting_function(x) for x in x_vals]
    li_vals = [logarithmic_integral(x) for x in x_vals]
    pnt_vals = x_vals / np.log(x_vals)

    ax1.plot(x_vals, pi_vals, 'ko-', label='π(x) (actual)', markersize=3)
    ax1.plot(x_vals, li_vals, 'b--', label='Li(x)', linewidth=2)
    ax1.plot(x_vals, pnt_vals, 'r:', label='x/ln(x)', linewidth=2)
    ax1.set_xscale('log')
    ax1.set_yscale('log')
    ax1.set_xlabel('x')
    ax1.set_ylabel('Number of primes ≤ x')
    ax1.set_title('Prime Number Theorem\n(Riemann Hypothesis domain)')
    ax1.legend()
    ax1.grid(True, alpha=0.3)

    # 2. Elliptic curve points vs. Hasse bound
    ax2 = axes[0, 1]
    primes = [p for p in range(2, 200) if prime_counting_function(p) - prime_counting_function(p-1) == 1]
    N_p_vals = [count_points_on_curve_mod_p(p) for p in primes]
    expected = [p + 1 for p in primes]
    upper_bound = [p + 1 + 2*np.sqrt(p) for p in primes]
    lower_bound = [p + 1 - 2*np.sqrt(p) for p in primes]

    ax2.scatter(primes, N_p_vals, c='blue', s=10, label='N_p (actual)', alpha=0.6)
    ax2.plot(primes, expected, 'k--', label='p+1 (expected)', linewidth=1)
    ax2.fill_between(primes, lower_bound, upper_bound, alpha=0.2, color='red',
                     label='Hasse bound: |N_p - (p+1)| ≤ 2√p')
    ax2.set_xlabel('Prime p')
    ax2.set_ylabel('Number of points on E/F_p')
    ax2.set_title('Elliptic Curve Point Counting\n(Hasse\'s Theorem)')
    ax2.legend()
    ax2.grid(True, alpha=0.3)

    # 3. Hash distribution
    ax3 = axes[1, 0]
    sample_hashes = [hashlib.sha256(f"msg_{i}".encode()).hexdigest()
                    for i in range(1000)]
    first_bytes = [int(h[:2], 16) for h in sample_hashes]

    ax3.hist(first_bytes, bins=32, alpha=0.7, edgecolor='black', density=True)
    ax3.axhline(1/256, color='red', linestyle='--', linewidth=2,
               label='Expected (uniform)')
    ax3.set_xlabel('First byte value')
    ax3.set_ylabel('Probability density')
    ax3.set_title('PS-SHA∞ Hash Distribution\n(No connection to primes)')
    ax3.legend()
    ax3.grid(True, alpha=0.3)

    # 4. Summary diagram
    ax4 = axes[1, 1]
    ax4.axis('off')

    summary_text = """
    MATHEMATICAL DOMAINS:

    ┌─────────────────────────────────────┐
    │  Riemann Hypothesis                 │
    │  • ζ(s) zeros at Re(s) = 1/2       │
    │  • Prime distribution               │
    │  • Integer factorization (RSA)      │
    └─────────────────────────────────────┘
              ↓ (Modularity Theorem)
    ┌─────────────────────────────────────┐
    │  Elliptic Curves over ℚ            │
    │  • L-functions                      │
    │  • Theoretical number theory        │
    └─────────────────────────────────────┘
              ↓ (Different field!)
    ┌─────────────────────────────────────┐
    │  Bitcoin: secp256k1 over 𝔽_p       │
    │  • ECDLP (discrete log)             │
    │  • Point multiplication             │
    │  • NO connection to RH              │
    └─────────────────────────────────────┘

    VERDICT: RH ≠ Bitcoin threat ✓
    """

    ax4.text(0.1, 0.5, summary_text, fontsize=11, family='monospace',
            verticalalignment='center')

    plt.tight_layout()
    return fig


if __name__ == "__main__":
    # Run analysis
    analyze_riemann_bitcoin_connection()

    # Generate plots
    print("\nGenerating comparison plots...")
    fig = plot_comparison()

    output_path = "/Users/alexa/blackroad-sandbox/riemann_bitcoin_analysis.png"
    plt.savefig(output_path, dpi=150, bbox_inches='tight')
    print(f"✓ Analysis plot saved to: {output_path}")
