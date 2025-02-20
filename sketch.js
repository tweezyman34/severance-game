let numbers = [];
let bins = { 'WO': 0, 'FC': 0, 'DR': 0, 'MA': 0 };
let currentNumber;
let emotions = ['WO', 'FC', 'DR', 'MA'];
let binCapacity = 100;
let numbersToProcess = 100;
let processedNumbers = 0;
let correctCategorizations = 0;
let buttonWidth = 80;
let buttonHeight = 40;

// Define colors as RGB arrays initially, then convert in setup()
let colorDefs = {
  'WO': [255, 107, 107], // RGB for #FF6B6B (red)
  'FC': [78, 205, 196],  // RGB for #4ECDC4 (teal)
  'DR': [69, 183, 209],  // RGB for #45B7D1 (blue)
  'MA': [150, 206, 180]  // RGB for #96CEB4 (green)
};
let colors; // Will be initialized in setup() as p5.js color objects

function setup() {
  createCanvas(600, 500);
  textAlign(CENTER, CENTER);
  textSize(20);
  
  // Initialize colors as p5.js color objects
  colors = {
    'WO': color(colorDefs.WO[0], colorDefs.WO[1], colorDefs.WO[2]),
    'FC': color(colorDefs.FC[0], colorDefs.FC[1], colorDefs.FC[2]),
    'DR': color(colorDefs.DR[0], colorDefs.DR[1], colorDefs.DR[2]),
    'MA': color(colorDefs.MA[0], colorDefs.MA[1], colorDefs.MA[2])
  };
  
  generateNumbers();
  currentNumber = numbers[processedNumbers];
}

function draw() {
  background(240); // Light gray background

  // Title and instructions
  fill(0);
  textSize(24);
  text('Macro Data Refinement', width / 2, 40);
  textSize(18);
  text('Categorize the number:', width / 2, 100);
  text(currentNumber, width / 2, 150);

  // Display bins as colored boxes
  drawBins();

  // Categorization buttons
  drawCategorizationButtons();

  // Show completion status
  if (processedNumbers >= numbersToProcess) {
    fill(0);
    textSize(24);
    text('Processing Complete!', width / 2, 400);
    textSize(18);
    text(`Correct: ${correctCategorizations}/${numbersToProcess}`, width / 2, 450);
  }

  // Reset cursor if not over buttons or bins
  cursor();
}

function drawBins() {
  let x = 50;
  let y = 200;
  for (let emotion of emotions) {
    let colorValue = map(bins[emotion], 0, 100, 100, 255); // Lighter as bin fills
    fill(colorValue, 100, 100); // Hue based on progress
    stroke(0);
    strokeWeight(2);
    rect(x, y, 120, 60, 10);
    fill(0);
    textSize(16);
    text(`${emotion}: ${bins[emotion]}%`, x + 60, y + 30);

    // Check if mouse is over this bin
    if (mouseX > x && mouseX < x + 120 &&
        mouseY > y && mouseY < y + 60) {
      cursor('pointer'); // Change cursor to pointer when hovering over bin
    }
    x += 140;
  }
}

function drawCategorizationButtons() {
  let x = (width - (buttonWidth + 10) * 4) / 2;
  let y = 300;
  
  for (let i = 0; i < emotions.length; i++) {
    let emotion = emotions[i];
    let buttonX = x + i * (buttonWidth + 10);
    let isHovering = mouseX > buttonX && mouseX < buttonX + buttonWidth &&
                     mouseY > y && mouseY < y + buttonHeight;

    // Button background color (lighter when hovered)
    fill(red(colors[emotion]), green(colors[emotion]), blue(colors[emotion]), isHovering ? 200 : 255);
    stroke(0);
    strokeWeight(2);
    rect(buttonX, y, buttonWidth, buttonHeight, 5);

    // Button text (white when hovered, black otherwise)
    fill(isHovering ? 255 : 0);
    textSize(16);
    text(emotion, buttonX + buttonWidth / 2, y + buttonHeight / 2);

    // Cursor change for buttons
    if (isHovering) {
      cursor('pointer'); // Change cursor to pointer when hovering over button
    }
  }
}

function mousePressed() {
  if (processedNumbers < numbersToProcess) {
    let x = (width - (buttonWidth + 10) * 4) / 2;
    let y = 300;
    
    for (let i = 0; i < emotions.length; i++) {
      let emotion = emotions[i];
      let buttonX = x + i * (buttonWidth + 10);
      if (mouseX > buttonX && mouseX < buttonX + buttonWidth &&
          mouseY > y && mouseY < y + buttonHeight) {
        console.log("Clicked button:", emotion, "at", mouseX, mouseY); // Debug log
        let trueEmotion = determineTrueEmotion(currentNumber);
        if (emotion === trueEmotion) {
          // Only increment if bin is less than 100%
          if (bins[emotion] < 100) {
            bins[emotion] = min(bins[emotion] + 5, 100); // Cap at 100%
            correctCategorizations++;
          }
        }
        processedNumbers++;
        if (processedNumbers < numbersToProcess) {
          currentNumber = numbers[processedNumbers];
        }
        break;
      }
    }
  }
}

function generateNumbers() {
  for (let i = 0; i < numbersToProcess; i++) {
    numbers.push(floor(random(1, 100)));
  }
}

function determineTrueEmotion(number) {
  if (number % 4 === 0) return 'WO';
  else if (number % 3 === 0) return 'FC';
  else if (number % 5 === 0) return 'DR';
  else return 'MA';
}