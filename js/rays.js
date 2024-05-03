console.log("Rays");
var body = document.body;
var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');

console.log("Clearing canvas...");
ctx.clearRect(0, 0, c.width, c.height);

// Convenient consts for canvas, scene, camera
const [CW, CH] = [c.width, c.height];
const [X, Y, Z] = [500, 500, 500];
const [camX, camY, camZ] = [250, 250, 0];

// We'll force write a whole image to canvas later, more efficient than pixels
let newImg = ctx.createImageData(c.width, c.height);
let newImgData = newImg.data;

console.log("Updating canvas...");
ctx.putImageData(newImg, 0, 0);
console.log("Done.");

var scene = {
    camera: {
        point: {
            x: camX,
            y: camY,
            z: camZ,
        },
        fov: 45,
        vector: {
            x: 0,
            y: 3,
            z: 0,
        },
    },
    lights: [
        {
            x: -30,
            y: -10,
            z: 20,
        },
    ],
    objects: [
        {
            type: "sphere",
            point: {
                x: 0,
                y: 3.5,
                z: -3,
            },
            color: {
                x: 155,
                y: 200,
                z: 155,
            },
            specular: 0.2,
            lambert: 0.7,
            ambient: 0.1,
            radius: 3,
        },
    ],
};
