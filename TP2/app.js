const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const rectangleButton = document.getElementById("rectangleButton");

// Valeurs par défaut
let isPainting = false;
let isRectangleMode = false;
let lastX = 0;
let lastY = 0;
let color = "#000000";
let lineWidth = 1;


// Event listeners pour commencer a dessiner
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mousemove", draw);
// Event listener pour arreter de dessiner
canvas.addEventListener("mouseup", stopPainting);


// Function pour dessiner l'ors d'un mouvement de la souris
function draw(e) {
    if (!isPainting) return;
    // Definir les options de l'user
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";

    // Dessiner une ligne du dernier point jusqu'au nouveau
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

// Function pour commencer a déssiner lors d'un click 
function startPainting(e) {
    isPainting = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

// Si l'on n'appuie pas le tracé s'arrête
function stopPainting() {
    isPainting = false;
}

// Changer la couleur de la ligne
function changeColor(newColor) {
    color = newColor;
}

// Changer l'épaisseur de la ligne
function changeLineWidth(value) {
    lineWidth = value;
}

// Effacer le tableau
function clearCanvas() {
    e.preventDefault();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function changeMode() {
    isRectangleMode = !isRectangleMode;
    let modeButton = document.getElementById('modeButton');

    if (isRectangleMode) {
        modeButton.textContent = 'Paint Mode';
    } else {
        modeButton.textContent = 'Rectangle Mode';
    }
}

function drawRect(event) {
    if (isRectangleMode) {
        let x = event.offsetX;
        let y = event.offsetY;

        ctx.fillStyle = color;
        ctx.fillRect(x - 25, y - 25, 100, 50); 
    }
}

canvas.addEventListener('mousedown', function (event) {
    if (isRectangleMode) {
        drawRect(event);
    }
});