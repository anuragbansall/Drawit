const colorOptions = document.getElementById('color-options');
const drawingOptions = document.getElementById('drawing-options');
const drawingSizes = document.getElementById('drawing-sizes');

let selectedColor = "000000";
let drawingOption = "";
let drawingSize = "1";

colorOptions.addEventListener('click', (e) => {
  if (e.target.classList.contains('color-option')) {
    selectedColor = e.target.dataset.colorHex;
    console.log(`Selected color: ${selectedColor}`);
  }
});

let previousDrawingOption = null;

drawingOptions.addEventListener('click', (e) => {
  const drawingOptionElement = e.target.closest('.drawing-option');
  
  if (drawingOptionElement) {
    if (previousDrawingOption && previousDrawingOption !== drawingOptionElement) {
      previousDrawingOption.style.scale = 1;
    }

    drawingOptionElement.style.scale = 1.4;
    drawingOption = drawingOptionElement.dataset.tool;
    console.log(`Selected option: ${drawingOption}`);

    previousDrawingOption = drawingOptionElement;
  }
});

drawingSizes.addEventListener('change', (e) => {
  drawingSize = e.target.value;
  console.log(`Selected size: ${drawingSize}`);
});
