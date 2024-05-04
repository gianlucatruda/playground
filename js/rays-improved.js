const MOVE_MULT = 0.2;
const SHRINK_FACTOR = 4;
const REFLECTION_DEPTH = 2;
const MAX_DIST = 30;
const CWIDTH = 1920 / SHRINK_FACTOR;
const CHEIGHT = 1080 / SHRINK_FACTOR;

const canvas = document.getElementById('canvas');
const fpsText = document.getElementById('fps-text');
const ctx = canvas.getContext('2d');

[canvas.width, canvas.height] = [CWIDTH, CHEIGHT];
const canvasImage = ctx.getImageData(0, 0, CWIDTH, CHEIGHT);

let isRealtime = false;
let trackingMouse = false;
let [startX, startY] = [0.0, 0.0];
let camera = {
    position: { x: -0.2, y: 2.0, z: 10 },
    fov: 45,
    vector: { x: 0, y: 3, z: 0 },
};

class Color {
    constructor(r, g, b) {
        [this.r, this.g, this.b] = [r, g, b];
    }

    add(c) {
        this.r += c.r; this.g += c.g; this.b += c.b;
        return this;
    }

    scaleBy(x) {
        this.r *= x; this.g *= x; this.b *= x;
        return this;
    }
}

const SCENE = {
    lights: [{ x: -30, y: -10, z: 20 }],
    objects: [
        {
            type: "sphere",
            position: { x: -2.1, y: 3.6, z: -3 },
            radius: 2.5,
            color: new Color(128, 128, 128),
            specular: 0.0,
            lambert: 0.9,
            ambient: 0.3,
        },
        {
            type: "sphere",
            position: { x: 1.2, y: 2, z: -1 },
            radius: 1.0,
            color: new Color(100, 120, 100),
            specular: 0.99, // high spec object
            lambert: 0.9,
            ambient: 0.3,
        },
        {
            type: "sphere",
            position: { x: 1.1, y: 4.5, z: -0.5 },
            radius: 1.5,
            color: new Color(5, 5, 255),
            specular: 0.5,
            lambert: 0.8,
            ambient: 0.2,
        },
    ],
};

