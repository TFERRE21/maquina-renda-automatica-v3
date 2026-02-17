require("dotenv").config()
const OpenAI = require("openai")
const fs = require("fs")
const path = require("path")

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function gerarAudio() {
  try {
    const roteiroPath = path.join(__dirname, "../output/roteiro.txt")
    const texto = fs.readFileSync(roteiroPath, "utf8")

    const mp3 = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: texto,
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())
    const outputPath = path.join(__dirname, "../output/audio.mp3")
    fs.writeFileSync(outputPath, buffer)

    console.log("✅ Áudio gerado com sucesso!")
  } catch (error) {
    console.error("Erro:", error.message)
  }
}

gerarAudio()