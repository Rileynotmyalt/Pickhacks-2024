      // Initialize variables
      let shapes = []
      let startX = 0
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
        // Extract shape information
        const shapeData = shapes.map(shape => {
            const rect = shape.getBoundingClientRect();
            return {
                type: shape.classList.contains("square") ? "square" : "circle",
                startX: rect.left,
                startY: rect.top,
                endX: rect.right,
                endY: rect.bottom,
                typeID: getTypeID(shape.style.backgroundColor)
            };
        });
    
        // Log shape data to the console
        console.log(shapeData);
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