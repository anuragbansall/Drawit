const colorOptions = document.getElementById('color-options');
const drawingOptions = document.getElementById('drawing-options');
const drawingSizes = document.getElementById('drawing-sizes');
const pencilIcon = document.getElementById('pencil-icon')

let selectedColor = "000000";
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

    previousDrawingOption = drawingOptionElement;
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

function getClientCoordinates(e) {
  if (e.touches) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  } else {
    return { x: e.clientX, y: e.clientY };
  }
}

canvas.addEventListener('mousedown', (e) => {
  if (drawingOption === "pencil") { 
    isDrawing = true;
    const { x, y } = getClientCoordinates(e);
    ctx.beginPath();
    drawLine(x, y);
  } else if (drawingOption === "eraser") {
    isErasing = true;
    const { x, y } = getClientCoordinates(e);
    eraseLine(x, y);
  }
});

canvas.addEventListener('touchstart', (e) => {
  if (drawingOption === "pencil") { 
    isDrawing = true;
    const { x, y } = getClientCoordinates(e);
    ctx.beginPath();
    drawLine(x, y);
  } else if (drawingOption === "eraser") {
    isErasing = true;
    const { x, y } = getClientCoordinates(e);
    eraseLine(x, y);
  }
});

document.addEventListener('mousemove', (e) => {
  if (isDrawing && drawingOption === "pencil") { 
    const { x, y } = getClientCoordinates(e);
    drawLine(x, y);
  } else if (isErasing && drawingOption === "eraser") {
    const { x, y } = getClientCoordinates(e);
    eraseLine(x, y);
  }
});

document.addEventListener('touchmove', (e) => {
  if (isDrawing && drawingOption === "pencil") { 
    const { x, y } = getClientCoordinates(e);
    drawLine(x, y);
  } else if (isErasing && drawingOption === "eraser") {
    const { x, y } = getClientCoordinates(e);
    eraseLine(x, y);
  }
});

document.addEventListener('mouseup', () => {
  isDrawing = false;
  isErasing = false;
});

document.addEventListener('touchend', () => {
  isDrawing = false;
  isErasing = false;
});

document.addEventListener('mouseleave', () => {
  isDrawing = false;
  isErasing = false;
});

document.addEventListener('touchleave', () => {
  isDrawing = false;
  isErasing = false;
});

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
