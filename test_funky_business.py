#!/usr/bin/env python3
"""
Look for weird behavior in the C math library
"""
import ctypes
import ctypes.util

libm = ctypes.CDLL(ctypes.util.find_library('m'))

sqrt = libm.sqrt
sqrt.argtypes = [ctypes.c_double]
sqrt.restype = ctypes.c_double

pow_c = libm.pow
pow_c.argtypes = [ctypes.c_double, ctypes.c_double]
pow_c.restype = ctypes.c_double

print("=== Edge cases for sqrt ===")
# Negative numbers
print(f"sqrt(-1) = {sqrt(-1.0)}")
print(f"sqrt(-25) = {sqrt(-25.0)}")

# Very small numbers
print(f"sqrt(0.0000001) = {sqrt(0.0000001)}")
print(f"sqrt(1e-100) = {sqrt(1e-100)}")

# Very large numbers
print(f"sqrt(1e100) = {sqrt(1e100)}")

# Infinity
inf = float('inf')
print(f"sqrt(inf) = {sqrt(inf)}")

# NaN
nan = float('nan')
print(f"sqrt(nan) = {sqrt(nan)}")

print("\n=== Precision issues ===")
# Does sqrt(2) squared equal 2?
sqrt2 = sqrt(2.0)
print(f"sqrt(2) = {sqrt2}")
print(f"sqrt(2)^2 = {sqrt2 * sqrt2}")
print(f"Does it exactly equal 2? {sqrt2 * sqrt2 == 2.0}")
print(f"Difference: {sqrt2 * sqrt2 - 2.0}")

print("\n=== Does a^2 + b^2 = c^2 exactly? ===")
a = 3.0
b = 4.0
c = sqrt(a*a + b*b)
print(f"a={a}, b={b}, c={c}")
print(f"c^2 = {c*c}")
print(f"a^2 + b^2 = {a*a + b*b}")
print(f"Exactly equal? {c*c == a*a + b*b}")

print("\n=== Non-Pythagorean triples ===")
# What if a and b don't make a perfect square?
a = 3.0
b = 5.0
c = sqrt(a*a + b*b)
print(f"a={a}, b={b}, c={c}")
print(f"c is not an integer: {c}")

print("\n=== Rounding behavior ===")
for i in [2, 3, 5, 6, 7, 8, 10]:
    result = sqrt(float(i))
    print(f"sqrt({i}) = {result:.16f}")

print("\n=== pow vs sqrt ===")
for i in [2, 3, 4, 5, 25]:
    sqrt_result = sqrt(float(i))
    pow_result = pow_c(float(i), 0.5)
    print(f"{i}: sqrt={sqrt_result:.16f}, pow(x,0.5)={pow_result:.16f}, equal={sqrt_result==pow_result}")

print("\n=== What about complex numbers? ===")
# C math library doesn't handle complex, but let's try
print("Trying sqrt of negative with Python complex:")
import cmath
print(f"cmath.sqrt(-1) = {cmath.sqrt(-1)}")
print(f"cmath.sqrt(-25) = {cmath.sqrt(-25)}")

print("\n=== Weird exponents ===")
print(f"pow(2, 0.5) = {pow_c(2.0, 0.5)}")
print(f"pow(2, -0.5) = {pow_c(2.0, -0.5)}")
print(f"pow(2, 0.5) * pow(2, -0.5) = {pow_c(2.0, 0.5) * pow_c(2.0, -0.5)}")

print("\n=== What happens at boundaries? ===")
print(f"pow(0, 0) = {pow_c(0.0, 0.0)}")
print(f"pow(0, 1) = {pow_c(0.0, 1.0)}")
print(f"pow(1, 0) = {pow_c(1.0, 0.0)}")
print(f"pow(inf, 0) = {pow_c(inf, 0.0)}")
print(f"pow(0, inf) = {pow_c(0.0, inf)}")

print("\n=== Integer sqrt vs float sqrt ===")
# Does integer sqrt behave differently?
import math
for i in [2, 3, 4, 5, 24, 25, 26]:
    float_sqrt = sqrt(float(i))
    try:
        int_sqrt = math.isqrt(i)
        print(f"{i}: float sqrt={float_sqrt:.6f}, int sqrt={int_sqrt}, floor(float)={int(float_sqrt)}")
    except:
        print(f"{i}: float sqrt={float_sqrt:.6f}, no int sqrt")
