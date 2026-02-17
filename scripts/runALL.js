const { exec } = require("child_process")

function rodarComando(comando) {
  return new Promise((resolve, reject) => {
    exec(comando, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr)
        reject(error)
      } else {
        console.log(stdout)
        resolve()
      }
    })
  })
}

async function executarTudo() {
  try {

    console.log("🎬 Gerando roteiro...")
    await rodarComando("node scripts/generateScript.js")

    console.log("🎙️ Gerando áudio...")
    await rodarComando("node scripts/generateVoice.js")

    console.log("🎥 Gerando vídeo...")
    await rodarComando("node scripts/generateVideo.js")

    console.log("📝 Gerando título e descrição...")
    await rodarComando("node scripts/generateMetadata.js")

    console.log("🚀 Enviando para YouTube...")
    await rodarComando("node scripts/uploadYoutube.js")

    console.log("✅ Processo completo com upload realizado!")

  } catch (error) {
    console.error("❌ Erro no processo:", error.message)
  }
}

executarTudo()