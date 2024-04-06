class Line {
    constructor(p1,p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    slope() {
        return (((this.p2)[1]-(this.p1)[1])/((this.p2)[0]-(this.p1)[0]));
    }

    length() {
        const deltaX = this.p2[0] - this.p1[0];
        const deltaY = this.p2[1] - this.p1[1];
        return Math.sqrt(deltaX ** 2 + deltaY ** 2);
    }

    static length(p1,p2) {
        return new Line(p1,p2).length();
    }

    perpendicularIntersection(point) {
        if (this.p1[0] === this.p2[0]) {
            return [this.p1[0],point[1]];
        } else if (this.p1[1] === this.p2[1]) {
            return [point[0],this.p1[1]];
        }
        let intercept = [];
        intercept[0] = (this.p1[0] * this.slope() - this.p1[1] + (point[0]/this.slope()) + point[1])/(this.slope() + Math.pow(this.slope(),-1));
        intercept[1] = this.slope() * (intercept[0] - this.p1[0]) + this.p1[1];
        return intercept;
    }

    findPointGivenDistance(p1, distance) {
        // Extract coordinates of p1
        let x1 = p1[0];
        let y1 = p1[1];

        // Initialize theta
        let theta;

        // Check if slope is infinite (vertical line)
        if (this.slope() === Infinity || this.slope() === -Infinity) {
            theta = this.slope() > 0 ? Math.PI / 2 : -Math.PI / 2;
        } else {
            // Calculate angle theta
            theta = Math.atan(this.slope());
        }

        // Calculate new coordinates
        let x = x1 + distance * Math.cos(theta);
        let y = y1 + distance * Math.sin(theta);

        return [x, y];
    }

    intersects(line) {
        // Check if slopes are equal (lines are parallel)
        if (this.slope() === line.slope()) {
            return false;
        }

        // Calculate intersection point using point-slope form
        let p = this.intercept(line);
        let x = p[0];
        let y = p[1];

        // Check if the intersection point is within the segments
        return x >= Math.min(this.p1[0], this.p2[0]) && x <= Math.max(this.p1[0], this.p2[0]) &&
            x >= Math.min(line.p1[0], line.p2[0]) && x <= Math.max(line.p1[0], line.p2[0]) &&
            y >= Math.min(this.p1[1], this.p2[1]) && y <= Math.max(this.p1[1], this.p2[1]) &&
            y >= Math.min(line.p1[1], line.p2[1]) && y <= Math.max(line.p1[1], line.p2[1]);
    }

    intercept(line) {
        // Calculate intersection point using point-slope form
        let x = (line.slope() * line.p1[0] - this.slope() * this.p1[0] + this.p1[1] - line.p1[1]) / (line.slope() - this.slope());
        let y = this.slope() * (x - this.p1[0]) + this.p1[1];

        return [x, y];
    }
}

module.exports = {Line}