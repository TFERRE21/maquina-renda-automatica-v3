const cron = require("node-cron")
const { exec } = require("child_process")

function rodarComando(comando) {
  return new Promise((resolve, reject) => {
    exec(comando, (error, stdout, stderr) => {
      if (error) {
        console.error("Erro:", error)
        reject(error)
      } else {
        console.log(stdout)
        resolve(stdout)
      }
    })
  })
}

// 🔥 Agenda para rodar 2x por dia
// 0 9,18 * * *  → 09:00 e 18:00
cron.schedule("0 9,18 * * *", async () => {
  console.log("🚀 Iniciando processo automático...")

  try {
    await rodarComando("node scripts/runAll.js")
    await rodarComando("node scripts/uploadYouTube.js")

    console.log("✅ Vídeo enviado automaticamente!")
  } catch (err) {
    console.error("Erro no processo automático:", err)
  }
})

console.log("🤖 Bot automático rodando...")