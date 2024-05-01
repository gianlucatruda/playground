# Weather... or not


```
London (GBR):                   ALPHA=0.796     BETA=0.161      N=1182
Norwich (GBR):                  ALPHA=0.796     BETA=0.004      N=1275
Edinburgh (GBR):                ALPHA=0.796     BETA=0.273      N=2731
San Franciso (USA):             ALPHA=0.757     BETA=0.011      N=2575
NYC (USA):                      ALPHA=0.757     BETA=0.010      N=2830
Amsterdam (NLD):                ALPHA=0.059     BETA=0.064      N=581
Utrecht (NLD):                  ALPHA=0.059     BETA=0.073      N=2823
Cape Town (ZAF):                ALPHA=0.213     BETA=0.048      N=1502
<class 'pandas.core.frame.DataFrame'>
Index: 15499 entries, 0 to 1501
Data columns (total 7 columns):
 #   Column       Non-Null Count  Dtype
---  ------       --------------  -----
 0   DATE         15499 non-null  datetime64[ns]
 1   CITY         15499 non-null  object
 2   COUNTRY      15499 non-null  object
 3   TEMP_LO      15499 non-null  float64
 4   TEMP_HI      15499 non-null  float64
 5   RAIN         15499 non-null  object
 6   DESCRIPTION  15499 non-null  object
dtypes: datetime64[ns](1), float64(2), object(4)
memory usage: 968.7+ KB
None
        DATE CITY COUNTRY  TEMP_LO  TEMP_HI     RAIN DESCRIPTION
0 2033-08-02  NYC     USA     12.9     18.1  00000.0       Clear
1 2033-08-03  NYC     USA     11.4     15.2  00000.0       Clear
2 2033-08-04  NYC     USA      6.2     23.3  00000.0       Sunny
3 2033-08-05  NYC     USA      9.6     14.4  00000.0       Clear
4 2033-08-06  NYC     USA      8.9     14.4  00000.0       Clear
           DATE          CITY COUNTRY  TEMP_LO  TEMP_HI     RAIN DESCRIPTION
2822 2041-05-01       Utrecht     NLD      6.9     17.6  00000.0       Clear
2574 2041-05-01  San Franciso     USA     11.8     15.5  00000.0       Clear
2829 2041-05-01           NYC     USA      7.9     14.7  00000.0       Clear
580  2041-05-01     Amsterdam     NLD      5.4     14.0  00000.0       Clear
1501 2041-05-01     Cape Town     ZAF      8.8     12.1  00000.0       Clear
           DATE          CITY COUNTRY  TEMP_LO  TEMP_HI     RAIN DESCRIPTION
484  2038-07-19     Cape Town     ZAF      8.5     15.2  00001.0       Clear
200  2038-05-23       Norwich     GBR     10.2     20.8  00000.0      Cloudy
1422 2037-10-01     Edinburgh     GBR     10.5     14.1  00000.0       Clear
490  2035-03-14     Edinburgh     GBR      8.8     19.0  00000.0       Clear
1886 2038-10-08       Utrecht     NLD      8.4     15.6  00000.0       Clear
2216 2040-05-08  San Franciso     USA      9.8     14.3  00000.0       Clear
137  2038-03-21       Norwich     GBR      8.3     19.8  00000.0       Clear
454  2034-11-06       Utrecht     NLD      7.5     13.7  00001.0       Clear
509  2039-03-28       Norwich     GBR     13.0     16.6  00000.0       Clear
1362 2040-12-13     Cape Town     ZAF      8.9     15.1  00000.0       Clear
                                DATE       TEMP_LO       TEMP_HI
count                          15499  15499.000000  15499.000000
mean   2038-03-07 08:15:34.666752768      8.785193     16.803116
min              2033-08-02 00:00:00     -8.000000      9.300000
25%              2036-06-25 12:00:00      6.700000     14.400000
50%              2038-07-12 00:00:00      9.200000     16.400000
75%              2040-01-03 00:00:00     11.500000     18.900000
max              2041-05-01 00:00:00     17.300000     32.700000
std                              NaN      3.481244      3.450018
DESCRIPTION
Clear     10416
Cloudy     2364
Rain       1323
Sunny      1011
NA          364
Snow         21
Name: count, dtype: int64


Data written to 'data-v01.csv'
```
