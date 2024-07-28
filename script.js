const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let points = [];
let currentPoint = 0;
const audioCorrect = new Audio('correct.mp3');
const audioWrong = new Audio('wrong.mp3');

function drawDot(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#00796b';
    ctx.fill();
}

function drawLine(x1, y1, x2, y2) {
    let progress = 0;
    const interval = setInterval(() => {
        if (progress >= 1) {
            clearInterval(interval);
            return;
        }
        progress += 0.02;
        const currentX = x1 + progress * (x2 - x1);
        const currentY = y1 + progress * (y2 - y1);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = '#00796b';
        ctx.lineWidth = 3;
        ctx.stroke();
    }, 20);
}

function startGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = [
        {x: 100, y: 100},
        {x: 200, y: 50},
        {x: 300, y: 100},
        {x: 400, y: 50},
        {x: 500, y: 100},
        {x: 500, y: 300},
        {x: 400, y: 350},
        {x: 300, y: 300},
        {x: 200, y: 350},
        {x: 100, y: 300},
        {x: 100, y: 100}
    ];
    currentPoint = 0;
    points.forEach(point => drawDot(point.x, point.y));
    document.getElementById('feedback').innerText = '';
    canvas.addEventListener('mousedown', handleMouseDown);
}

function handleMouseDown(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (isCloseToPoint(x, y, points[currentPoint])) {
        if (currentPoint > 0) {
            drawLine(points[currentPoint - 1].x, points[currentPoint - 1].y, points[currentPoint].x, points[currentPoint].y);
            audioCorrect.play();
        }
        currentPoint++;
        if (currentPoint === points.length) {
            document.getElementById('feedback').innerText = 'Great Job!';
            canvas.removeEventListener('mousedown', handleMouseDown);
        }
    } else {
        audioWrong.play();
    }
}

function isCloseToPoint(x, y, point) {
    const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
    return distance < 20;
}

document.addEventListener('DOMContentLoaded', (event) => {
    startGame();
});
