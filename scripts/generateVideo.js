const ffmpeg = require("fluent-ffmpeg")
const ffmpegPath = require("ffmpeg-static")
const path = require("path")

ffmpeg.setFfmpegPath(ffmpegPath)

const backgroundPath = path.join(__dirname, "../assets/background.mp4")
const audioPath = path.join(__dirname, "../output/audio.mp3")
const outputPath = path.join(__dirname, "../output/video-final.mp4")

ffmpeg()
  .input(backgroundPath)
  .input(audioPath)
  .outputOptions([
    "-map 0:v:0",
    "-map 1:a:0",
    "-c:v copy",
    "-shortest"
  ])
  .save(outputPath)
  .on("end", () => {
    console.log("✅ Vídeo criado com sucesso!")
  })
  .on("error", (err) => {
    console.error("Erro ao criar vídeo:", err.message)
  })