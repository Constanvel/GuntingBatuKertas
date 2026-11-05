const MODEL_URL = "./model/";
let model, webcam, maxPredictions;
let isRunning = false;
let playerScore = 0;
let aiScore = 0;

const CONFIDENCE_THRESHOLD = 0.7; // 70%
const CHOICES = ["Rock", "Paper", "Scissors"];
const EMOJI = {
  Rock: "✊",
  Paper: "✋",
  Scissors: "✌️",
};

// 1. Load model TensorFlow.js dari folder model/
async function initModel() {
  const modelURL = MODEL_URL + "model.json";
  const metadataURL = MODEL_URL + "metadata.json";

  try {
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // 2. Aktifkan webcam
    webcam = new tmImage.Webcam(300, 300, true); // width, height, flip
    await webcam.setup();
    await webcam.play();

    document.getElementById("webcam-container").appendChild(webcam.canvas);

    window.requestAnimationFrame(loop);
  } catch (err) {
    // Reset state supaya user bisa coba lagi (model gagal load / kamera ditolak)
    isRunning = false;
    document.getElementById("start-btn").innerText = "🚀 START GAME";
    document.getElementById("result-text").innerText =
      "⚠️ Gagal menyiapkan AI/kamera: " + err.message;
  }
}

// 3. Membaca frame webcam terus-menerus
async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

// 4 & 5. Prediction + ambil class dengan probability tertinggi
async function predict() {
  const prediction = await model.predict(webcam.canvas);

  let best = prediction[0];
  for (let i = 1; i < prediction.length; i++) {
    if (prediction[i].probability > best.probability) {
      best = prediction[i];
    }
  }

  // 6. Menampilkan confidence
  document.getElementById("prediction").innerText = best.className;
  document.getElementById("confidence").innerText =
    Math.round(best.probability * 100) + "%";

  window.currentPrediction = best;
}

// 8. AI memilih secara random
function getAIChoice() {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

// 9. Menentukan pemenang
function decideWinner(player, ai) {
  if (player === ai) return "draw";

  const playerWins =
    (player === "Rock" && ai === "Scissors") ||
    (player === "Paper" && ai === "Rock") ||
    (player === "Scissors" && ai === "Paper");

  return playerWins ? "player" : "ai";
}

// 7 & 10 & 11 & 12. Main satu ronde, update score, tampilkan hasil
function playRound() {
  const best = window.currentPrediction;

  if (!best || best.className.toLowerCase() === "nothing" || best.probability < CONFIDENCE_THRESHOLD) {
    document.getElementById("result-text").innerText =
      "🤔 AI belum yakin. Coba lagi!";
    return;
  }

  const playerChoice = best.className;
  const aiChoice = getAIChoice();

  document.getElementById("ai-emoji").innerText = EMOJI[aiChoice];

  const winner = decideWinner(playerChoice, aiChoice);

  if (winner === "player") {
    playerScore++;
    document.getElementById("result-text").innerText = "🎉 Kamu Menang!";
  } else if (winner === "ai") {
    aiScore++;
    document.getElementById("result-text").innerText = "🤖 AI Menang!";
  } else {
    document.getElementById("result-text").innerText = "🤝 Seri!";
  }

  document.getElementById("player-score").innerText = playerScore;
  document.getElementById("ai-score").innerText = aiScore;
}

// Tombol Start: pertama kali klik = load model, klik berikutnya = main ronde
document.getElementById("start-btn").addEventListener("click", async () => {
  if (!isRunning) {
    isRunning = true;
    document.getElementById("result-text").innerText = "⏳ Menyiapkan AI...";
    await initModel();
    if (isRunning) {
      document.getElementById("start-btn").innerText = "🎮 PLAY ROUND";
      document.getElementById("result-text").innerText = "AI siap! Tunjukkan gesture-mu lalu klik PLAY ROUND.";
    }
  } else {
    playRound();
  }
});
