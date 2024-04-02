import string
class Solution:
    def strongPasswordChecker(self, password: str) -> int:

        def char_delta(pw: str):
            N = len(pw)
            if N < 6:
                return 6 - N
            if N > 20:
                return 20 - N
            return 0
        
        def spec_chars(pw: str):
            for i, s in enumerate([string.ascii_lowercase, string.ascii_uppercase, string.digits]):
                if len(set(s).intersection(set(pw))) < 1:
                    return s
            return -1
        
        def repeats(pw: str):
            for i in range(1, len(pw)-1):
                if pw[i-1] == pw[i] == pw[i+1]:
                    return i+1
            return -1

        def is_strong(pw: str) -> bool:
            if char_delta(pw) == 0:
                if spec_chars(pw) == -1:
                    if repeats(pw) == -1:
                        return True
            return False
        
        def flip_case(pw: str, i: int):
            if pw[i] in string.ascii_lowercase:
                return pw[i].upper()
            if pw[i] in string.ascii_uppercase:
                return pw[i].lower()
            if pw[i] in string.digits:
                return str((int(pw[i]) + 1) % 10)
            return '9'

        count = 0

        for _ in range(50):
            print(len(password), password)
            if is_strong(password):
                return count
            count += 1

            ri = repeats(password)
            N = len(password)
            i = N // 2 if ri < 0 else ri
            sc = spec_chars(password)

            if 6 <= N <= 20:
                if ri >= 0 and sc != -1:
                    # Replace first repeat with needed SC
                    password = password[:i] + sc[-1] + password[i+1:]
                    continue
                if ri >= 0 and sc == -1:
                    password = password[:i] + flip_case(password, i) + password[i+1:]
                    continue
                if ri < 0 and sc != -1:
                    if N == 20:
                        for j, c in enumerate(password):
                            mod = password[:j] + sc[-1] + password[j+1:]
                            if spec_chars(mod) == -1:
                                break
                        password = mod
                        continue
                    # Add needed special character to end
                    password = password + sc[-1]
                    continue
                if ri < 0 and sc == -1:
                    # Should have flagged earlier
                    return count - 1

            if N > 20:
                if ri < 0:
                    # Make sure not to delete unique spec_char
                    for j, c in enumerate(password):
                        mod = password[:j] + password[j+1:]
                        if spec_chars(mod) == -1:
                            password = mod
                            continue
                password = password[:i] + password[i+1:]
                continue
            # Add case 
            new = sc[-1] if sc != -1 else flip_case(password, i)
            password = password[:i] + new + password[i:]

        return count 

print(Solution().strongPasswordChecker("bbaaaaaaaaaaaaaaacccccc"))
print()
print(Solution().strongPasswordChecker("1111111111"))
print()
print(Solution().strongPasswordChecker("bbaaaaaaaaaaaaaaccccc"))
