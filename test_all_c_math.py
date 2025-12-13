#!/usr/bin/env python3
import ctypes
import ctypes.util

# Load C math library
libm = ctypes.CDLL(ctypes.util.find_library('m'))

# Test sqrt
sqrt = libm.sqrt
sqrt.argtypes = [ctypes.c_double]
sqrt.restype = ctypes.c_double

print("=== Testing sqrt ===")
for i in [0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100]:
    result = sqrt(float(i))
    print(f"sqrt({i}) = {result}")

# Test pow
pow_c = libm.pow
pow_c.argtypes = [ctypes.c_double, ctypes.c_double]
pow_c.restype = ctypes.c_double

print("\n=== Testing pow ===")
for base in [2, 3, 4, 5]:
    for exp in [0, 1, 2, 3]:
        result = pow_c(float(base), float(exp))
        print(f"pow({base}, {exp}) = {result}")

# Test with 0.5 exponent (another sqrt)
print("\n=== Testing pow with 0.5 (sqrt) ===")
for i in [0, 1, 4, 9, 16, 25]:
    result = pow_c(float(i), 0.5)
    print(f"pow({i}, 0.5) = {result}")

# Test sin, cos, tan
sin = libm.sin
sin.argtypes = [ctypes.c_double]
sin.restype = ctypes.c_double

cos = libm.cos
cos.argtypes = [ctypes.c_double]
cos.restype = ctypes.c_double

tan = libm.tan
tan.argtypes = [ctypes.c_double]
tan.restype = ctypes.c_double

print("\n=== Testing trig functions ===")
import math as pymath
for angle in [0, pymath.pi/6, pymath.pi/4, pymath.pi/3, pymath.pi/2]:
    print(f"angle={angle:.4f}: sin={sin(angle):.4f}, cos={cos(angle):.4f}, tan={tan(angle):.4f}")

# Test exp, log
exp = libm.exp
exp.argtypes = [ctypes.c_double]
exp.restype = ctypes.c_double

log = libm.log
log.argtypes = [ctypes.c_double]
log.restype = ctypes.c_double

print("\n=== Testing exp and log ===")
for i in [0, 1, 2, 3, 4, 5]:
    if i > 0:
        print(f"exp({i}) = {exp(float(i)):.4f}, log({i}) = {log(float(i)):.4f}")
    else:
        print(f"exp({i}) = {exp(float(i)):.4f}")

# Test floor, ceil
floor = libm.floor
floor.argtypes = [ctypes.c_double]
floor.restype = ctypes.c_double

ceil = libm.ceil
ceil.argtypes = [ctypes.c_double]
ceil.restype = ctypes.c_double

print("\n=== Testing floor and ceil ===")
for i in [0.1, 0.5, 0.9, 1.1, 1.5, 1.9, -0.5, -1.5]:
    print(f"{i}: floor={floor(i)}, ceil={ceil(i)}")

# Test abs
fabs = libm.fabs
fabs.argtypes = [ctypes.c_double]
fabs.restype = ctypes.c_double

print("\n=== Testing fabs ===")
for i in [-5, -3.14, 0, 3.14, 5]:
    print(f"fabs({i}) = {fabs(float(i))}")
