let database;

// Variables for Drawing
let drawing = [];
let currentPath = [];
let isDrawing = false;
let userName = "";
let unitOfTime = "";
let userDescription = "";

let baseCanvasSize = 500; // Original size

function setup() {
    // Your web app's Firebase configuration
    const config = {
        apiKey: "AIzaSyBQTe_Pn-hreXMg3HD-v9ODtmSGfUNMx9w",
        authDomain: "seeing-time-58600.firebaseapp.com",
        databaseURL: "https://seeing-time-58600-default-rtdb.firebaseio.com",
        projectId: "seeing-time-58600",
        storageBucket: "seeing-time-58600.appspot.com",
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
    let keys = Object.keys(drawings).reverse(); // Reverse to show the most recent first
    console.log('Keys:', keys);

    // Clear the list before adding new items
    const drawingList = select('#drawing-list');
    drawingList.html('');

    // Add each drawing to the list as a placeholder
    keys.forEach((key) => {
        let drawingData = drawings[key];
        let name = drawingData.name || "Anonymous"; // Get the name from the data
        let description = drawingData.description || "No description provided."; // Additional info
        let unit = drawingData.unit || "Unknown unit"; // Unit of time
        let points = drawingData.drawing; // Array of points for the drawing

        // Create a container for lazy loading
        let canvasContainer = createDiv().addClass('canvas-container');
        canvasContainer.parent('#drawing-list');

        // Add a placeholder for lazy loading
        let placeholder = createDiv('Loading...').addClass('placeholder');
        placeholder.parent(canvasContainer);

        // Add additional information below the placeholder
        let info = createDiv()
            .addClass('details')
            .html(`<p><strong>Name:</strong> ${name}</p>
                   <p><strong>Description:</strong> ${description}</p>
                   <p><strong>Unit:</strong> ${unit}</p>`);
        info.parent(canvasContainer);

        // Set up lazy loading
        setupLazyLoading(placeholder, points, canvasContainer);
    });
}

function setupLazyLoading(placeholder, points, canvasContainer) {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Load the drawing when it comes into view
                observer.unobserve(entry.target); // Stop observing
                placeholder.remove(); // Remove the placeholder

                // Create the p5 sketch dynamically
                new p5((sketch) => {
                    sketch.setup = () => {
                        let canvas = sketch.createCanvas(baseCanvasSize, baseCanvasSize);
                        canvas.parent(canvasContainer); // Attach to the current container div
                        sketch.noLoop(); // No continuous drawing
                    };

                    sketch.draw = () => {
                        sketch.background(240);
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
            }
        });
    });

    // Observe the placeholder
    observer.observe(placeholder.elt);
}

function errData(err) {
    console.log('Error!');
    console.log(err);
}
