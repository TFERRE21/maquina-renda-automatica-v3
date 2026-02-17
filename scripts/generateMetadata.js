require("dotenv").config()
const OpenAI = require("openai")
const fs = require("fs")
const path = require("path")

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function gerarMetadata() {
  try {
    const roteiroPath = path.join(__dirname, "../output/roteiro.txt")
    const texto = fs.readFileSync(roteiroPath, "utf8")

    const prompt = `
Com base nesse roteiro de vídeo para YouTube Shorts:

"${texto}"

Gere:

1 - Um título extremamente chamativo (máximo 60 caracteres)
2 - Uma descrição persuasiva com CTA para clicar no link da bio
3 - 10 hashtags estratégicas sobre dinheiro e renda online

Formato:

TÍTULO:
...

DESCRIÇÃO:
...

HASHTAGS:
...
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    })

    const metadata = response.choices[0].message.content

    const outputPath = path.join(__dirname, "../output/metadata.txt")
    fs.writeFileSync(outputPath, metadata)

    console.log("✅ Título e descrição gerados com sucesso!")
  } catch (error) {
    console.error("Erro:", error.message)
  }
}

gerarMetadata()