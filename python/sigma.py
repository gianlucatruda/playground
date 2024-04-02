import numpy as np
from scipy.stats import norm
import pandas as pd

res = {'Sigma': [], 'Alpha': [], 'Internal': [], 'External': [],
       '1 in x (one-sided)': [], '1 in x (two-sided)': []}


for sig in range(1, 8):
    res['Sigma'].append(sig)

    # Accumulate from left tail, so we invert sigma to only incl. left extreme
    alpha = norm.cdf(-sig, loc=0, scale=1)
    res['Alpha'].append(alpha)

    res['Internal'].append(
        1.0 - (2.0 * alpha)
    )

    res['External'].append(
        2.0 * alpha
    )

    res['1 in x (one-sided)'].append(
        1.0 / alpha
    )

    res['1 in x (two-sided)'].append(
        0.5 * (1.0 / alpha)
    )

df = pd.DataFrame(res)
print(df)
