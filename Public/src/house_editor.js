// Initialize variables
let shapes = []
let startY = 0
let endX = 0
let endY = 0
let typeId = 0
let selectedShape = "square" // Default selected shape
let drawingInProgress = false // To check if shape drawing is in progress
let currentShape = null // To store the currently drawn shape
let shapeColor = "red" // Default shape color for new shapes


// Function to create a square
function createSquare(startX, startY, endX, endY) {
  const squareElement = document.createElement("div")
  squareElement.classList.add("shape")
  squareElement.classList.add("square")
  squareElement.style.backgroundColor = shapeColor // Set shape color
  squareElement.style.width = Math.abs(endX - startX) + "px"
  squareElement.style.height = Math.abs(endY - startY) + "px"
  squareElement.style.left = Math.min(startX, endX) + "px"
  squareElement.style.top = Math.min(startY, endY) + "px"
  squareElement.setAttribute("data-present", "true") // Set data attribute to indicate presence
  return squareElement
}

// Function to create a circle
function createCircle(startX, startY, endX, endY) {
  const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2)
  const circleElement = document.createElement("div")
  circleElement.classList.add("shape")
  circleElement.classList.add("circle")
  circleElement.style.backgroundColor = shapeColor // Set shape color
  circleElement.style.width = 2 * radius + "px"
  circleElement.style.height = 2 * radius + "px"
  circleElement.style.left = startX - radius + "px"
  circleElement.style.top = startY - radius + "px"
  circleElement.setAttribute("data-present", "true") // Set data attribute to indicate presence
  return circleElement
}

// Function to add shape on mousedown
function addShape(event) {
  if (!drawingInProgress) {
    drawingInProgress = true
    const container = document.getElementById("shapes-container")
    startX = event.clientX - container.getBoundingClientRect().left
    startY = event.clientY - container.getBoundingClientRect().top
  }
}

// Function to resize shape on mousemove
function resizeShape(event) {
  if (drawingInProgress) {
    const container = document.getElementById("shapes-container")
    endX = event.clientX - container.getBoundingClientRect().left
    endY = event.clientY - container.getBoundingClientRect().top
    let shape
    if (selectedShape === "circle") {
      shape = createCircle(startX, startY, endX, endY)
    } else {
      shape = createSquare(startX, startY, endX, endY)
    }
    if (currentShape) {
      container.removeChild(currentShape)
    }
    currentShape = shape
    container.appendChild(shape)
  }
}

// Function to stop resizing on mouseup
function stopResizing() {
  if (drawingInProgress) {
    drawingInProgress = false
    if (currentShape) {
      shapes.push(currentShape)
      currentShape.setAttribute("data-present", "true") // Set data attribute to indicate presence
      displayShapeInfo(startX, startY, endX, endY, shapeColor)
      currentShape = null
    }
  }
}

// Function to display shape information
function displayShapeInfo(startX, startY, endX, endY, shapeColor) {
  const shapeInfo = document.getElementById("shapeInfo");
  const shapeType =
      selectedShape.charAt(0).toUpperCase() + selectedShape.slice(1);
  const info = document.createElement("div");
  info.textContent = `${shapeType}: Start (${startX}, ${startY}), End (${endX}, ${endY}) TypeID ${getTypeID(shapeColor)}`;

  shapeInfo.appendChild(info);
}

// Function to delete the most recent shape
function deleteShape() {
  const shapeInfo = document.getElementById("shapeInfo")
  const lastShapeIndex = shapes.length - 1
  if (lastShapeIndex >= 0) {
    const shapeToRemove = shapes[lastShapeIndex]
    if (shapeToRemove.getAttribute("data-present") === "true") {
      shapeToRemove.parentNode.removeChild(shapeToRemove) // Remove shape from DOM
      shapes.pop() // Remove shape from shapes array
      shapeInfo.removeChild(shapeInfo.lastChild) // Remove the most recent shape info line
    }
  }
}

// Function to change the color of the shapes
function changeShapeColor(color) {
  shapeColor = color
}

