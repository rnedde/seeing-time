let database;

// Variables for Drawing
let drawing = [];
let currentPath = [];
let isDrawing = false;
let userName = "";
let unitOfTime = "";
let userDescription = "";

function setup() {
    let canvas = createCanvas(500, 500);

    canvas.mousePressed(startPath);
    canvas.mouseReleased(endPath);
    canvas.parent('#canvas-container');

    let saveButton = select("#save-button");


    saveButton.mousePressed(saveDrawing);
    // saveButton.mousePressed

    let clearButton = select("#clear-button");
    clearButton.mousePressed(function () {
        drawing = [];
        const warning = select('#warning');
        warning.html('')
    });

    let undoButton = select("#undo-button");
    undoButton.mousePressed(function () {
        drawing.pop();
    })
    // Your web app's Firebase configuration
    const config = {
        apiKey: "AIzaSyBQTe_Pn-hreXMg3HD-v9ODtmSGfUNMx9w",
        authDomain: "seeing-time-58600.firebaseapp.com",
        databaseURL: "https://seeing-time-58600-default-rtdb.firebaseio.com",
        projectId: "seeing-time-58600",
        storageBucket: "seeing-time-58600.firebasestorage.app-x",
        messagingSenderId: "337990844288",
        appId: "1:337990844288:web:42a0229a238f801c10cb65"
    };


    firebase.initializeApp(config);
    database = firebase.database();
    let ref = database.ref('drawings');
    ref.on('value', gotData, errData);
}


function startPath() {
    isDrawing = true;
    currentPath = [];
    drawing.push(currentPath);
}

function endPath() {
    isDrawing = false;
}

function draw() {
    background(240);

    // Save points to drawing array
    if (isDrawing) {
        let myPoint = { x: mouseX, y: mouseY };
        currentPath.push(myPoint);
    }

    // Loop to display drawing
    stroke(2);
    strokeWeight(2);
    noFill();
    for (let path of drawing) {
        beginShape();
        for (let point of path) {
            vertex(point.x, point.y);
        }
        endShape();
    }
}

function saveDrawing() {
    userName = select("#name").value();  // Get the name input from the text field
    userDescription = select("#description").value();
    unitOfTime = select("#unit").value();

    let galleryButton = select("#gallery-button");

    galleryButton.style("visibility", "visible")
    

    // Check if the name field is blank
    if (userName.trim() === "") {
        // Display a warning if the name is empty
        const noNameWarning = select('#warning');
        noNameWarning.html('Please enter your name before saving the drawing.');
        return;  // Prevent saving the drawing
    }

    console.log("drawing length: " + drawing.length);

    if (drawing.length >= 1) {
        const drawingsRef = database.ref('drawings');  // Reference to the 'drawings' node in the database
        let data = {
            name: userName,
            drawing: drawing,
            unit: unitOfTime,
            description: userDescription,
        };
        const warning = select('#warning');
        warning.html('Drawing Saved!')


        drawingsRef.push(data)  // Push the data to the database
            .then((snapshot) => {
                console.log("Drawing saved with key:", snapshot.key);
                clearDrawing();  // Clear the canvas after saving the drawing
            })
            .catch((error) => {
                console.error("Error saving drawing:", error);
            });
    } else {
        const noDrawing = select('#warning');
        noDrawing.html('Please draw something before saving!');
    }
}




function gotData(data) {
    let drawings = data.val();
    if (!drawings) {
        console.log('No data found in the drawings node!');
        return;
    }
    let keys = Object.keys(drawings);
    console.log('Keys:', keys);

    // Clear the list before adding new items
    const drawingList = select('#drawing-list');
    drawingList.html('');

    // Add each drawing to the list
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        console.log('Key:', key, 'Data:', drawings[key]);

        let li = createElement('li', '');
        let drawingData = drawings[key];
        let name = drawingData.name;  // Get the name from the data

        // Create a link with the user's name
        let ahref = createA('#', name);
        ahref.mousePressed(() => showDrawing(key));  // When clicked, load the specific drawing
        ahref.parent(li);
        li.parent(drawingList);
    }
}


function errData(err) {
    console.log('Error!');
    console.log(err);
}

function showDrawing(key) {
    var ref = database.ref('drawings/' + key);
    ref.once('value', (data) => {
        var dbDrawing = data.val();
        drawing = dbDrawing.drawing;  // Get the drawing data
        userName = dbDrawing.name;    // Get the user's name (if needed for display)

        // Redraw the saved drawing on the canvas
        redrawCanvas();  // Custom function to redraw the canvas (you'll need to implement this)
    }, errData);
}

function redrawCanvas() {
    clear();  // Clear the current canvas

    // Loop through the saved drawing array and redraw
    for (let path of drawing) {
        beginShape();
        for (let point of path) {
            vertex(point.x, point.y);
        }
        endShape();
    }
}


function clearDrawing() {
    drawing = [];  // Clear the drawing array
    currentPath = [];  // Clear the current path
    userName = "";  // Optionally, clear the user name input
    select("#name").value('');  // Clear the name input field
    // select('#warning').html('');  // Reset any warning text
    select("#description").value('');  // Clear the desc input field
    select("#unit").value('');  // Clear the unit input field
}
