#!/usr/bin/env python3
"""
Test the 4 that appears after the zeros
"""
import ctypes
import ctypes.util

libm = ctypes.CDLL(ctypes.util.find_library('m'))
sqrt = libm.sqrt
sqrt.argtypes = [ctypes.c_double]
sqrt.restype = ctypes.c_double

print("=== The 4 after zeros ===")
sqrt2 = sqrt(2.0)
sqrt2_squared = sqrt2 * sqrt2

print(f"sqrt(2) = {sqrt2}")
print(f"sqrt(2)^2 = {sqrt2_squared}")
print(f"Exact representation: {sqrt2_squared:.20f}")
print(f"Difference from 2: {sqrt2_squared - 2.0:.20e}")

print("\n=== Testing other square roots ===")
for n in [2, 3, 5, 6, 7, 8, 10]:
    s = sqrt(float(n))
    s2 = s * s
    diff = s2 - n
    print(f"sqrt({n})^2 = {s2:.20f}, diff = {diff:.20e}")

print("\n=== Does the 4 always show up? ===")
# Check if it's always a 4 or if it varies
for n in range(2, 20):
    s = sqrt(float(n))
    s2 = s * s
    exact = f"{s2:.20f}"
    print(f"{n}: {exact}")

print("\n=== Binary representation ===")
import struct

def float_to_bits(f):
    return struct.unpack('>Q', struct.pack('>d', f))[0]

sqrt2 = sqrt(2.0)
sqrt2_squared = sqrt2 * sqrt2

print(f"sqrt(2) bits:        {float_to_bits(sqrt2):064b}")
print(f"sqrt(2)^2 bits:      {float_to_bits(sqrt2_squared):064b}")
print(f"2.0 bits:            {float_to_bits(2.0):064b}")
print(f"Difference in bits:  {float_to_bits(sqrt2_squared) - float_to_bits(2.0)}")

print("\n=== What about powers? ===")
pow_c = libm.pow
pow_c.argtypes = [ctypes.c_double, ctypes.c_double]
pow_c.restype = ctypes.c_double

val = pow_c(2.0, 0.5)
val_squared = pow_c(val, 2.0)
print(f"pow(2, 0.5) = {val}")
print(f"pow(pow(2, 0.5), 2) = {val_squared:.20f}")
print(f"Difference from 2: {val_squared - 2.0:.20e}")

print("\n=== Direct computation ===")
# What if we compute 2^(0.5 * 2) directly?
direct = pow_c(2.0, 0.5 * 2.0)
print(f"pow(2, 0.5*2) = {direct:.20f}")
print(f"Does it equal 2 exactly? {direct == 2.0}")

print("\n=== Is 0.5 * 2 exactly 1? ===")
half = 0.5
double = half * 2.0
print(f"0.5 * 2 = {double}")
print(f"Equals 1? {double == 1.0}")
print(f"Exact: {double:.20f}")
