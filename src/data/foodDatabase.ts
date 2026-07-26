export interface FoodItem {
  name: string;
  shortName: string;
  serving: string;
  kcal: number;
  carb: number;
  prot: number;
  fat: number;
}

// Researched per-serving estimates for common Bangladeshi foods.
// Cross-checked against SnapCalorie, Nutribit, Tarladalal, FatSecret and
// Bengali recipe sources. Real values vary ~15-20% by recipe/oil amount.
export const foodDatabase: FoodItem[] = [
  { name: "Rice (ভাত)", shortName: "Rice", serving: "1 cup, 150g", kcal: 200.0, carb: 45.0, prot: 4.0, fat: 0.5 },
  { name: "Roti (রুটি)", shortName: "Roti", serving: "1 piece", kcal: 120.0, carb: 26.0, prot: 3.0, fat: 1.0 },
  { name: "Paratha (পরোটা)", shortName: "Paratha", serving: "1 piece", kcal: 260.0, carb: 35.0, prot: 4.0, fat: 12.0 },
  { name: "Luchi (লুচি)", shortName: "Luchi", serving: "1 piece", kcal: 100.0, carb: 10.0, prot: 2.0, fat: 6.0 },
  { name: "Dal (ডাল)", shortName: "Dal", serving: "1 bowl, 200g", kcal: 150.0, carb: 20.0, prot: 8.0, fat: 4.0 },
  { name: "Mixed Veg Torkari (তরকারি)", shortName: "Torkari", serving: "1 bowl, 200g", kcal: 160.0, carb: 22.0, prot: 5.0, fat: 6.0 },
  { name: "Alu Bhorta (আলু ভর্তা)", shortName: "Alu Bhorta", serving: "1 serving, 150g", kcal: 200.0, carb: 35.0, prot: 3.0, fat: 5.0 },
  { name: "Egg (ডিম)", shortName: "Egg", serving: "1 boiled", kcal: 75.0, carb: 0.5, prot: 6.0, fat: 5.0 },
  { name: "Chicken (মুরগি)", shortName: "Chicken", serving: "100g curry", kcal: 250.0, carb: 0.0, prot: 28.0, fat: 14.0 },
  { name: "Beef (গরু)", shortName: "Beef", serving: "100g curry", kcal: 320.0, carb: 0.0, prot: 24.0, fat: 25.0 },
  { name: "Fish (মাছ)", shortName: "Fish", serving: "100g curry", kcal: 180.0, carb: 0.0, prot: 22.0, fat: 10.0 },
  { name: "Khichuri (খিচুড়ি)", shortName: "Khichuri", serving: "1 plate, 300g", kcal: 400.0, carb: 55.0, prot: 14.0, fat: 12.0 },
  { name: "Kacchi (কাচ্চি)", shortName: "Kacchi", serving: "1 plate, 400g", kcal: 750.0, carb: 90.0, prot: 35.0, fat: 28.0 },
  { name: "Tehari (তেহারি)", shortName: "Tehari", serving: "1 plate, 350g", kcal: 650.0, carb: 75.0, prot: 28.0, fat: 26.0 },
  { name: "Morog Polao (মোরগ পোলাও)", shortName: "Morog Polao", serving: "1 plate, 300g", kcal: 550.0, carb: 60.0, prot: 24.0, fat: 18.0 },
  { name: "Fuchka (ফুচকা)", shortName: "Fuchka", serving: "6 pieces", kcal: 220.0, carb: 38.0, prot: 4.0, fat: 6.0 },
  { name: "Chotpoti (চটপটি)", shortName: "Chotpoti", serving: "1 bowl, w/ egg", kcal: 250.0, carb: 42.0, prot: 10.0, fat: 5.0 },
  { name: "Singara (সিঙারা)", shortName: "Singara", serving: "1 piece", kcal: 130.0, carb: 17.0, prot: 3.0, fat: 6.0 },
  { name: "Samosa (সমুচা)", shortName: "Samosa", serving: "1 piece", kcal: 140.0, carb: 16.0, prot: 5.0, fat: 8.0 },
  { name: "Muri (মুড়ি)", shortName: "Muri", serving: "1 cup, 30g", kcal: 110.0, carb: 24.0, prot: 2.0, fat: 0.3 },
  { name: "Jilapi (জিলাপি)", shortName: "Jilapi", serving: "1 piece", kcal: 150.0, carb: 26.0, prot: 1.0, fat: 5.0 },
  { name: "Rasgulla (রসগোল্লা)", shortName: "Rasgulla", serving: "1 piece", kcal: 110.0, carb: 20.0, prot: 2.5, fat: 3.0 },
  { name: "Misti Doi (মিষ্টি দই)", shortName: "Misti Doi", serving: "1 cup, 150g", kcal: 200.0, carb: 30.0, prot: 6.0, fat: 6.0 },
  { name: "Payesh (পায়েস)", shortName: "Payesh", serving: "1 bowl, 150g", kcal: 220.0, carb: 40.0, prot: 5.0, fat: 5.0 },
];
