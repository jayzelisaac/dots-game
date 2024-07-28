const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let points = [];
let currentPoint = 0;
const audioCorrect = new Audio('correct.mp3');
const audioWrong = new Audio('wrong.wav');

const letterA = [
    {x: 200, y: 300},  // 1 - Bottom left
    {x: 250, y: 200},  // 2 - Center left
    {x: 300, y: 100},  // 3 - Top
    {x: 350, y: 200},  // 4 - Center right
    {x: 400, y: 300},  // 5 - Bottom right
    {x: 250, y: 200},  // 2 - Center left again (jump)
    {x: 350, y: 200}   // 4 - Center right (cross)
];

const dotRadius = 10; // Increased dot size
const lineWidth = 6;  // Increased line width

function drawDot(x, y, isHint = false) {
    ctx.beginPath();
    ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
    ctx.fillStyle = isHint ? '#ff0000' : '#00796b';
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
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }, 20);
}

function startGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = letterA;
    currentPoint = 0;
    points.forEach((point, index) => drawDot(point.x, point.y, index === 0));
    document.getElementById('feedback').innerText = `Connect the dots to reveal the letter A`;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('touchstart', handleTouchStart);
    blinkHint(points[currentPoint]);
}

function handleMouseDown(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    processInput(x, y);
}

function handleTouchStart(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.touches[0].clientX - rect.left;
    const y = event.touches[0].clientY - rect.top;
    processInput(x, y);
}

function processInput(x, y) {
    if (isCloseToPoint(x, y, points[currentPoint])) {
        if (currentPoint > 0 && currentPoint !== 5) { // Avoid drawing line between 5 and 2
            drawLine(points[currentPoint - 1].x, points[currentPoint - 1].y, points[currentPoint].x, points[currentPoint].y);
            audioCorrect.play();
        }
        currentPoint++;
        if (currentPoint === points.length) {
            document.getElementById('feedback').innerText = 'Great Job!';
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('touchstart', handleTouchStart);
        } else {
            blinkHint(points[currentPoint]);
        }
    } else {
        audioWrong.play();
    }
}

function isCloseToPoint(x, y, point) {
    const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
    return distance < 20;
}

function blinkHint(point) {
    let isVisible = true;
    const interval = setInterval(() => {
        drawDot(point.x, point.y, isVisible);
        isVisible = !isVisible;
    }, 500);
    setTimeout(() => clearInterval(interval), 5000); // Blink for 5 seconds
}

document.addEventListener('DOMContentLoaded', (event) => {
    startGame();
});
