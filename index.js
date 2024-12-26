const colorOptions = document.getElementById('color-options');
const drawingOptions = document.getElementById('drawing-options');
const drawingSizes = document.getElementById('drawing-sizes');

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
      console.log(`Selected color: ${selectedColor}`);
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
    console.log(`Selected option: ${drawingOption}`);

    previousDrawingOption = drawingOptionElement;
  }
});

drawingSizes.addEventListener('change', (e) => {
  drawingSize = e.target.value;
  console.log(`Selected size: ${drawingSize}`);
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
let isErasing = false

canvas.addEventListener('mousedown', (e) => {
  if (drawingOption === "pencil") { 
    isDrawing = true;
    ctx.beginPath();
    drawLine(e.clientX, e.clientY);
  }else if(drawingOption === "eraser"){
    isErasing = true
    eraseLine(e.clientX, e.clientY)
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (isDrawing && drawingOption === "pencil") { 
    drawLine(e.clientX, e.clientY);
  }else if(isErasing && drawingOption === "eraser"){
    eraseLine(e.clientX, e.clientY)
  }
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
  isErasing = false
});

canvas.addEventListener('mouseleave', () => {
  isDrawing = false;
  isErasing = false
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