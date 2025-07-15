# Guess My Cheese Part2

### Challenge 

The imposter was able to fool us last time, so we've strengthened our defenses!
Here's our list(You can download the list from the site) of cheeses.
Connect to the program on our server: nc verbal-sleep.picoctf.net 58138

# Hints 
- I heard that SHA-256 is the best hash function out there!
- Remember Squeexy, we enjoy our cheese with exactly 2 nibbles of hexadecimal-character salt!
- Ever heard of rainbow tables?

# Wait what is Salt in the second Hint ? 

When talking about security, "salt" is just random data added to a password before it's scrambled (hashed).

Here's why that's important:

Imagine you have a secret password, say "mysecret". A website doesn't store "mysecret" directly. Instead, it turns it into a garbled code, like "abc123xyz". This is called hashing.

Now, if a hacker steals that garbled code "abc123xyz", they could try to look it up in a giant dictionary of pre-computed codes (called a rainbow table) to find your original password. Also, if someone else used "mysecret" as their password, their garbled code would be "abc123xyz" too, making it easy for hackers to spot identical passwords.

This is where salt comes in.

When you add a unique, random "salt" to your password before it's hashed, even if two people have the same password, their final garbled codes will be completely different.

For example:

Your password: "mysecret" + Unique Salt "1a2b" = Scrambled Code "XCV456"
Someone else's password: "mysecret" + Different Unique Salt "3c4d" = Scrambled Code "QWE789"
Now, "XCV456" and "QWE789" are totally different, even though the original password was the same. This makes those rainbow tables useless and slows down attackers significantly because they have to try to guess each password and salt combination individually.

In short, salt adds an extra layer of randomness to make your hashed password much harder to crack.

### Solution 
![guess my cheese](../images/guessmycheese2img1.PNG)

As you can see it provides us some SHA-256 Hash and it’s clear that it’s salted.

Now what is SHA-256 first?

SHA-256 is a type of cryptographic hash function, meaning it takes any input (like text or data) and turns it into a fixed-size string of characters, typically 64 characters long when written in hexadecimal. It’s part of the SHA-2 family, which is a set of algorithms created by the NSA to provide secure ways of verifying data.

Now, let’s dive back into the challenge. If you take a closer look at the Cheese List, you’ll notice that the cheese names aren’t consistent. Some names mix uppercase and lowercase letters, and even include symbols like parentheses. This inconsistency means that different text encodings can represent these names as bytes in different ways. Some common encodings to consider are UTF-8, UTF-16 (both little-endian and big-endian), and Latin-1.

The goal here is to pair each cheese name with salt values, but with so many cheese names in the list, how do we efficiently handle this? For every cheese name (and its variations), we combine it with salt values that range from 0 to 255. The salt can be appended to the end, prepended to the beginning, or inserted at various points within the cheese name itself. This creates a wide range of potential combinations. The next step is to hash each combination. For every possible combination of cheese name, salt value, case variation, and encoding, we will calculate the SHA-256 hash.

Next, as the hash-cracking tools run, we will compare the computed hash with the target hash. If a match is found, we’ve successfully identified the correct combination.

I found the python code that automates the entire process : 

