#!/usr/bin/env python3
"""
Derive c from a and b - don't just set it
"""

import math

a = 3
b = 4

# Pythagorean theorem: c² = a² + b²
c_squared = a**2 + b**2
c = math.sqrt(c_squared)

print(f"a = {a}")
print(f"b = {b}")
print(f"a² = {a**2}")
print(f"b² = {b**2}")
print(f"a² + b² = {c_squared}")
print(f"c = √{c_squared} = {c}")

print("\n=== Gates ===")
print(f"a AND b = {a & b}")
print(f"a OR b = {a | b}")
print(f"a XOR b = {a ^ b}")

print("\n=== Binary ===")
print(f"a = {bin(a)}")
print(f"b = {bin(b)}")
print(f"c = {c} (not an integer gate operation)")
