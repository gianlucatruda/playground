"""
Program for generating fake weather dataset for this problem
"""

import numpy as np
from datetime import datetime, timedelta
import pandas as pd

colnames = ['DATE', 'CITY', 'COUNTRY', 'TEMP_LO',
            'TEMP_HI', 'RAIN', 'DESCRIPTION']
locations = {
    'GBR': ['London', 'Norwich', 'Edinburgh'],
    'USA': ['San Franciso', 'NYC'],
    'NLD': ['Amsterdam', 'Utrecht'],
    'ZAF': ['Cape Town'],
}


def desc(row):
    if row.RAIN < 0.9:
        if 12 < row.TEMP_HI < 20:
            return "Clear"
        if row.TEMP_HI > 20 and row.RAIN == 0:
            return "Sunny"
        return "Cloudy"
    if row.TEMP_LO < 0 and row.RAIN > 5:
        return "Snow"
    if row.RAIN > 1.5:
        return "Rain"
    return "NA"


END_DATE = "2041-05-01"  # Lol, epic forecast computing, much wow!!
END = datetime.strptime(END_DATE, "%Y-%m-%d")
dfs = []
for country, cities in locations.items():
    ALPHA = np.random.pareto(3, 1)[0]
    for city in cities:
        BETA = np.random.pareto(5, 1)[0]
        N = np.random.randint(low=500, high=3000, size=1)[0]
        print(f"{city} ({country}):".ljust(30)+f"\t{ALPHA=:.3f}\t{BETA=:.3f}\t{N=}")
        temp_basis = np.random.normal(loc=5*ALPHA+10.0, scale=BETA*5.0, size=N)
        temp_mins = temp_basis - np.abs(np.random.normal(0, 5, N))
        temp_maxes = temp_basis + np.abs(np.random.normal(0, 5, N))
        rain = np.random.pareto(10*ALPHA, N)
        # TODO bit shit
        rain = rain * np.random.choice([0, 1], size=N, p=[0.4, 0.6])
        # Guarantee there are always at least some days at end shared
        dates = [END - timedelta(days=i) for i in range(N-1, -1, -1)]

        _df = pd.DataFrame([
            dates,
            [city]*N,
            [country]*N,
            temp_mins,
            temp_maxes,
            rain,
            ["NA"]*N,
        ],)
        _df = _df.T
        _df.columns = colnames
        dfs.append(_df)

df = pd.concat(dfs)
df = df.infer_objects()
df['DATE'] = pd.to_datetime(df['DATE'])
df['TEMP_LO'] = df['TEMP_LO'].round(1)
df['TEMP_HI'] = df['TEMP_HI'].round(1)
df['DESCRIPTION'] = df.apply(desc, axis=1)
df['RAIN'] = df['RAIN'].apply(lambda x: f"{np.round(x):07}")
df.sort_values(by='DATE', inplace=True)
print(df.info())
print(df.head(5))
print(df.tail(5))
print(df.sample(10))
print(df.describe())
print(df['DESCRIPTION'].value_counts())
outname = "data-v01.csv"
df.to_csv(outname, index=False)
print(f"\n\nData written to '{outname}'\n")
