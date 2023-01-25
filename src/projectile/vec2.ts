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
    }

    add(other: Vec2) {
        this.x += other.x;
        this.y += other.y;
    }

    angle() {
        return Atan2(this.y, this.x);
    }

    length() {
        return math.sqrt(Pow(this.x, 2) + Pow(this.y, 2));
    }
}
