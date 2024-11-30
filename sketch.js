

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
        let point = { x: mouseX, y: mouseY };
        currentPath.push(point);
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
    const drawingsRef = ref(database, 'drawings');
    const data = {
        name: "Rev",
        drawing: drawing
    };

    push(drawingsRef, data)
        .then((snapshot) => {
            console.log("Drawing saved with key:", snapshot.key);
        })
        .catch((error) => {
            console.error("Error saving drawing:", error);
        });
}
