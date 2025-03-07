const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const levelBar = document.getElementById('levelBar');
const powerBar = document.getElementById('powerBar');
const powerBarText = document.getElementById('powerBarText');
const autoFireRateElement = document.getElementById('autoFireRate');

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
let ballSpeed = 2; // Başlangıç hızı

// Mermiler
let bullets = [];

// Puan
let score = 0;

// Can Sayısı
let lives = 3;

// Başlangıç
let level = 1;

// Oyun Durumu
let gameOver = false;

// Mouse Pozisyonu
let mouseX = player.x;
let mouseY = player.y;

// Torpido Sayacı (Sadece "normal mermiler" ile yok edilen toplar sayesinde)
let destroyedBallsCount = 0;

// "Otomatik ateş" durumu ve zamanlayıcı
let isAutoFireActive = false;
let lastFireTime = 0;

// Space tuşu durumu
let isSpacePressed = false;

// Mouse hareketini takip et.
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

// Mouse tıklamasını dinle.
canvas.addEventListener('mousedown', (event) => {
    if (event.button === 0 && !isAutoFireActive) { // "Otomatik ateş" sistemi kapalıysa
        fireBullet();
    } else if (event.button === 2 && destroyedBallsCount >= 20) { // Sağ tık (torpido)
        firePowerBullet();
    }
});

// "Sağ tık" ile menü açma özelliği devre dışı (Çünkü oyunda "sağ tık" için başka bir özellik var.)
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// Space tuşu ile ateş et.
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !isAutoFireActive && !isSpacePressed) { // Otomatik ateş kapalıysa ve space tuşu daha önce basılmamışsa (basılı tutarak ateş edilmesini engellemek için)
        fireBullet();
        isSpacePressed = true; // Space tuşunun basıldığını işaretle.
    }
});

// Space tuşu bırakıldığında
document.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
        isSpacePressed = false; // Space tuşunun bırakıldığını işaretle.
    }
});

// "F" tuşu dinleyicisi
document.addEventListener('keydown', (event) => {
    if (event.key === 'f' || event.key === 'F') {
        isAutoFireActive = !isAutoFireActive; // Aç & Kapat
        updateAutoFireIndicator(); // Göstergeyi güncelle.

        // Otomatik ateş başlat
        if (isAutoFireActive) {
            autoFire();
        }
    }
});

// "Otomatik ateş" fonksiyonu
function autoFire() {
    if (!isAutoFireActive) return; // Eğer "otomatik ateş" kapalıysa dur.

    const currentTime = Date.now();
    const fireInterval = 1000 / level; // 1 saniyede gönderilen otomatik mermi sayısı, level sayısına eşit.

    if (currentTime - lastFireTime >= fireInterval) {
        fireBullet(); // Mermi ateşle
        lastFireTime = currentTime; // Son ateş zamanını güncelle
    }

    // "Otomatik ateş" devam ettirilir.
    requestAnimationFrame(autoFire);
}

// Göstergeyi güncelleme fonksiyonu
function updateAutoFireIndicator() {
    const autoFireStatus = document.getElementById('autoFireStatus');
    if (isAutoFireActive) {
        autoFireStatus.textContent = "Açık";
        autoFireStatus.classList.add('active');
    } else {
        autoFireStatus.textContent = "Kapalı";
        autoFireStatus.classList.remove('active');
    }
    autoFireRateElement.textContent = level; // 1 saniyede "level" kadar otomatik mermi atılır.
}

// "Normal mermi" ateşleme fonksiyonu
function fireBullet() {
    if (gameOver) return;

    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
    const speed = 7.5;

    bullets.push({
        x: player.x,
        y: player.y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        isPowerBullet: false, // Normal mermi
        radius: 5, // Normal mermi boyutu
        color: "#ffffff"
    });
}

// "Torpido" ateşleme fonksiyonu
function firePowerBullet() {
    if (gameOver) return;

    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
    const speed = 7.5;

    bullets.push({
        x: player.x,
        y: player.y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        isPowerBullet: true, // Torpido
        radius: ballRadius, // Torpido boyutu
        color: "#000000"
    });

    destroyedBallsCount = 0; // Torpido ateşlendiği anda sayacı sıfırla.
    updatePowerBar(); // Bar'ı güncelle.
}

