"""
https://adventofcode.com/2020/day/8
"""

# Read in the input file and split on lines (excluding final empty)
_fname = "aoc-2020-08-01.txt"
with open(_fname, 'r') as f:
    lines = f.read()
lines = lines.split("\n")[:-1]

# Initialise accumulator and cursor variables
acc = 0
cursor = 0
# Initialise dictionary of line:visit pairs, setting 0th line to 1
visits = {i: 0 for i in range(len(lines))}
visits[cursor] += 1
while visits[cursor] <= 1:
    op, arg = lines[cursor].split(" ")
    # print(f"{cursor=}\t{op=}\t{arg=}")
    arg = int(arg)
    if op == "nop":
        cursor += 1
    elif op == "acc":
        acc += arg
        cursor += 1
    elif op == "jmp":
        cursor += arg
    visits[cursor] += 1
# print(visits)
print(acc)
