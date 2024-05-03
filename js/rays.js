console.log("Rays");
var body = document.body;
var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');

const [width, height] = [c.width, c.height];

// We'll force write a whole image to canvas later, more efficient than pixels
var newImg = ctx.getImageData(0, 0, c.width, c.height);

var scene = {
    camera: {
        point: {
            x: -0.2,
            y: 2.0,
            z: 10,
        },
        fieldOfView: 45,
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
                x: -2.1,
                y: 3.6,
                z: -3,
            },
            color: {
                x: 100,
                y: 100,
                z: 200,
            },
            specular: 0.2,
            lambert: 0.9,
            ambient: 0.1,
            radius: 2.5,
        },
        {
            type: "sphere",
            point: {
                x: 1.2,
                y: 2,
                z: -1,
            },
            color: {
                x: 200,
                y: 100,
                z: 100,
            },
            specular: 0.9,
            lambert: 0.3,
            ambient: 0.3,
            radius: 1.0,
        },
        {
            type: "sphere",
            point: {
                x: 1.1,
                y: 4.5,
                z: -0.5,
            },
            color: {
                x: 100,
                y: 200,
                z: 100,
            },
            specular: 0.5,
            lambert: 0.3,
            ambient: 0.4,
            radius: 1.5,
        },
    ],
};

var Vector = {};
Vector.UP = { x: 0, y: 1, z: 0 };
Vector.ZERO = { x: 0, y: 0, z: 0 };
Vector.WHITE = { x: 255, y: 255, z: 255 };
Vector.ZEROcp = function() {
    return { x: 0, y: 0, z: 0 };
};

Vector.dotProduct = function(a, b) {
    return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
};

Vector.crossProduct = function(a, b) {
    return {
        x: (a.y * b.z) - (a.z * b.y),
        y: (a.z * b.x) - (a.x * b.z),
        z: (a.x * b.y) - (a.y * b.x)
    };
};

Vector.scale = function(a, t) {
    return {
        x: a.x * t,
        y: a.y * t,
        z: a.z * t
    };
};
Vector.unitVector = function(a) {
    return Vector.scale(a, 1 / Vector.length(a));
};

Vector.add = function(a, b) {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
        z: a.z + b.z
    };
};

Vector.add3 = function(a, b, c) {
    return {
        x: a.x + b.x + c.x,
        y: a.y + b.y + c.y,
        z: a.z + b.z + c.z
    };
};

Vector.subtract = function(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z
    };
};

Vector.length = function(a) {
    return Math.sqrt(Vector.dotProduct(a, a));
};

Vector.reflectThrough = function(a, normal) {
    var d = Vector.scale(normal, Vector.dotProduct(a, normal));
    return Vector.subtract(Vector.scale(d, 2), a);
};

function render(scene) {
    console.log("Rendering...");

    var camera = scene.camera;
    var eyeVector = Vector.unitVector(
        Vector.subtract(camera.vector, camera.point)
    );
    var vpRight = Vector.unitVector(Vector.crossProduct(eyeVector, Vector.UP));
    var vpUp = Vector.unitVector(Vector.crossProduct(vpRight, eyeVector));
    fovRadians = (Math.PI * (camera.fieldOfView / 2)) / 180,
        heightWidthRatio = height / width,
        halfWidth = Math.tan(fovRadians),
        halfHeight = heightWidthRatio * halfWidth,
        camerawidth = halfWidth * 2,
        cameraheight = halfHeight * 2,
        pixelWidth = camerawidth / (width - 1),
        pixelHeight = cameraheight / (height - 1);

    var index, color;
    var ray = {
        point: camera.point,
    };

    // TODO bit sus using var here?
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var xcomp = Vector.scale(vpRight, x * pixelWidth - halfWidth);
            var ycomp = Vector.scale(vpUp, y * pixelHeight - halfHeight);
            ray.vector = Vector.unitVector(Vector.add3(eyeVector, xcomp, ycomp));

            color = trace(ray, scene, 0);
            (index = x * 4 + y * width * 4), (newImg.data[index + 0] = color.x);
            newImg.data[index + 1] = color.y;
            newImg.data[index + 2] = color.z;
            newImg.data[index + 3] = 255;
        }
    }
    console.log("Updating canvas...");
    ctx.putImageData(newImg, 0, 0);
    console.log("Render done.");
}

function trace(ray, scene, depth) {
    if (depth > 3) return;
    var distObject = intersectScene(ray, scene);
    if (distObject[0] === Infinity) {
        return Vector.WHITE;
    }

    var dist = distObject[0];
    var object = distObject[1];

    var pointAtTime = Vector.add(ray.point, Vector.scale(ray.vector, dist));

    return surface(
        ray,
        scene,
        object,
        pointAtTime,
        sphereNormal(object, pointAtTime),
        depth
    );
}

function intersectScene(ray, scene) {
    var closest = [Infinity, null];

    for (var i = 0; i < scene.objects.length; i++) {
        var object = scene.objects[i];
        var dist = sphereIntersection(object, ray);
        if (dist !== undefined && dist < closest[0]) {
            closest = [dist, object];
        }
    }
    return closest;

}

function sphereIntersection(sphere, ray) {
    var eye_to_center = Vector.subtract(sphere.point, ray.point);
    var v = Vector.dotProduct(eye_to_center, ray.vector);
    var eoDot = Vector.dotProduct(eye_to_center, eye_to_center);
    var discriminant = sphere.radius ** 2 - eoDot + v ** 2;
    if (discriminant < 0) {
        return;
    } else {
        return v - Math.sqrt(discriminant);
    }
}

function sphereNormal(sphere, pos) {
    return Vector.unitVector(Vector.subtract(pos, sphere.point));
}

function surface(ray, scene, object, pointAtTime, normal, depth) {
    var b = object.color;
    var c = Vector.ZERO;
    var lambertAmount = 0;
    if (object.lambert) {
        for (var i = 0; i < scene.lights.length; i++) {
            var lightPoint = scene.lights[i];
            if (!isLightVisible(pointAtTime, scene, lightPoint)) continue;
            var contribution = Vector.dotProduct(
                Vector.unitVector(Vector.subtract(lightPoint, pointAtTime)),
                normal
            );
            if (contribution > 0) lambertAmount += contribution;
        }
    }
    if (object.specular) {
        var reflectedRay = {
            point: pointAtTime,
            vector: Vector.reflectThrough(ray.vector, normal),
        };
        var reflectedColor = trace(reflectedRay, scene, ++depth);
        if (reflectedColor) {
            c = Vector.add(c, Vector.scale(reflectedColor, object.specular));
        }
    }
    lambertAmount = Math.min(1, lambertAmount);
    return Vector.add3(
        c,
        Vector.scale(b, lambertAmount * object.lambert),
        Vector.scale(b, object.ambient)
    );
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
    // Manually call this. Mouse controls camera.
    let xFactor = (window.innerWidth / 2 - window.mouseX) / window.innerWidth * 2;
    let yFactor = (window.innerHeight / 2 - window.mouseY) / window.innerHeight * 2;

    scene.camera.point.x += xFactor;
    scene.camera.point.y += yFactor;

    console.log(scene.camera);
    render(scene);
    requestAnimationFrame(tick);
}

// Adding mouse movement tracking
window.mouseX = 0;
window.mouseY = 0;
document.onmousemove = function(e) {
    window.mouseX = e.clientX;
    window.mouseY = e.clientY;
};

render(scene);



