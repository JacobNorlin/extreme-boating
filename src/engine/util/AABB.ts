interface Point {
    x: number;
    y: number;
}

export class AABB {
    readonly x: number;
    readonly y: number;
    readonly w: number;
    readonly h: number;
    readonly r: number;
    readonly b: number;

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.r = x + w;
        this.b = y + h;
    }

    intersects(other: AABB) {
        return (
            (this.x >= other.x &&
                this.x <= other.r &&
                this.y >= other.y &&
                this.y <= other.b) ||
            (other.x >= this.x &&
                other.x <= this.r &&
                other.y >= this.y &&
                other.y <= this.b)
        );
    }

    contains(point: Point) {
        return (
            point.x >= this.x &&
            point.x <= this.r &&
            point.y >= this.y &&
            point.y <= this.b
        );
    }

    nw() {
        return new AABB(this.x, this.y, this.w / 2, this.h / 2);
    }

    ne() {
        return new AABB(this.x + this.w / 2, this.y, this.w / 2, this.h / 2);
    }

    se() {
        return new AABB(
            this.x + this.w / 2,
            this.y + this.h / 2,
            this.w / 2,
            this.h / 2
        );
    }

    sw() {
        return new AABB(this.x, this.y + this.h / 2, this.w / 2, this.h / 2);
    }

    get right() {
        return this.x + this.w;
    }

    get bottom() {
        return this.y + this.h;
    }
}
