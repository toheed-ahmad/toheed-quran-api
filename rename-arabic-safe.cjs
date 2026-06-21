const fs = require("fs");
const path = require("path");

const folders = [
  "D:/src/toheed-quran-api/data/arabic",
  "D:/src/toheed-quran-api/data/translations/urdu_junagarhi",
  "D:/src/toheed-quran-api/data/translations/urdu_taqi",
  "D:/src/toheed-quran-api/data/translations/urdu_ahmad_ali",
  "D:/src/toheed-quran-api/data/translations/hindi",
  "D:/src/toheed-quran-api/data/translations/english_sahih",
  "D:/src/toheed-quran-api/data/audio/abdulbasit",
  "D:/src/toheed-quran-api/data/audio/alafasy",
  "D:/src/toheed-quran-api/data/audio/maher",
  "D:/src/toheed-quran-api/data/audio/minshawi",
  "D:/src/toheed-quran-api/data/audio/sudais"
];

let totalRenamed = 0;

for (const folder of folders) {
  if (!fs.existsSync(folder)) {
    console.log(`❌ Folder not found: ${folder}`);
    continue;
  }

  console.log(`\n📂 Processing: ${folder}`);

  const files = fs.readdirSync(folder);

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const match = file.match(/^surah_(\d{3})/i);

    if (!match) {
      console.log(`⏭️ Skip: ${file}`);
      continue;
    }

    const number = match[1];
    const newName = `${number}.json`;

    const oldPath = path.join(folder, file);
    const newPath = path.join(folder, newName);

    if (fs.existsSync(newPath)) {
      console.log(`⚠️ Already exists: ${newName}`);
      continue;
    }

    fs.renameSync(oldPath, newPath);

    console.log(`✅ ${file} -> ${newName}`);
    totalRenamed++;
  }
}

console.log("\n🎉 All Done");
console.log(`📁 Total Renamed Files: ${totalRenamed}`);