// Function to select the shape
function selectShape(shape) {
  selectedShape = shape
  document.querySelectorAll(".shape-buttons button").forEach((button) => {
    button.style.fontWeight = "normal" // Reset all button styles
  })
  document.getElementById(selectedShape + "Button").style.fontWeight =
    "bold" // Bold the selected button
}

// Function to create a cone
function drawCone() {
  // Get input values
  const positionX = parseInt(document.getElementById("positionX").value)
  const positionY = parseInt(document.getElementById("positionY").value)
  const size = parseInt(document.getElementById("size").value)
  const rotation = parseInt(document.getElementById("rotation").value)

  // Create cone element
  const coneElement = document.createElement("div")
  coneElement.classList.add("shape")
  coneElement.classList.add("cone")
  coneElement.style.left = positionX + "px"
  coneElement.style.top = positionY + "px"
  coneElement.style.width = size + "px"
  coneElement.style.height = size / 2 + "px"
  coneElement.style.transform = `rotate(${rotation}deg)`

  // Append cone to shapes container
  document.getElementById("shapes-container").appendChild(coneElement)

  // Push cone to shapes array
  shapes.push(coneElement)

  // Display cone information in the shape log
  displayShapeInfo(
    positionX,
    positionY,
    positionX + size,
    positionY + size / 2,
    "cone"
  )
}

function submitShapes() {
  // Get the image container and its dimensions
  const imageContainer = document.getElementById("container");
  const containerRect = imageContainer.getBoundingClientRect();
  const containerLeft = containerRect.left;
  const containerTop = containerRect.top;
  
  // Get the image element and its dimensions
  const image = document.getElementById("image");
  const imageWidth = image.width;
  const imageHeight = image.height;

  // Extract shape information
  const shapeData = shapes.map(shape => {
    const rect = shape.getBoundingClientRect();
    return {
      type: shape.classList.contains("square") ? "square" : "circle",
      startX: rect.left - containerLeft, // Adjust coordinates based on container top-left corner
      startY: rect.top - containerTop,
      endX: rect.right - containerLeft,
      endY: rect.bottom - containerTop,
      typeID: getTypeID(shape.style.backgroundColor)
    };
  });
  const inputText = document.getElementById("textInput").value;

  // Include image dimensions in the output
  const sceneData = {
    imageWidth: imageWidth,
    imageHeight: imageHeight,
    cameraQuantiy: inputText
  };

  // Log shape data to the console
  //console.log(shapeData);
  let b = new Board(shapeData, sceneData);
  let cameras = b.getCameras();
  let cInfo = b.getCameraInfo();

  console.log(cameras);

  cameras.forEach(camera => {
    const { x: positionX, y: positionY, rotation } = camera;

    drawTriangle(positionX, positionY, cInfo.fod, cInfo.fov, rotation)
  });
  
  
}

function drawTriangle(x1, y1, FOD, FOV, angle) {
  // angle in degrees to positive x = 0 degrees
  // isosceles triangle

  let x2 = x1 + (FOD*Math.cos(angle+(FOV/2)));
  let y2 = y1 + (FOD*Math.sin(angle+(FOV/2)));
  let x3 = x1 + (FOD*Math.cos(angle-(FOV/2)));
  let y3 = y1 + (FOD*Math.sin(angle-(FOV/2)));

  // Draw the three lines to form the triangle
  drawLine(x1, y1, x2, y2, 2, "blue"); // Line from vertex 1 to vertex 2
  drawLine(x2, y2, x3, y3, 2, "blue"); // Line from vertex 2 to vertex 3
  drawLine(x3, y3, x1, y1, 2, "blue"); // Line from vertex 3 to vertex 1
}










function getTypeID(color) {
  let typeID;
  if (color == "red") {
      return "Exterior Walls";
  } else if (color == "orange") {
      return "Placeable Zones";
  } else if (color == "green") {
      return "Door";
  } else if (color == "purple") {
      return "Car";
  } else if (color == "yellow") {
      return "Window";
  } else if (color == "blue") {
      return "Pool";
  } else {
      return -1; // Unknown type
  }
}



