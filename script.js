// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Oyuncu (Sabit Araç)
const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    radius: 20,
    color: "blue"
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

// Oyun Durumu
let gameOver = false;
let gameWon = false;

// Mouse Pozisyonu
let mouseX = player.x;
let mouseY = player.y;

// Sürekli Ateş Etme İçin Interval
let fireInterval;

// Mouse Hareketini Takip Etme
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

// Mouse Sol Tık'a Basıldığında
canvas.addEventListener('mousedown', (event) => {
    if (event.button === 0) { // Sol tık
        fireBullet(); // İlk mermiyi hemen ateşle
        fireInterval = setInterval(fireBullet, 100); // Her 100 ms'de bir mermi ateşle
    }
});

// Mouse Sol Tık Bırakıldığında
canvas.addEventListener('mouseup', (event) => {
    if (event.button === 0) { // Sol tık
        clearInterval(fireInterval); // Interval'i durdur
    }
});

// Mermi Ateşleme Fonksiyonu
function fireBullet() {
    if (gameOver || gameWon) return; // Oyun bittiyse veya kazanıldıysa ateş etme

    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
    const speed = 5;

    bullets.push({
        x: player.x,
        y: player.y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed
    });
}

// Topları Oluşturma
function createBall() {
    const x = Math.random() * canvas.width;
    const y = 0;
    const dx = (Math.random() - 0.5) * ballSpeed;
    const dy = Math.random() * ballSpeed + 1;
    balls.push({ x, y, dx, dy, radius: ballRadius, color: "red" });
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
        ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "black";
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
            if (distance < ball.radius + 5) {
                // Çarpışma Oldu
                balls.splice(ballIndex, 1);
                bullets.splice(bulletIndex, 1);
                score += 10; // Puan Artışı

                // 1000 Puan Kontrolü
                if (score >= 1000) {
                    gameWon = true;
                }
            }
        });
    });
}

// Puan ve Canları Gösterme
function drawHUD() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Puan: " + score, 10, 30);
    ctx.fillText("Can: " + lives, 10, 60);
}

// Game Over Ekranı
function drawGameOver() {
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Puanınız: " + score, canvas.width / 2 - 50, canvas.height / 2 + 30);
}

// Kazanma Ekranı
function drawGameWon() {
    ctx.fillStyle = "green";
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
        drawHUD();

        // Yeni Toplar Oluştur
        if (Math.random() < 0.02) {
            createBall();
        }

        requestAnimationFrame(gameLoop);
    } else if (gameOver) {
        drawGameOver();
    } else if (gameWon) {
        drawGameWon();
    }
}

gameLoop();