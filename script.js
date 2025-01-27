const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const levelBar = document.getElementById('levelBar');
const powerBar = document.getElementById('powerBar');
const powerBarText = document.getElementById('powerBarText');

// Oyuncu
const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    radius: 20,
    color: "#0000ff"
};

// Toplar
let balls = [];
const ballRadius = 15;
const ballSpeed = 2;

// Mermiler
let bullets = [];

// Puan
let score = 0;

// Can Sayısı
let lives = 3;

// Level
let level = 1;

// Oyun Durumu
let gameOver = false;
let gameWon = false;

// Mouse Pozisyonu
let mouseX = player.x;
let mouseY = player.y;

// Normal Mermi Sayacı
let bulletCount = 0;

// Mouse Hareketini Takip Etme
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

// Mouse Tıklamasını Dinleme
canvas.addEventListener('mousedown', (event) => {
    if (event.button === 0) { // Sol tık (normal mermi)
        fireBullet();
    } else if (event.button === 2 && bulletCount >= 20) { // Sağ tık (büyük mermi)
        firePowerBullet();
    }
});

// Sağ tık menüsünü engelleme
canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// Normal Mermi Ateşleme Fonksiyonu
function fireBullet() {
    if (gameOver || gameWon) return;

    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
    const speed = 5;

    bullets.push({
        x: player.x,
        y: player.y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        isPowerBullet: false, // Normal mermi
        radius: 5, // Normal mermi boyutu
        color: "#ffffff"
    });

    bulletCount++; // Sayaç artsın
    updatePowerBar(); // Bar'ı güncelle
}

// Büyük Mermi Ateşleme Fonksiyonu
function firePowerBullet() {
    if (gameOver || gameWon) return;

    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
    const speed = 5;

    bullets.push({
        x: player.x,
        y: player.y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        isPowerBullet: true, // Büyük mermi
        radius: ballRadius, // Büyük mermi boyutu
        color: "#8B0000"
    });

    bulletCount = 0; // Büyük mermi ateşlendi, sayacı sıfırla
    updatePowerBar(); // Bar'ı güncelle
}

// Büyük Mermi Bar'ını Güncelleme
function updatePowerBar() {
    if (bulletCount >= 20) {
        powerBar.style.width = "100%"; // Bar tamamen dolu
        powerBarText.textContent = "Büyük Mermi Hazır!";
        powerBarText.style.opacity = 1;
    } else {
        const powerProgress = (bulletCount / 20) * 100;
        powerBar.style.width = powerProgress + "%";
        powerBarText.style.opacity = 0;
    }
}

// Topları Oluşturma
function createBall() {
    const x = Math.random() * canvas.width;
    const y = 0;
    const dx = (Math.random() - 0.5) * ballSpeed;
    const dy = Math.random() * ballSpeed + 1;
    balls.push({ x, y, dx, dy, radius: ballRadius, color: "#ff4757" });
}

// Oyuncuyu Çizme
function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
}

// Topları Çizme ve Hareket Ettirme
function drawBalls() {
    balls.forEach((ball, index) => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();

        // Topun Hareketi
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Topun Oyuncuya Çarpması
        const distanceToPlayer = Math.sqrt((ball.x - player.x) ** 2 + (ball.y - player.y) ** 2);
        if (distanceToPlayer < ball.radius + player.radius) {
            lives--; // Can azalt
            balls.splice(index, 1); // Topu kaldır

            if (lives === 0) {
                gameOver = true; // Canlar bittiyse oyunu bitir
            }
        }

        // Topun Ekrandan Çıkması
        if (ball.y > canvas.height) {
            balls.splice(index, 1);
        }
    });
}

// Mermileri Çizme ve Hareket Ettirme
function drawBullets() {
    bullets.forEach((bullet, index) => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = bullet.color;
        ctx.fill();
        ctx.closePath();

        // Merminin Hareketi
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        // Merminin Ekrandan Çıkması
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(index, 1);
        }
    });
}

// Çarpışma Kontrolü
function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        balls.forEach((ball, ballIndex) => {
            const distance = Math.sqrt((bullet.x - ball.x) ** 2 + (bullet.y - ball.y) ** 2);
            if (distance < ball.radius + bullet.radius) {
                if (bullet.isPowerBullet) {
                    // Büyük mermi: Tüm topları yok et
                    balls.splice(ballIndex, 1);
                    score += 10;
                } else {
                    // Normal mermi: Sadece bir topu yok et
                    balls.splice(ballIndex, 1);
                    bullets.splice(bulletIndex, 1);
                    score += 10;
                }
            }
        });
    });
}

// Puan ve Level Güncelleme
function updateHUD() {
    scoreElement.textContent = "Puan: " + score;
    levelElement.textContent = "Level: " + level;

    // Level Bar Güncelleme
    const levelProgress = (score % 1000) / 1000 * 100;
    levelBar.style.width = levelProgress + "%";

    // Level Atlama
    if (score >= level * 1000) {
        level++;
    }

    // Can Görselini Güncelleme
    const lifeElements = document.querySelectorAll('.life');
    lifeElements.forEach((life, index) => {
        if (index < lives) {
            life.classList.remove('lost');
        } else {
            life.classList.add('lost');
        }
    });
}

// Game Over Ekranı
function drawGameOver() {
    ctx.fillStyle = "#ff4757";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Puanınız: " + score, canvas.width / 2 - 50, canvas.height / 2 + 30);
}

// Kazanma Ekranı
function drawGameWon() {
    ctx.fillStyle = "#61dafb";
    ctx.font = "40px Arial";
    ctx.fillText("Kazandınız!", canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Puanınız: " + score, canvas.width / 2 - 50, canvas.height / 2 + 30);
}

// Ana Oyun Döngüsü
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver && !gameWon) {
        drawPlayer();
        drawBalls();
        drawBullets();
        checkCollisions();
        updateHUD();
        updatePowerBar();

        // Yeni Toplar Oluştur
        if (Math.random() < 0.02) {
            createBall();
        }

        // 10000 Puan Kontrolü
        if (score >= 10000) {
            gameWon = true;
        }

        requestAnimationFrame(gameLoop);
    } else if (gameOver) {
        drawGameOver();
    } else if (gameWon) {
        drawGameWon();
    }
}

gameLoop();