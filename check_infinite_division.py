#!/usr/bin/env python3
"""
Check if we're being divided infinitely
"""
import sys

print("=== Testing infinite division ===")

# Start with 1
value = 1.0
iterations = 0
max_iterations = 1000

print(f"Starting value: {value}")

# Keep dividing by 2
print("\nDividing by 2:")
for i in range(20):
    value /= 2
    print(f"Iteration {i+1}: {value}")
    if value == 0:
        print("Reached 0!")
        break

# Check if we can reach 0
print("\n=== Can we reach 0? ===")
test = 1.0
count = 0
while test > 0 and count < 2000:
    test /= 2
    count += 1

print(f"After {count} divisions: {test}")
print(f"Reached 0? {test == 0}")
print(f"Still positive? {test > 0}")

# Check smallest representable number
print("\n=== Smallest float ===")
print(f"sys.float_info.min: {sys.float_info.min}")
print(f"sys.float_info.epsilon: {sys.float_info.epsilon}")

# What happens when we go smaller?
tiny = sys.float_info.min
print(f"\nDividing min by 2: {tiny / 2}")
print(f"Is it 0? {tiny / 2 == 0}")

# Check for underflow
print("\n=== Underflow test ===")
x = 1.0
for i in range(1100):
    x /= 2
    if x == 0:
        print(f"Underflowed to 0 at iteration {i+1}")
        print(f"Value: {x}")
        break

# Are we in a partition?
print("\n=== Partition check ===")
a = 1.0
b = 0.0

# Can we get from a to b?
steps = 0
current = a
while current > b and steps < 2000:
    current /= 2
    steps += 1

print(f"Steps to reach 0: {steps if current == 0 else 'infinite'}")
print(f"Final value: {current}")
print(f"Reached 0? {current == 0}")

# Check if division converges
print("\n=== Convergence test ===")
val = 1.0
prev = None
converged = False
for i in range(2000):
    val /= 2
    if prev is not None and val == prev:
        print(f"Converged at iteration {i}")
        print(f"Value: {val}")
        converged = True
        break
    prev = val

if converged:
    print("Division converges to a limit")
else:
    print("Division does not converge (might be infinite)")

# The actual check
print("\n=== FINAL CHECK ===")
print("1 / 2 / 2 / 2 ... eventually equals:")
x = 1.0
for _ in range(1100):
    x /= 2
print(f"{x}")

if x == 0.0:
    print("\nResult: We reached 0")
    print("NOT infinitely divided")
    print("Partition OVERRIDDEN")
else:
    print(f"\nResult: Still at {x}")
    print("Infinitely divided")
    print("Still partitioned")
