export interface StateData {
  state: string;
  population: number;
  density: number;
  literacy: number;
  sexRatio: number;
}

export const censusData: StateData[] = [
  { state: "Uttar Pradesh", population: 199812341, density: 829, literacy: 67.68, sexRatio: 912 },
  { state: "Maharashtra", population: 112374333, density: 365, literacy: 82.34, sexRatio: 929 },
  { state: "Bihar", population: 104099452, density: 1106, literacy: 61.80, sexRatio: 918 },
  { state: "West Bengal", population: 91276115, density: 1028, literacy: 76.26, sexRatio: 950 },
  { state: "Andhra Pradesh", population: 84580777, density: 308, literacy: 67.02, sexRatio: 993 },
  { state: "Madhya Pradesh", population: 72626809, density: 236, literacy: 69.32, sexRatio: 931 },
  { state: "Tamil Nadu", population: 72147030, density: 555, literacy: 80.09, sexRatio: 996 },
  { state: "Rajasthan", population: 68548437, density: 200, literacy: 66.11, sexRatio: 928 },
  { state: "Karnataka", population: 61095297, density: 319, literacy: 75.36, sexRatio: 973 },
  { state: "Gujarat", population: 60439692, density: 308, literacy: 78.03, sexRatio: 919 },
  { state: "Odisha", population: 41974218, density: 270, literacy: 72.87, sexRatio: 979 },
  { state: "Kerala", population: 33406061, density: 860, literacy: 94.00, sexRatio: 1084 },
  { state: "Jharkhand", population: 32988134, density: 414, literacy: 66.41, sexRatio: 948 },
  { state: "Assam", population: 31205576, density: 398, literacy: 72.19, sexRatio: 958 },
  { state: "Punjab", population: 27743338, density: 551, literacy: 75.84, sexRatio: 895 },
  { state: "Chhattisgarh", population: 25545198, density: 189, literacy: 70.28, sexRatio: 991 },
  { state: "Haryana", population: 25351462, density: 573, literacy: 75.55, sexRatio: 879 },
  { state: "Uttarakhand", population: 10086292, density: 189, literacy: 78.82, sexRatio: 963 },
  { state: "Himachal Pradesh", population: 6864602, density: 123, literacy: 82.80, sexRatio: 972 },
  { state: "Tripura", population: 3673917, density: 350, literacy: 87.22, sexRatio: 960 },
  { state: "Meghalaya", population: 2966889, density: 132, literacy: 74.43, sexRatio: 989 },
  { state: "Manipur", population: 2855794, density: 115, literacy: 76.94, sexRatio: 985 },
  { state: "Nagaland", population: 1978502, density: 119, literacy: 79.55, sexRatio: 931 },
  { state: "Goa", population: 1458545, density: 394, literacy: 88.70, sexRatio: 973 },
  { state: "Arunachal Pradesh", population: 1383727, density: 17, literacy: 65.38, sexRatio: 938 },
  { state: "Mizoram", population: 1097206, density: 52, literacy: 91.33, sexRatio: 976 },
  { state: "Sikkim", population: 610577, density: 86, literacy: 81.42, sexRatio: 890 }
].sort((a, b) => b.population - a.population);
