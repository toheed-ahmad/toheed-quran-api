const fs = require("fs");
const path = require("path");

const files = [
  {
    file: "002.json",
    surahId: 2,
    firstAyah: "الم",
  },
  {
    file: "003.json",
    surahId: 3,
    firstAyah: "الم",
  },
];

const translationsDir =
  "D:/src/toheed-quran-api/data/translations/urdu_taqi";

for (const item of files) {
  const filePath = path.join(translationsDir, item.file);

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // موجودہ تمام آیات کے نمبر +1
  const updatedAyahs = data.ayahs.map((ayah) => ({
    ...ayah,
    ayah_number: ayah.ayah_number + 1,
    verse_key: `${item.surahId}:${ayah.ayah_number + 1}`,
  }));

  // نئی پہلی آیت شامل کریں
  updatedAyahs.unshift({
    ayah_number: 1,
    verse_key: `${item.surahId}:1`,
    text: item.firstAyah,
  });

  data.ayahs = updatedAyahs;

  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
    "utf8"
  );

  console.log(`✅ Updated: ${item.file}`);
}

console.log("🎉 Done! Surah 2 and 3 fixed successfully.");