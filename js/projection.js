var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

const sceneDims = [500, 500, 500];
const F = 180; // Focal distance

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

function projectScene() {

    console.log("Clearing canvas...");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("Canvas cleared.");

    console.log(`Drawing scene with F=${F}`);
    let dCount = 0;
    for (let x = 0; x < sceneDims[0]; x++) {
        for (let y = 0; y < sceneDims[1]; y++) {
            for (let z = 0; z < sceneDims[2]; z++) {
                if (scene3D[x][y][z] == 1) {
                    // let x2D = x * (F / z);
                    // let y2D = y * (F / z);
                    // color = getShadeOfGrey(z);
                    drawPixel(x * (F / z), y * (F / z), getShadeOfGrey(
                        200 * (z / sceneDims[2]) + 50
                    ));
                    dCount++;
                }
            }
        }
    }
    console.log("Scene drawn in ", dCount);
}

projectScene();
