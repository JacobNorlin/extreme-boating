export class Vec2 {
    x: number = 0;
    y: number = 0;

    constructor(x1: number, y1: number) {
        this.x = x1;
        this.y = y1;
    }

    rotate(angle: number) {
        const cos = math.cos(angle);
        const sin = math.sin(angle);
        const nx = cos * this.x - sin * this.y;
        const ny = sin * this.x + cos * this.y;
        this.x = nx;
        this.y = ny;
        return this;
    }

    add(other: Vec2) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    divide(scalar: number) {
        this.x = this.x / scalar;
        this.y = this.y / scalar;
        return this;
    }

    subtract(diff: number) {
        this.x -= diff;
        this.y -= diff;
    }

    diff(other: Vec2) {
        return new Vec2(other.x - this.x, other.y - this.y);
    }

    angle() {
        return Atan2(this.y, this.x);
    }

    multiply(num: number) {
        this.x *= num;
        this.y *= num;
    }

    length() {
        return math.sqrt(Pow(this.x, 2) + Pow(this.y, 2));
    }

    getMultiplied(m: number) {
        return new Vec2(this.x * m, this.y * m);
    }

    clampMin(minX: number, minY: number) {
        this.x = Math.max(this.x, minX);
        this.y = Math.max(this.y, minY);
    }

    clampMax(maxX: number, maxY: number) {
        this.x = Math.min(this.x, maxX);
        this.y = Math.min(this.y, maxY);
    }

    clone() {
        return new Vec2(this.x, this.y);
    }

    normalize() {
        //The 0-vector can't be normalized so I guess that will throw?
        this.divide(this.length());
        return this;
    }
}
