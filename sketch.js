

var database;

// Variables for Drawing
let drawing = [];
let currentPath = [];
let isDrawing = false;

function setup() {
    let canvas = createCanvas(400, 400);

    canvas.mousePressed(startPath);
    canvas.mouseReleased(endPath);
    canvas.parent('#canvas-container');

    let saveButton = select("#save-button");
    saveButton.mousePressed(saveDrawing);

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
    const drawingsRef = database.ref('drawings');  // Reference to the 'drawings' node in the database
    let data = {
        name: "Rev",
        drawing: drawing
    };


    drawingsRef.push(data)  // Push the data to the database
        .then((snapshot) => {
            console.log("Drawing saved with key:", snapshot.key);
        })
        .catch((error) => {
            console.error("Error saving drawing:", error);
        });
}
function gotData(data) {
    let drawings = data.val();
    if (!drawings) {
        console.log('No data found in the drawings node!');
        return;
    }
    var keys = Object.keys(drawings);
    console.log('Keys:', keys);
    for (let i = 0; i < keys.length; i++) {
        var key = keys[i];
        console.log('Key:', key, 'Data:', drawings[key]);
    }
}

function errData(err) {
    console.log('Error!');
    console.log(err);
}