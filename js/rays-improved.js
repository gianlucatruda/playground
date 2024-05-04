
console.log("Rays");
const body = document.body;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

const newImg = ctx.getImageData(0, 0, width, height);

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
    console.log("Rendering...");

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
    console.log("Updating canvas...");
    ctx.putImageData(newImg, 0, 0);
    console.log("Render done.");
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
                // console.log({
                //     'contribution': contribution,
                //     'lambertAmount': lambertAmount,
                //     'light': light,
                //     'pointAtTime': pointAtTime,
                //     'normal': normal
                // });
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
            c = c.add(reflectedColor).scaleBy(object.specular);
        }
    }

    lambertAmount = Math.min(1, lambertAmount);
    cFinal = new Color(
        c.r + b.r * lambertAmount * object.lambert + b.r * object.ambient,
        c.g + b.g * lambertAmount * object.lambert + b.g * object.ambient,
        c.b + b.b * lambertAmount * object.lambert + b.b * object.ambient
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

let mouseX = 0;
let mouseY = 0;
document.onmousemove = function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
};

function tick() {
    const xFactor = (window.innerWidth / 2 - mouseX) / window.innerWidth * 2;
    const yFactor = (window.innerHeight / 2 - mouseY) / window.innerHeight * 2;

    scene.camera.point.x += xFactor;
    scene.camera.point.y += yFactor;

    console.log("Camera Updated:", scene.camera);
    render(scene);
    requestAnimationFrame(tick);
}

render(scene);
//requestAnimationFrame(tick);
