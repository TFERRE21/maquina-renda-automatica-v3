require('dotenv').config()
const fs = require('fs')
const path = require('path')
const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function gerarRoteiro() {
  try {

    // ===============================
    // Carregar temas automaticamente
    // ===============================

    const themesPath = path.join(__dirname, '../themes.json')
    const temas = JSON.parse(fs.readFileSync(themesPath, 'utf8'))

    const tema = temas[Math.floor(Math.random() * temas.length)]

    console.log("🎯 Tema escolhido:", tema)

    // ===============================
    // Criar prompt inteligente
    // ===============================

    const prompt = `
Crie um roteiro envolvente para YouTube sobre:

"${tema}"

Regras:
- Tom viral
- Prender atenção nos primeiros 5 segundos
- Duração aproximada: 1 minuto
- Linguagem simples
- Final com chamada para ação
`

    // ===============================
    // Gerar texto com IA
    // ===============================

    const resposta = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um especialista em vídeos virais para YouTube." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8
    })

    const roteiro = resposta.choices[0].message.content

    // ===============================
    // Salvar roteiro
    // ===============================

    const outputPath = path.join(__dirname, '../output/roteiro.txt')

    if (!fs.existsSync(path.join(__dirname, '../output'))) {
      fs.mkdirSync(path.join(__dirname, '../output'))
    }

    fs.writeFileSync(outputPath, roteiro)

    console.log("✅ Roteiro gerado com sucesso!")

  } catch (error) {
    console.error("❌ Erro ao gerar roteiro:", error.message)
  }
}

gerarRoteiro()