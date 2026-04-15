// 포켓몬 한국어 이름 → ID 매핑 JSON 생성 스크립트
// 실행: node scripts/fetch-ko-names.mjs

import { writeFileSync, mkdirSync } from "fs";

const BATCH_SIZE = 10;

const listRes = await fetch("https://pokeapi.co/api/v2/pokemon-species?limit=1302");
const listData = await listRes.json();
const allSpecies = listData.results;

console.log(`총 ${allSpecies.length}마리 처리 시작...`);

const koMap = {};
let done = 0;

for (let i = 0; i < allSpecies.length; i += BATCH_SIZE) {
  const batch = allSpecies.slice(i, i + BATCH_SIZE);
  const results = await Promise.all(
    batch.map((s) => fetch(s.url).then((r) => r.json()))
  );

  for (const detail of results) {
    const koName = detail.names.find((n) => n.language.name === "ko")?.name;
    if (koName) koMap[koName] = detail.id;
  }

  done += batch.length;
  process.stdout.write(`\r${done} / ${allSpecies.length}`);
}

mkdirSync("src/data", { recursive: true });
writeFileSync("src/data/ko-names.json", JSON.stringify(koMap));
console.log(`\n완료! ${Object.keys(koMap).length}개 한국어 이름 저장`);
