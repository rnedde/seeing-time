let database;

// Variables for Drawing
let drawing = [];
let currentPath = [];
let isDrawing = false;
let userName = "";
let unitOfTime = "";
let userDescription = "";


let baseCanvasSize = 500; // Original size
let canvas;

function setup() {
    


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
    for (let i = keys.length - 1; i >= 0; i--) {
        let key = keys[i];
        console.log('Key:', key, 'Data:', drawings[key]);

        let drawingData = drawings[key];
        let name = drawingData.name; // Get the name from the data
        let points = drawingData.drawing; // Array of points for the drawing
        let description = drawingData.description || "No description provided."; // Additional info
        let unit = drawingData.unit || "Unknown unit"; // Unit of time

        // Create a new div to hold the canvas and user information
        let canvasContainer = createDiv().addClass('canvas-container');
        canvasContainer.parent('#drawing-list'); // Append to the gallery container



        // Create a new p5 sketch for each drawing
        let sketchContainer = new p5((sketch) => {
            sketch.setup = () => {
                let canvas = sketch.createCanvas(baseCanvasSize, baseCanvasSize);
                canvas.parent(canvasContainer); // Attach to the current container div
                sketch.noLoop(); // No continuous drawing
                // sketch.windowResized();
            };

            sketch.draw = () => {
                sketch.background(240);

                // Draw the saved drawing
                sketch.noFill();
                sketch.stroke(0);
                sketch.strokeWeight(2);

                for (let path of points) {
                    sketch.beginShape();
                    for (let point of path) {
                        sketch.vertex(point.x, point.y);
                    }
                    sketch.endShape();
                }
            };
        });

        // Add the additional information below the canvas

        // Display user name above the canvas

        let info = createDiv()

            .addClass('details')
            .html(`<p><strong>Name:</strong>${name}</p>
                    <p><strong>Description:</strong> ${description}</p>
                   <p><strong>Unit:</strong> ${unit}</p>`);


        info.parent(canvasContainer);  // Append the info below the canvas


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


function windowResized() {
    // Make the canvas square and responsive
    let size = min(windowWidth, windowHeight) * 0.8;
    resizeCanvas(size, size); // Adjust the canvas size
    redrawCanvas();
}