function drawLine(startX, startY, endX, endY, thickness, color) {
  const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

  // Create line element
  const lineElement = document.createElement("div");
  lineElement.classList.add("line");
  lineElement.style.position = "absolute";
  lineElement.style.left = startX + "px";
  lineElement.style.top = startY + "px";
  lineElement.style.width = length + "px";
  lineElement.style.height = thickness + "px";
  lineElement.style.zIndex = 3;
  lineElement.style.backgroundColor = color;
  lineElement.style.transform = `rotate(${angle}deg)`;
  lineElement.style.transformOrigin = "top left";

  // Append line to shapes container
  document.getElementById("shapes-container").appendChild(lineElement);
}



// Function to generate priority points as shapes on the image
function generatePriorityPoints(priorityPoints) {
const container = document.getElementById("shapes-container");
priorityPoints.forEach(point => {
const { coords: [x, y], totalWeight } = point;
const pointElement = document.createElement("div");
pointElement.classList.add("shape");
pointElement.classList.add("priority-point");
pointElement.style.left = x + "px";
pointElement.style.top = y + "px";
pointElement.style.width = totalWeight + "px"; // Using weight as width
pointElement.style.height = totalWeight + "px"; // Using weight as height
pointElement.style.backgroundColor = "black"; // You can change the color as needed
container.appendChild(pointElement);
});
}

// Function to draw a point at the specified coordinates relative to the top-left corner of the image
function drawPoint(x, y) {
const pointElement = document.createElement("div");
pointElement.classList.add("shape");
pointElement.classList.add("point");

// Adjust coordinates based on container dimensions and image dimensions
const container = document.getElementById("container");
const containerRect = container.getBoundingClientRect();
const image = document.getElementById("image");
const imageRect = image.getBoundingClientRect();

// Calculate the position relative to the top-left corner of the image
const pointX = x - containerRect.left - window.pageXOffset - imageRect.left + 8 + 8; // Add 8 to account for the starting position of the image in X-axis
const pointY = y - containerRect.top - window.pageYOffset - imageRect.top + 88 + 88; // Add 88 to account for the starting position of the image in Y-axis

// Set point position and style
pointElement.style.left = pointX + "px";
pointElement.style.top = pointY + "px";
pointElement.style.width = "10px"; // Increase point size
pointElement.style.height = "10px"; // Increase point size
pointElement.style.backgroundColor = "black"; // You can change the color as needed

// Append point to container
container.appendChild(pointElement);
}




// Function to generate a point based on user input
function generatePoint() {
const xInput = document.getElementById("xPosition");
const yInput = document.getElementById("yPosition");
const x = parseInt(xInput.value);
const y = parseInt(yInput.value);

if (!isNaN(x) && !isNaN(y)) {
drawPoint(x, y);
} else {
alert("Please enter valid X and Y coordinates.");
}
}

// Add event listener to draw a point when clicking on the image
document.getElementById("image").addEventListener("click", function(event) {
const container = document.getElementById("container");
const x = event.clientX - container.getBoundingClientRect().left;
const y = event.clientY - container.getBoundingClientRect().top;
drawPoint(x, y);
});

// Add event listener to the container for adding shapes on mousedown
document.getElementById("image").addEventListener("mousedown", addShape)

// Add event listener to the document for resizing shape on mousemove
document.addEventListener("mousemove", resizeShape)

// Add event listener to the document for stopping resizing on mouseup
document.addEventListener("mouseup", stopResizing)

// Show mouse coordinates when hovering over the image
document
  .getElementById("image")
  .addEventListener("mousemove", function (event) {
    const mouseX = event.clientX
    const mouseY = event.clientY
    document.getElementById(
      "mouse-coordinates"
    ).textContent = `Mouse Coordinates: (${mouseX}, ${mouseY})`
  })

// Call selectShape to set the default shape
selectShape("square")