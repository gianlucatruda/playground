const body = document.body;
const canvas = document.getElementById('canvas');
const fpsText = document.getElementById('fps-text');
const ctx = canvas.getContext('2d');

const width = 1920 / 4;
const height = 1080 / 4;
[canvas.width, canvas.height] = [width, height];

const newImg = ctx.getImageData(0, 0, width, height);

let mouseX = 0;
let mouseY = 0;
const moveMult = 0.2;
var isRealtime = false;
var trackingMouse = false;
var [startX, startY] = [0.0, 0.0];


class Vector {
    static UP = { x: 0, y: 1, z: 0 };
    static ZERO = { x: 0, y: 0, z: 0 };

    static dotProduct(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    static crossProduct(a, b) {
        return {
            x: a.y * b.z - a.z * b.y,
            y: a.z * b.x - a.x * b.z,
            z: a.x * b.y - a.y * b.x
        };
    }

    static scale(a, t) {
        return { x: a.x * t, y: a.y * t, z: a.z * t };
    }

    static unitVector(a) {
        const length = Math.sqrt(this.dotProduct(a, a));
        return this.scale(a, 1 / length);
    }

    static add(a, b) {
        return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
    }

    static subtract(a, b) {
        return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
    }

    static reflectThrough(a, normal) {
        const d = this.scale(normal, this.dotProduct(a, normal));
        return this.subtract(this.scale(d, 2), a);
    }
}

class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    add(other) {
        return new Color(this.r + other.r, this.g + other.g, this.b + other.b);
    }

    scaleBy(factor) {
        return new Color(this.r * factor, this.g * factor, this.b * factor);
    }

}

const scene = {
    camera: {
        point: { x: -0.2, y: 2.0, z: 10 },
        fov: 45,
        vector: { x: 0, y: 3, z: 0 },
    },
    lights: [{ x: -30, y: -10, z: 20 }],
    objects: [
        {
            type: "sphere",
            point: { x: -2.1, y: 3.6, z: -3 },
            color: new Color(100, 100, 200),
            specular: 0.2,
            lambert: 0.9,
            ambient: 0.1,
            radius: 2.5,
        },
        {
            type: "sphere",
            point: { x: 1.2, y: 2, z: -1 },
            color: new Color(200, 100, 100),
            specular: 0.9, // high spec object
            lambert: 0.3,
            ambient: 0.3,
            radius: 1.0,
        },
        {
            type: "sphere",
            point: { x: 1.1, y: 4.5, z: -0.5 },
            color: new Color(100, 200, 100),
            specular: 0.5,
            lambert: 0.3,
            ambient: 0.4,
            radius: 1.5,
        },
    ],
};

function render(scene) {
    const tStart = performance.now();

    const camera = scene.camera;
    const eyeVector = Vector.unitVector(Vector.subtract(camera.vector, camera.point));
    const vpRight = Vector.unitVector(Vector.crossProduct(eyeVector, Vector.UP));
    const vpUp = Vector.unitVector(Vector.crossProduct(vpRight, eyeVector));
    const fovRadians = Math.PI * (camera.fov / 2) / 180;
    const heightWidthRatio = height / width;
    const halfWidth = Math.tan(fovRadians);
    const halfHeight = heightWidthRatio * halfWidth;
    const camerawidth = halfWidth * 2;
    const cameraheight = halfHeight * 2;
    const pixelWidth = camerawidth / (width - 1);
    const pixelHeight = cameraheight / (height - 1);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const xComp = Vector.scale(vpRight, x * pixelWidth - halfWidth);
            const yComp = Vector.scale(vpUp, y * pixelHeight - halfHeight);
            const ray = {
                point: camera.point,
                vector: Vector.unitVector(Vector.add(Vector.add(eyeVector, xComp), yComp))
            };

            const colorVector = trace(ray, scene, 0);
            const index = x * 4 + y * width * 4;
            newImg.data[index + 0] = colorVector.r;
            newImg.data[index + 1] = colorVector.g;
            newImg.data[index + 2] = colorVector.b;
            newImg.data[index + 3] = 255;
        }
    }
    ctx.putImageData(newImg, 0, 0);

    let tDelta = performance.now() - tStart;
    let fps = 1 / (tDelta / 1000);
    if (isRealtime) fpsText.innerText = fps.toFixed(0) + "fps";
    console.log(`Rendered in ${(tDelta).toFixed(1)}ms (${fps.toFixed(0)}fps)`);
}