// TODO needs big refactor
class Vec3D {
    constructor(x, y, z) {
        [this.x, this.y, this.z] = [x, y, z];
    }
    static ZERO = new Vec3D(0, 0, 0);
    static UP = new Vec3D(0, 1, 0);

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


function traceRay(ray, scene, depth) {
    if (depth > REFLECTION_DEPTH) return;
    const hit = getFirstReflection(ray, scene);
    if (hit.dist > MAX_DIST) return new Color(255, 255, 255);
    const hitPoint = Vec3D.add(ray.position, Vec3D.scale(ray.vector, hit.dist));
    // TODO generalise to nonspheres, also "sphere of concern" lol
    return computeReflectedColor(ray, scene, hit.object, hitPoint, calcSphereNorm(hit.object, hitPoint), depth);
}

function getFirstReflection(ray, scene) {
    let hit = { 'dist': Infinity, 'object': null };
    for (const object of scene.objects) {
        if (object.type != "sphere") console.warn(`Could not render unsuported '${object.type}' object.`);
        let dist = null;
        if (object.type == "sphere") dist = getSphereHit(object, ray);
        if (dist !== undefined && dist < hit.dist) {
            hit.dist = dist;
            hit.object = object;
        }
    }
    return hit;
}

// TODO refactor 
function getSphereHit(sphere, ray) {
    const eyeToCenter = Vec3D.subtract(sphere.position, ray.position);
    const v = Vec3D.dotProduct(eyeToCenter, ray.vector);
    const eoDot = Vec3D.dotProduct(eyeToCenter, eyeToCenter);
    const discriminant = Math.pow(sphere.radius, 2) - eoDot + v * v;
    if (discriminant < 0) return;
    return v - Math.sqrt(discriminant);
}

// TODO just have a sphere class?
function calcSphereNorm(sphere, pos) {
    return Vec3D.unitVector(Vec3D.subtract(pos, sphere.position));
}

// TODO needs major refactor. a total mess
function computeReflectedColor(ray, scene, object, hitPoint, normal, depth) {
    const b = object.color;
    let c = new Color(0, 0, 0);
    let lambertAmount = 0;
    if (object.lambert) {
        for (const light of scene.lights) {
            if (!isLightVisible(hitPoint, scene, light)) continue;
            let contribution = Vec3D.dotProduct(
                Vec3D.unitVector(Vec3D.subtract(light, hitPoint)),
                normal);
            if (contribution > 0) {
                lambertAmount += contribution;
            }
        }
    }

    if (object.specular) {
        const reflectedRay = {
            position: hitPoint,
            vector: Vec3D.reflectThrough(ray.vector, normal),
        };
        const reflectedColor = traceRay(reflectedRay, scene, ++depth);
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

// TODO refactor
function isLightVisible(pt, scene, light) {
    let distObject = getFirstReflection(
        {
            position: pt,
            vector: Vec3D.unitVector(Vec3D.subtract(pt, light)),
        },
        scene
    );
    return distObject.dist > -0.005;
}


function renderScene(scene) {
    const tStart = performance.now();

    // TODO refactor these
    const eyeVector = Vec3D.unitVector(Vec3D.subtract(camera.vector, camera.position));
    const vpRight = Vec3D.unitVector(Vec3D.crossProduct(eyeVector, Vec3D.UP));
    const vpUp = Vec3D.unitVector(Vec3D.crossProduct(vpRight, eyeVector));
    const fovRadians = Math.PI * (camera.fov / 2) / 180;
    const heightWidthRatio = CHEIGHT / CWIDTH;
    const halfWidth = Math.tan(fovRadians);
    const halfHeight = heightWidthRatio * halfWidth;
    const camerawidth = halfWidth * 2;
    const cameraheight = halfHeight * 2;
    const pixelWidth = camerawidth / (CWIDTH - 1);
    const pixelHeight = cameraheight / (CHEIGHT - 1);

    for (let x = 0; x < CWIDTH; x++) {
        for (let y = 0; y < CHEIGHT; y++) {
            const xComp = Vec3D.scale(vpRight, x * pixelWidth - halfWidth);
            const yComp = Vec3D.scale(vpUp, y * pixelHeight - halfHeight);
            const ray = {
                position: camera.position,
                vector: Vec3D.unitVector(Vec3D.add(Vec3D.add(eyeVector, xComp), yComp))
            };

            const colorVector = traceRay(ray, scene, 0);
            const index = x * 4 + y * CWIDTH * 4;
            canvasImage.data[index + 0] = colorVector.r;
            canvasImage.data[index + 1] = colorVector.g;
            canvasImage.data[index + 2] = colorVector.b;
            canvasImage.data[index + 3] = 255;
        }
    }
    ctx.putImageData(canvasImage, 0, 0);

    let tDelta = performance.now() - tStart;
    let fps = 1 / (tDelta / 1000);
    if (isRealtime) fpsText.innerText = fps.toFixed(0) + "fps";
    console.log(`Rendered in ${(tDelta).toFixed(1)}ms (${fps.toFixed(0)}fps)`);
}

function redrawFrame() {
    isRealtime = true;
    renderScene(SCENE);
    requestAnimationFrame(redrawFrame);
}


renderScene(SCENE);


// TODO refactor interactivity to its own unit
document.onmousemove = function(e) {
    const [mouseX, mouseY] = [e.clientX / window.innerWidth, e.clientY / window.innerHeight];
    if (trackingMouse) {
        camera.vector.x += (startX - mouseX) * 1.0;
        camera.vector.y += (startY - mouseY) * 1.0;
        document.body.style.cursor = "grabbing";
    }
};
document.addEventListener('mousedown', function(e) {
    if (!isRealtime) redrawFrame();
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
            camera.position.z += -1 * MOVE_MULT;
            break;
        case 's':
            camera.position.z += 1 * MOVE_MULT;
            break;
        case 'a':
            camera.position.x += -1 * MOVE_MULT;
            break;
        case 'd':
            camera.position.x += 1 * MOVE_MULT;
            break;
    }
});
