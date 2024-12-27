const colorOptions = document.getElementById('color-options');
const drawingOptions = document.getElementById('drawing-options');
const drawingSizes = document.getElementById('drawing-sizes');
const pencilIcon = document.getElementById('pencil-icon');
const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');

let selectedColor = "#000000";
let drawingOption = "";
let drawingSize = 1;

colorOptions.addEventListener('click', (e) => {
  if (e.target.classList.contains('color-option')) {
    document.querySelectorAll('.color-option.active').forEach((option) => {
      option.classList.remove('active');
    });

    const selectedColorElement = e.target;
    selectedColorElement.classList.add('active');

    selectedColor = selectedColorElement.dataset.colorHex;
    pencilIcon.querySelector('polygon').setAttribute('fill', `${selectedColor}`);
    pencilIcon.querySelector('rect').setAttribute('fill', `${selectedColor}`);
  }
});

drawingOptions.addEventListener('click', (e) => {
  const drawingOptionElement = e.target.closest('.drawing-option');

  if (drawingOptionElement) {
    document.querySelectorAll('.drawing-option.active').forEach((option) => {
      option.classList.remove('active');
    });

    drawingOptionElement.classList.add('active');
    drawingOption = drawingOptionElement.dataset.tool;
  }
});

drawingSizes.addEventListener('change', (e) => {
  drawingSize = e.target.value;
});

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let canvasData;

window.addEventListener("resize", () => {
  canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (canvasData) ctx.putImageData(canvasData, 0, 0);
});

let isDrawing = false;
let isErasing = false;

// Undo and Redo stacks
let undoStack = [];
let redoStack = [];

function saveCanvasState() {
  const dataURL = canvas.toDataURL();
  if (undoStack.length === 0 || undoStack[undoStack.length - 1] !== dataURL) {
    undoStack.push(dataURL);
    redoStack = []; // Clear redo stack when a new action is performed
  }
}

function undo() {
  if (undoStack.length > 1) {
    redoStack.push(undoStack.pop());
    restoreCanvas(undoStack[undoStack.length - 1]);
  }
}

function redo() {
  if (redoStack.length > 0) {
    const nextState = redoStack.pop();
    undoStack.push(nextState);
    restoreCanvas(nextState);
  }
}

function restoreCanvas(dataURL) {
  const img = new Image();
  img.src = dataURL;
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
}

function getClientCoordinates(e) {
  if (e.touches) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  } else {
    return { x: e.clientX, y: e.clientY };
  }
}

function drawLine(x, y) {
  ctx.lineTo(x, y);
  ctx.strokeStyle = `${selectedColor}`;
  ctx.lineWidth = drawingSize;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function eraseLine(x, y) {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
}

// Canvas event listeners
document.addEventListener('mousedown', (e) => {
  if (drawingOption === "pencil" || drawingOption === "eraser") {
    saveCanvasState();
    isDrawing = true;
    const { x, y } = getClientCoordinates(e);
    ctx.beginPath();
    if (drawingOption === "pencil") {
      drawLine(x, y);
    } else if (drawingOption === "eraser") {
      eraseLine(x, y);
    }
  }
});

document.addEventListener('mousemove', (e) => {
  if (isDrawing && drawingOption === "pencil") {
    const { x, y } = getClientCoordinates(e);
    drawLine(x, y);
  } else if (isDrawing && drawingOption === "eraser") {
    const { x, y } = getClientCoordinates(e);
    eraseLine(x, y);
  }
});

document.addEventListener('mouseup', () => {
  if (isDrawing || isErasing) {
    saveCanvasState();
    isDrawing = false;
    isErasing = false;
  }
});

document.addEventListener('mouseleave', () => {
  isDrawing = false;
  isErasing = false;
});

// Touch event listeners for mobile devices
document.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (drawingOption === "pencil" || drawingOption === "eraser") {
    saveCanvasState();
    isDrawing = true;
    const { x, y } = getClientCoordinates(e);
    ctx.beginPath();
    if (drawingOption === "pencil") {
      drawLine(x, y);
    } else if (drawingOption === "eraser") {
      eraseLine(x, y);
    }
  }
});

document.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (isDrawing && drawingOption === "pencil") {
    const { x, y } = getClientCoordinates(e);
    drawLine(x, y);
  } else if (isDrawing && drawingOption === "eraser") {
    const { x, y } = getClientCoordinates(e);
    eraseLine(x, y);
  }
});

document.addEventListener('touchend', () => {
  if (isDrawing || isErasing) {
    saveCanvasState();
    isDrawing = false;
    isErasing = false;
  }
});

// Keyboard shortcuts for undo and redo
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'z') {
    undo();
  } else if (e.ctrlKey && e.key === 'y') {
    redo();
  }
});

undoBtn.addEventListener('click', undo);
redoBtn.addEventListener('click', redo);