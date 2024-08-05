def cracklepop(x, a=3, b=5):
    if x % (a*b) == 0:
        return "CracklePop"
    if x % a == 0:
        return "Crackle"
    if x % b == 0:
        return "Pop"
    return str(x)


if __name__ == '__main__':
    print(*map(cracklepop, [i for i in range(1, 101)]), sep=", ")