```python
import hashlib
import sys
import time

target_sha256_hash = "1a36f0299a51eaae9c3d773a0e35e0e50c19d4754ca376e065808691430b6438" # REMEMBER TO REPLACE "GIVEN_HASH" WITH YOUR ACTUAL TARGET HASH!

# Supported encodings for testing
encoding_formats = ["utf-8", "utf-16-le", "utf-16-be", "latin-1"]

# Case transformations to apply
def case_original(text):
    return text

def case_lower(text):
    return text.lower()

def case_upper(text):
    return text.upper()

case_transformations = {
    "original": case_original,
    "lower": case_lower,
    "upper": case_upper,
}

# We will load the cheese from the cheese list
with open("cheeseList.txt", "r") as file: # Corrected filename for consistency
    cheese_names = [line.strip() for line in file if line.strip()]

match_found = False

def check_hash(candidate_bytes, method, extra_info, cheese, case_type, encoding, salt):
    """
    Compute SHA-256 hash for a given byte sequence and compare it to the target hash.
    If a match is found, display relevant details and return True.
    """
    global match_found
    computed_hash = hashlib.sha256(candidate_bytes).hexdigest()

    if computed_hash == target_sha256_hash:
        print("\n[!!] VALID MATCH FOUND!")
        print("=" * 40)
        print(f"[+] Cheese Name  : {cheese}") # Adjusted spacing for alignment
        print(f"[+] Case Variant : {case_type}") # Adjusted spacing
        print(f"[+] Encoding     : {encoding}") # Adjusted spacing
        print(f"[+] Salt Value   : (0x{salt:02x})") # Adjusted spacing
        print(f"[+] Method Used  : {method}") # Adjusted spacing
        print(f"[+] Extra Info   : {extra_info}") # Adjusted spacing
        print(f"[+] SHA-256 Hash : {computed_hash}") # Adjusted spacing
        try:
            decoded_candidate = candidate_bytes.decode(encoding)
        except Exception:
            decoded_candidate = repr(candidate_bytes)
        print(f"[+] Candidate String ({encoding}): {decoded_candidate}")
        print("=" * 40)
        match_found = True
        return True
    return False

# Start brute-force testing
start_time = time.time()
print("[*] Starting cheese cracking operation....")

for cheese in cheese_names:
    for case_type, transform_func in case_transformations.items():
        modified_cheese = transform_func(cheese)

        for encoding in encoding_formats:
            try:
                cheese_bytes = modified_cheese.encode(encoding)
            except Exception:
                continue

            for salt_value in range(256):
                salt_byte = bytes([salt_value])
                salt_hex_str = format(salt_value, "02x")

                try:
                    salt_hex_bytes = salt_hex_str.encode(encoding)
                except Exception:
                    salt_hex_bytes = salt_hex_str.encode("utf-8") # Fallback encoding

                # Test different variations of salted hashes
                tests = [
                    (cheese_bytes + salt_byte, "append_raw", "raw byte appended"),
                    (salt_byte + cheese_bytes, "prepend_raw", "raw byte prepended"),
                    (cheese_bytes + salt_hex_bytes, "append_hex", "hex string appended"),
                    (salt_hex_bytes + cheese_bytes, "prepend_hex", "hex string prepended"),
                ]

                for candidate, method, extra_info in tests:
                    if check_hash(candidate, method, extra_info, cheese, case_type, encoding, salt_value):
                        break # Breaks out of the 'tests' loop
                if match_found:
                    break # Breaks out of the 'salt_value' loop

                # Insert salt byte at every possible index
                for i in range(len(cheese_bytes) + 1):
                    candidate = cheese_bytes[:i] + salt_byte + cheese_bytes[i:]
                    if check_hash(candidate, "insert_raw", f"at index {i}", cheese, case_type, encoding, salt_value):
                        break # Breaks out of the 'insert_raw' loop
                if match_found:
                    break # Breaks out of the 'salt_value' loop

                # Insert hex-encoded salt at every index
                for i in range(len(cheese_bytes) + 1):
                    candidate = cheese_bytes[:i] + salt_hex_bytes + cheese_bytes[i:]
                    if check_hash(candidate, "insert_hex", f"at index {i}", cheese, case_type, encoding, salt_value):
                        break # Breaks out of the 'insert_hex' loop
                if match_found:
                    break # Breaks out of the 'salt_value' loop
            if match_found: # This 'if' is outside the salt_value loop, breaking the encoding loop
                break
        if match_found: # This 'if' is outside the encoding loop, breaking the case_type loop
            break
    if match_found: # This 'if' is outside the case_type loop, breaking the cheese loop
        break

end_time = time.time()

if not match_found:
    print("[!] No matching cheese and salt combination was found.")
else:
    print(f"\n[+] Execution completed in {end_time - start_time:.2f} seconds.")

```
After execution, this is the output
```terminal 
[*] Starting cheese cracking operation....

[!!] VALID MATCH FOUND!
========================================
[+] Cheese Name  : Curworthy
[+] Case Variant : lower
[+] Encoding     : utf-8
[+] Salt Value   : (0xa8)
[+] Method Used  : append_raw
[+] Extra Info   : raw byte appended
[+] SHA-256 Hash : 1a36f0299a51eaae9c3d773a0e35e0e50c19d4754ca376e065808691430b6438
[+] Candidate String (utf-8): b'curworthy\xa8'
========================================

[+] Execution completed in 16.91 seconds.

```

We’ve finally obtained the cheese name and its corresponding salt in hexadecimal format, now let’s verify it!

![guess my cheese](../images/guessmycheesepart2img2.jpg)

Yeah! I got the Flag `picoCTF{cHeEsYaf31a5c0}`