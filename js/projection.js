var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
console.log("Clearing canvas...");
ctx.clearRect(0, 0, canvas.width, canvas.height);
var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
const sceneDims = [500, 500, 500];
const F = 200; // Focal length
const camPos = [200, 150, 0];

function getShadeOfGrey(greyLevel) {
    // Clamp the value between 0 and 255
    greyLevel = Math.max(0, Math.min(255, greyLevel));
    // Convert the grey level to a base-16 (hexadecimal) string
    const greyHex = greyLevel.toString(16).padStart(2, '0');
    // Return the CSS color string
    return `#${greyHex}${greyHex}${greyHex}`;
}

function drawPixel(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
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

// for (let i = 0; i < canvas.width * canvas.height * 4; i+=4) {
//     data.data[i + 0] = 0;
//     data.data[i + 1] = 0;
//     data.data[i + 2] = 255;
//     data.data[i + 3] = 255;
//
// }
// let newImgData = new ImageData(data.data, canvas.width, canvas.height);
// ctx.putImageData(newImgData, 0, 0);

console.log(`Creating a ${sceneDims[0]} x ${sceneDims[1]} x ${sceneDims[2]} scene...`);
var scene3D = Array(sceneDims[0]).fill().map(() => Array(sceneDims[1]).fill().map(() => Array(sceneDims[2]).fill(0)));

function fill3DBox(startX, startY, startZ, endX, endY, endZ) {
    for (let x = startX; x < endX; x++) {
        for (let y = startY; y < endY; y++) {
            for (let z = startZ; z < endZ; z++) {
                scene3D[x][y][z] = 1;
            }
        }
    }
}
console.log("Creating a box...");
fill3DBox(200, 200, 200, 300, 300, 300);

function fillSphere(x0, y0, z0, r) {
    for (let x = 0; x < sceneDims[0]; x++) {
        for (let y = 0; y < sceneDims[1]; y++) {
            for (let z = 0; z < sceneDims[2]; z++) {
                if ((x - x0) ** 2 + (y - y0) ** 2 + (z - z0) ** 2 == r ** 2) {
                    scene3D[x][y][z] = 1;
                }
            }
        }
    }
}

// console.log("Creating a sphere...");
// fillSphere(100, 100, 300, 1j0);

function projectScene() {

    console.log("Clearing canvas...");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("Canvas cleared.");

    console.log(`Drawing scene with F=${F}`);
    let dCount = 0;
    for (let x = 0; x < sceneDims[0]; x++) {
        for (let y = 0; y < sceneDims[1]; y++) {
            for (let z = sceneDims[2]; z > 1; z--) {
                if (scene3D[x][y][z] == 1) {
                    // Offset camera position in scene
                    let dx = x - camPos[0];
                    let dy = y - camPos[1];
                    let dz = z - camPos[2];
                    // Our camera is locked off, so angles become identity transform

                    // 2D projection
                    let x2D = dx * (F / dz) + (canvas.width / 2);
                    let y2D = dy * (F / dz) + (canvas.height / 2);
                    let c = [128, 128, 128, 100];
                    definePixel(x2D, y2D, c);
                    // drawPixel(x2D, y2D, 'blue');
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
    let newImgData = new ImageData(data.data, canvas.width, canvas.height);
    ctx.putImageData(newImgData, 0, 0);
    console.log(data.data)
    console.log("Done")
}

projectScene();
