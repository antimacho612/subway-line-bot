import * as timetables from '../src/timetables';

test('getDiagrams関数', () => {
  expect(timetables.getDiagrams('N01', new Date(2020, 0, 5, 5))).toEqual([
    {
      arrivals: [
        { id: 1, time: 600, note: '始発' },
        { id: 2, time: 610 },
        { id: 3, time: 620 },
        { id: 4, time: 630 },
        { id: 5, time: 640 },
        { id: 6, time: 649 },
        { id: 7, time: 657 },
        { id: 8, time: 705 },
        { id: 9, time: 712 },
        { id: 10, time: 720 },
        { id: 11, time: 726 },
        { id: 12, time: 733 },
        { id: 13, time: 739 },
        { id: 14, time: 745 },
        { id: 15, time: 751 },
        { id: 16, time: 757 },
        { id: 17, time: 803 },
        { id: 18, time: 809 },
        { id: 19, time: 815 },
        { id: 20, time: 821 },
        { id: 21, time: 827 },
        { id: 22, time: 832 },
        { id: 23, time: 838 },
        { id: 24, time: 844 },
        { id: 25, time: 850 },
        { id: 26, time: 856 },
        { id: 27, time: 903 },
        { id: 28, time: 910 },
        { id: 29, time: 915 },
        { id: 30, time: 921 },
        { id: 31, time: 928 },
        { id: 32, time: 935 },
        { id: 33, time: 942 },
        { id: 34, time: 949 },
        { id: 35, time: 956 },
        { id: 36, time: 1003 },
        { id: 37, time: 1010 },
        { id: 38, time: 1017 },
        { id: 39, time: 1024 },
        { id: 40, time: 1031 },
        { id: 41, time: 1038 },
        { id: 42, time: 1045 },
        { id: 43, time: 1052 },
        { id: 44, time: 1059 },
        { id: 45, time: 1106 },
        { id: 46, time: 1113 },
        { id: 47, time: 1120 },
        { id: 48, time: 1127 },
        { id: 49, time: 1134 },
        { id: 50, time: 1141 },
        { id: 51, time: 1148 },
        { id: 52, time: 1155 },
        { id: 53, time: 1202 },
        { id: 54, time: 1209 },
        { id: 55, time: 1216 },
        { id: 56, time: 1223 },
        { id: 57, time: 1230 },
        { id: 58, time: 1237 },
        { id: 59, time: 1244 },
        { id: 60, time: 1251 },
        { id: 61, time: 1258 },
        { id: 62, time: 1305 },
        { id: 63, time: 1312 },
        { id: 64, time: 1319 },
        { id: 65, time: 1326 },
        { id: 66, time: 1333 },
        { id: 67, time: 1340 },
        { id: 68, time: 1347 },
        { id: 69, time: 1354 },
        { id: 70, time: 1401 },
        { id: 71, time: 1408 },
        { id: 72, time: 1415 },
        { id: 73, time: 1422 },
        { id: 74, time: 1429 },
        { id: 75, time: 1436 },
        { id: 76, time: 1443 },
        { id: 77, time: 1450 },
        { id: 78, time: 1457 },
        { id: 79, time: 1504 },
        { id: 80, time: 1511 },
        { id: 81, time: 1518 },
        { id: 82, time: 1525 },
        { id: 83, time: 1532 },
        { id: 84, time: 1539 },
        { id: 85, time: 1546 },
        { id: 86, time: 1553 },
        { id: 87, time: 1600 },
        { id: 88, time: 1607 },
        { id: 89, time: 1614 },
        { id: 90, time: 1621 },
        { id: 91, time: 1628 },
        { id: 92, time: 1635 },
        { id: 93, time: 1642 },
        { id: 94, time: 1649 },
        { id: 95, time: 1656 },
        { id: 96, time: 1703 },
        { id: 97, time: 1710 },
        { id: 98, time: 1717 },
        { id: 99, time: 1724 },
        { id: 100, time: 1731 },
        { id: 101, time: 1738 },
        { id: 102, time: 1745 },
        { id: 103, time: 1752 },
        { id: 104, time: 1759 },
        { id: 105, time: 1806 },
        { id: 106, time: 1813 },
        { id: 107, time: 1820 },
        { id: 108, time: 1827 },
        { id: 109, time: 1834 },
        { id: 110, time: 1841 },
        { id: 111, time: 1848 },
        { id: 112, time: 1857 },
        { id: 113, time: 1904 },
        { id: 114, time: 1912 },
        { id: 115, time: 1918 },
        { id: 116, time: 1924 },
        { id: 117, time: 1931 },
        { id: 118, time: 1937 },
        { id: 119, time: 1945 },
        { id: 120, time: 1954 },
        { id: 121, time: 2002 },
        { id: 122, time: 2010 },
        { id: 123, time: 2018 },
        { id: 124, time: 2026 },
        { id: 125, time: 2034 },
        { id: 126, time: 2042 },
        { id: 127, time: 2050 },
        { id: 128, time: 2058 },
        { id: 129, time: 2106 },
        { id: 130, time: 2114 },
        { id: 131, time: 2122 },
        { id: 132, time: 2130 },
        { id: 133, time: 2138 },
        { id: 134, time: 2146 },
        { id: 135, time: 2154 },
        { id: 136, time: 2202 },
        { id: 137, time: 2210 },
        { id: 138, time: 2218 },
        { id: 139, time: 2227 },
        { id: 140, time: 2235 },
        { id: 141, time: 2243 },
        { id: 142, time: 2251 },
        { id: 143, time: 2259 },
        { id: 144, time: 2308 },
        { id: 145, time: 2317 },
        { id: 146, time: 2326 },
        { id: 147, time: 2335 },
        { id: 148, time: 2343 },
        { id: 149, time: 2351 },
        { id: 150, time: 2400, note: '最終' },
      ],
      direction: '真駒内方面',
    },
  ]);
});