// Torpido Bar'ını Güncelle
function updatePowerBar() {
    if (destroyedBallsCount >= 20) {
        powerBar.style.width = "100%"; // Bar tamamen dolu.
        powerBarText.textContent = "Torpido hazır!";
        powerBarText.style.opacity = 1;
    } else {
        const powerProgress = (destroyedBallsCount / 20) * 100;
        powerBar.style.width = powerProgress + "%";
        powerBarText.style.opacity = 0;
    }
}

// Rakip Topları Oluştur
function createBall() {
    const x = Math.random() * canvas.width;
    const y = 0;
    const dx = (Math.random() - 0.5) * ballSpeed;
    const dy = Math.random() * ballSpeed + 1;
    balls.push({ x, y, dx, dy, radius: ballRadius, color: "#ff0000" });
}

// Oyuncuyu Çiz
function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
}

// Topları Çiz ve Hareket Ettir
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
            lives--; // Can azalt.
            balls.splice(index, 1); // Çarpan topu yok et.

            if (lives === 0) {
                gameOver = true; // Can küreleri bittiyse, oyunu biter.
            }
        }

        // Topun Ekrandan Çıkması
        if (ball.y > canvas.height) {
            balls.splice(index, 1);
        }
    });
}

// Mermileri çiz ve hareket ettir.
function drawBullets() {
    bullets.forEach((bullet, index) => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = bullet.color;
        ctx.fill();
        ctx.closePath();

        // Merminin hareketi
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        // Merminin ekrandan çıkması
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(index, 1);
        }
    });
}

// Çarpışma kontrolü (collision detection)
function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        balls.forEach((ball, ballIndex) => {
            const distance = Math.sqrt((bullet.x - ball.x) ** 2 + (bullet.y - ball.y) ** 2);
            if (distance < ball.radius + bullet.radius) {
                if (bullet.isPowerBullet) {
                    // Torpido: İsabet ettiği tüm topları yok eder.
                    balls.splice(ballIndex, 1);

                    // İsabet ettiği her hedef için puan kazandır.
                    let nextLevelRequirement = 200 * Math.pow(2, level - 1); // Bir sonraki seviye için gereken puan.
                    let torpedoScore = nextLevelRequirement * 0.1; // %10'unu "puan" olarak kazandır.
                    score += torpedoScore; // Toplam puan'a ekle.

                    // Torpido ile yok edilen toplar, torpido bar'ını etkilemez.
                } else {
                    // Normal mermi: Sadece 1 topu yok eder.
                    balls.splice(ballIndex, 1);
                    bullets.splice(bulletIndex, 1);
                    score += level * 10; // Level ile orantılı olarak puan kazanılır; mesela "level 3" için 30 puan.
                    destroyedBallsCount++; // Sadece "normal mermiler" ile yok edilen toplar, torpido bar'ına katkı sağlar.
                    updatePowerBar(); // Bar'ı güncelle.
                }
            }
        });
    });
}

// Puan ve Level Up
function updateHUD() {
    scoreElement.textContent = "Puan: " + score;
    levelElement.textContent = "Level: " + level;

    // Level Bar Güncelleme
    const levelProgress = (score % (200 * Math.pow(2, level - 1))) / (200 * Math.pow(2, level - 1)) * 100;
    levelBar.style.width = levelProgress + "%";

    // Level Atlama
    if (score >= 200 * Math.pow(2, level - 1)) {
        level++;
        ballSpeed *= 1.20; // Her "level up" sonrasında, rakip topların hızı %20 artar.
        updateAutoFireIndicator(); // Update the auto fire rate when level changes.
    }

    // Can Görselini Güncelle
    const lifeElements = document.querySelectorAll('.life');
    lifeElements.forEach((life, index) => {
        if (index < lives) {
            life.classList.remove('lost');
        } else {
            life.classList.add('lost');
        }
    });
}

function drawGameOver() {
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center"; // Yatay ortalama
    ctx.textBaseline = "middle"; // Dikey ortalama

    ctx.font = "35px Arial";
    ctx.fillText("Kaybettiniz!", canvas.width / 2, canvas.height / 2 - 30); // Üst satır

    ctx.font = "35px Arial";
    ctx.fillText("Puanınız: " + score, canvas.width / 2, canvas.height / 2 + 30); // Alt satır
}

// Ana Oyun Döngüsü
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        drawPlayer();
        drawBalls();
        drawBullets();
        checkCollisions();
        updateHUD();
        updatePowerBar();

        // Yeni toplar oluştur.
        if (Math.random() < 0.02) {
            createBall();
        }

        requestAnimationFrame(gameLoop);
    } else {
        drawGameOver();
    }
}

gameLoop(); // Oyunu başlat.