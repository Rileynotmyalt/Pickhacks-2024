class Camera {
    static FOV = null;
    static FOD = null;

    constructor() {
        if (!Camera.FOV || !Camera.FOD) {
            console.error(new TypeError("Static variable FOV or FOD not initialised"));
        }
        this.position = [0, 0];
        this.rotation = 0;
    }

    // Getters and setters for properties
    getPosition() {
        return this.position;
    }

    setPosition(pos) {
        this.position = pos;
    }

    getRotation() {
        return this.rotation;
    }

    setRotation(rotation) {
        this.rotation = rotation;
    }

    static getFOV() {
        return this.FOV;
    }

    static setFOV(fieldOfView) {
        this.FOV = fieldOfView;
    }

    // Method to return falloff distance
    static getFOD() {
        return this.FOD; // Arbitrary value, you can change it as needed
    }

    static setFOD(fallOffDistance) {
        this.FOD = fallOffDistance;
    }
}

// Function to place cameras
function placeCameras(cameras, lineSegment, point) {
    console.log(lineSegment,point)
    // calculate max d value, then determine if b is valid,
    // check if camera points are possible
    let p0 = lineSegment.perpendicularIntersection(point);
    let s1 = new Line(lineSegment.p1, p0);
    let s2 = new Line(p0, lineSegment.p2);
    let maxD = Camera.FOD * Math.cos(45*(Math.PI/180)); // 45degree / equilateral triangle is max optimal

    // rotation
    let theta;
    if (lineSegment.slope() === Infinity || lineSegment.slope() === -Infinity) {
        theta = lineSegment.slope() > 0 ? 90 : -90;
    } else {
        // Calculate angle theta
        theta = Math.atan(lineSegment.slope())*180/Math.PI;
    }

    if (s1.length() >= maxD && s2.length() >= maxD) {
        console.log("Creating Optimal Arrangement")
        // now solve for global position and rotation for cameras
        cameras[0].setPosition(lineSegment.findPointGivenDistance(p0,-maxD));
        cameras[1].setPosition(lineSegment.findPointGivenDistance(p0,maxD));

        // cases,
        console.log(theta)
        cameras[0].setRotation(theta+45+(Camera.FOV/2));
        cameras[1].setRotation(theta+135-(Camera.FOV/2));
    } else if (s1.length() < s2.length()) {
        // if s1 is shortest
        console.log("Creating Sub-Optimal Arrangement s1 shortest");
        cameras[0].setPosition(lineSegment.p1);
        cameras[1].setPosition(lineSegment.findPointGivenDistance(p0,s1.length()));

        console.log(theta,Math.acos(s1.length()/Camera.FOD))
        cameras[0].setRotation(theta+(Camera.FOV/2)+ (Math.acos(s1.length()/Camera.FOD)*180/Math.PI) );
        cameras[1].setRotation(theta-(Camera.FOV/2)+180- (Math.acos(s1.length()/Camera.FOD))*180/Math.PI );
    } else if (s1.length() > s2.length()) {
        // if s2 is shortest
        console.log("Creating Sub-Optimal Arrangement s2 shortest");
        cameras[1].setPosition(lineSegment.p2);
        cameras[0].setPosition(lineSegment.findPointGivenDistance(p0,s2.length()));

        cameras[1].setRotation(theta+(Camera.FOV/2)+ (Math.acos(s2.length()/Camera.FOD)*180/Math.PI));
        cameras[0].setRotation(theta-(Camera.FOV/2)+180- (Math.acos(s2.length()/Camera.FOD)*180/Math.PI));
    }
}