function trace(ray, scene, depth) {
    if (depth > 3) return;
    const [dist, object] = intersectScene(ray, scene);
    if (dist === Infinity) return new Color(255, 255, 255);

    const pointAtTime = Vector.add(ray.point, Vector.scale(ray.vector, dist));

    return surface(ray, scene, object, pointAtTime, sphereNormal(object, pointAtTime), depth);
}

function intersectScene(ray, scene) {
    let closest = [Infinity, null];
    for (const object of scene.objects) {
        const dist = sphereIntersection(object, ray);
        if (dist !== undefined && dist < closest[0]) {
            closest = [dist, object];
        }
    }
    return closest;
}

// TODO refactor to general objects (check if sphere to call sphereInter...)
function sphereIntersection(sphere, ray) {
    const eyeToCenter = Vector.subtract(sphere.point, ray.point);
    const v = Vector.dotProduct(eyeToCenter, ray.vector);
    const eoDot = Vector.dotProduct(eyeToCenter, eyeToCenter);
    const discriminant = Math.pow(sphere.radius, 2) - eoDot + v * v;
    if (discriminant < 0) return;
    return v - Math.sqrt(discriminant);
}

function sphereNormal(sphere, pos) {
    return Vector.unitVector(Vector.subtract(pos, sphere.point));
}

function surface(ray, scene, object, pointAtTime, normal, depth) {
    const b = object.color;
    let c = new Color(0, 0, 0);
    let lambertAmount = 0;
    if (object.lambert) {
        for (const light of scene.lights) {
            if (!isLightVisible(pointAtTime, scene, light)) continue;
            var contribution = Vector.dotProduct(
                Vector.unitVector(Vector.subtract(light, pointAtTime)),
                normal);
            if (contribution > 0) {
                lambertAmount += contribution;
            }
        }
    }

    if (object.specular) {
        const reflectedRay = {
            point: pointAtTime,
            vector: Vector.reflectThrough(ray.vector, normal),
        };
        const reflectedColor = trace(reflectedRay, scene, ++depth);
        if (reflectedColor) {
            c = c.add(reflectedColor.scaleBy(object.specular));
        }
    }

    lambertAmount = Math.min(1, lambertAmount);
    cFinal = new Color(
        c.r + (b.r * lambertAmount * object.lambert) + (b.r * object.ambient),
        c.g + (b.g * lambertAmount * object.lambert) + (b.g * object.ambient),
        c.b + (b.b * lambertAmount * object.lambert) + (b.b * object.ambient)
    );
    return cFinal;
}

function isLightVisible(pt, scene, light) {
    var distObject = intersectScene(
        {
            point: pt,
            vector: Vector.unitVector(Vector.subtract(pt, light)),
        },
        scene
    );
    return distObject[0] > -0.005;
}

function tick() {
    isRealtime = true;
    render(scene);
    requestAnimationFrame(tick);
}

render(scene);

document.onmousemove = function(e) {
    [mouseX, mouseY] = [e.clientX / window.innerWidth, e.clientY / window.innerHeight];
    if (trackingMouse) {
        scene.camera.vector.x += (startX - mouseX) * 1.0;
        scene.camera.vector.y += (startY - mouseY) * 1.0;
        document.body.style.cursor = "grabbing";
    }
};
document.addEventListener('mousedown', function(e) {
    if (!isRealtime) tick();
    [startX, startY] = [e.clientX / window.innerWidth, e.clientY / window.innerHeight];
    trackingMouse = true;

});
document.addEventListener('mouseup', function(e) {
    trackingMouse = false;
    document.body.style.cursor = "unset";
});
document.addEventListener('keydown', function(e) {
    switch (e.key) {
        case 'w':
            scene.camera.point.z += -1 * moveMult;
            break;
        case 's':
            scene.camera.point.z += 1 * moveMult;
            break;
        case 'a':
            scene.camera.point.x += -1 * moveMult;
            break;
        case 'd':
            scene.camera.point.x += 1 * moveMult;
            break;
    }
});
