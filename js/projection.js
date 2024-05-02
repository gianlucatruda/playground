var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
console.log("Clearing canvas...");
ctx.clearRect(0, 0, canvas.width, canvas.height);
var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
const sceneDims = [500, 500, 500];
const F = 190; // Focal length
const camPos = [200, 150, 0];

function fillSphere(x0, y0, z0, r) {
    let sphereCount = 0;
    for (let x = 0; x < sceneDims[0]; x++) {
        for (let y = 0; y < sceneDims[1]; y++) {
            for (let z = 0; z < sceneDims[2]; z++) {
                if ((x - x0) ** 2 + (y - y0) ** 2 + (z - z0) ** 2 - r ** 2 <= 0.001) {
                    sphereCount++;
                    scene3D[x][y][z] = 255;
                }
            }
        }
    }
    console.log("Created sphere with n points:", sphereCount);
}

function fill3DBox(startX, startY, startZ, endX, endY, endZ) {
    for (let x = startX; x < endX; x++) {
        for (let y = startY; y < endY; y++) {
            for (let z = startZ; z < endZ; z++) {
                if (x == startX | x == endX | y == startY | y == endY | z == startZ | z == endZ) {
                    scene3D[x][y][z] = 255;
                }
            }
        }
    }
}

function definePixel(x, y, [r, g, b, a]) {
    let _x = Math.round(x)
    let _y = Math.round(y);
    let d = (_y * canvas.width + _x) * 4;
    data.data[d + 0] = r;
    data.data[d + 1] = g;
    data.data[d + 2] = b;
    data.data[d + 3] = a;
}

function drawScene() {
    let newImgData = new ImageData(data.data, canvas.width, canvas.height);
    ctx.putImageData(newImgData, 0, 0);
}

function projectScene() {
    console.log("Clearing canvas...");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("Canvas cleared.");
    console.log(`Drawing scene with F=${F}`);
    let dCount = 0;
    for (let x = 0; x < sceneDims[0]; x++) {
        for (let y = 0; y < sceneDims[1]; y++) {
            for (let z = 0; z < sceneDims[2]; z++) {
                if (scene3D[x][y][z] > 0) {
                    // Offset camera position in scene
                    let dx = x - camPos[0];
                    let dy = y - camPos[1];
                    let dz = z - camPos[2];
                    // Our camera is locked off, so angles become identity transform

                    // 2D projection
                    let x2D = dx * (F / dz) + (canvas.width / 2);
                    let y2D = dy * (F / dz) + (canvas.height / 2);
                    // let C = 255 * (1 - dz / sceneDims[2]);
                    let C = scene3D[x][y][z] * (1 - dz / sceneDims[2]);
                    let c = [C, C, C, 255];
                    definePixel(x2D, y2D, c);
                    dCount++;
                }
            }
        }
    }
    console.log("Scene computed in ", dCount);
    // Add some rulers for debugging
    for (let x = 0; x < canvas.width; x += 50) {
        for (let y = 0; y < canvas.height; y += 50) {
            definePixel(x, y, [255, 0, 0, 255]);
        }
    }
    drawScene();
    console.log("Done")
}

console.log(`Creating a ${sceneDims[0]} x ${sceneDims[1]} x ${sceneDims[2]} scene...`);
var scene3D = Array(sceneDims[0]).fill().map(() => Array(sceneDims[1]).fill().map(() => Array(sceneDims[2]).fill(0)));
console.log("Creating a box...");
fill3DBox(210, 190, 199, 210 + 101, 190 + 101, 199 + 101);
console.log("Creating a sphere...");
fillSphere(100, 100, 300, 50);

projectScene();
