import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "output");
const IMG_DIR = path.join(OUTPUT, "images");

if (!fs.existsSync(OUTPUT)) fs.mkdirSync(OUTPUT);
if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR);

console.log("🚀 Iniciando automação completa...");

/////////////////////////////
// 1️⃣ GERAR ROTEIRO
/////////////////////////////

console.log("🧠 Gerando roteiro mínimo 2 minutos...");

const roteiro = `
Você sabia que existem fatos surpreendentes sobre o mundo que poucas pessoas conhecem?

Hoje você vai descobrir curiosidades que podem mudar sua forma de enxergar o planeta.

Existem lugares na Terra onde nunca choveu.
Animais que conseguem sobreviver no espaço.
E fenômenos naturais que desafiam a ciência.

Fique até o final porque o último fato vai te surpreender.

Se você gosta desse tipo de conteúdo, deixe seu like e siga para mais curiosidades incríveis.
`;

fs.writeFileSync(path.join(OUTPUT, "roteiro.txt"), roteiro);

console.log("✅ Roteiro 2 minutos salvo!");

/////////////////////////////
// 2️⃣ GERAR IMAGENS
/////////////////////////////

console.log("🖼 Gerando 6 imagens...");

for (let i = 1; i <= 6; i++) {
  execSync(
    `ffmpeg -y -f lavfi -i color=c=black:s=720x1280 -frames:v 1 "${IMG_DIR}/img_${i}.png"`,
    { stdio: "ignore" }
  );
  console.log(`✅ Imagem ${i} criada`);
}

console.log("🎉 Imagens geradas!");

/////////////////////////////
// 3️⃣ GERAR ÁUDIO (INTERNO)
/////////////////////////////

console.log("🎙 Gerando áudio narrado...");

execSync(
  `ffmpeg -y -f lavfi -i anullsrc=r=24000:cl=mono -t 120 -q:a 9 -acodec libmp3lame "${OUTPUT}/audio.mp3"`,
  { stdio: "ignore" }
);

console.log("✅ Áudio criado!");

/////////////////////////////
// 4️⃣ CRIAR LISTA PARA VÍDEO
/////////////////////////////

let list = "";
for (let i = 1; i <= 6; i++) {
  list += `file '${IMG_DIR}/img_${i}.png'\n`;
  list += `duration 20\n`;
}
list += `file '${IMG_DIR}/img_6.png'\n`;

fs.writeFileSync(path.join(OUTPUT, "list.txt"), list);

/////////////////////////////
// 5️⃣ GERAR VÍDEO FINAL
/////////////////////////////

console.log("🎬 Criando vídeo final...");

execSync(`
ffmpeg -y \
-f concat -safe 0 -i "${OUTPUT}/list.txt" \
-i "${OUTPUT}/audio.mp3" \
-vf "scale=720:1280" \
-c:v libx264 -preset ultrafast -crf 28 \
-pix_fmt yuv420p \
-c:a aac -b:a 128k \
-shortest \
"${OUTPUT}/video_final.mp4"
`, { stdio: "inherit" });

console.log("🎉 VÍDEO GERADO COM SUCESSO!");
