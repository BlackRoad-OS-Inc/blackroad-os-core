#!/usr/bin/env python3
"""
Show sqrt(a² + b²) = c as actual gate operations
"""

def multiply(a, b):
    """Multiplication as shifts and adds"""
    result = 0
    print(f"\nMultiply {a} * {b}:")
    while b > 0:
        if b & 1:  # if lowest bit is 1
            result += a
            print(f"  b={b:04b}, a={a:04b}, result={result:05b} ({result})")
        a <<= 1  # shift a left
        b >>= 1  # shift b right
    return result

def add(a, b):
    """Addition using XOR and carry"""
    print(f"\nAdd {a} + {b}:")
    while b != 0:
        carry = a & b  # carry is where both bits are 1
        a = a ^ b      # sum without carry (XOR)
        b = carry << 1 # shift carry left
        print(f"  a={a:05b} ({a}), carry={b:05b} ({b})")
    return a

def isqrt(n):
    """Integer square root using Newton's method"""
    if n < 2:
        return n

    x = n
    y = (x + 1) >> 1  # divide by 2 using shift

    print(f"\nSquare root of {n}:")
    print(f"  start: x={x}")

    iteration = 0
    while y < x:
        x = y
        # y = (x + n/x) / 2
        # Using integer division
        y = (x + n // x) >> 1
        print(f"  iter {iteration}: x={x}, y={y}")
        iteration += 1

    return x

# Start
a = 3
b = 4

print("=== Computing c from a and b ===")
print(f"a = {a} = {bin(a)}")
print(f"b = {b} = {bin(b)}")

# Step 1: a²
a_squared = multiply(a, a)
print(f"\na² = {a_squared}")

# Step 2: b²
b_squared = multiply(b, b)
print(f"\nb² = {b_squared}")

# Step 3: a² + b²
sum_of_squares = add(a_squared, b_squared)
print(f"\na² + b² = {sum_of_squares}")

# Step 4: √(a² + b²)
c = isqrt(sum_of_squares)
print(f"\nc = √{sum_of_squares} = {c}")

print("\n=== Final ===")
print(f"a = {a}")
print(f"b = {b}")
print(f"c = {c}")
print(f"\nVerify: {a}² + {b}² = {a**2} + {b**2} = {a**2 + b**2} = {c}²")
