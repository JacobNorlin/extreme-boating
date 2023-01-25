import { AABB } from "../projectile/AABB";
import { Rectangle } from "w3ts";

class World {
    private _minX: number = -1;
    private _maxX: number = -1;
    private _minY: number = -1;
    private _maxY: number = -1;

    public initialize() {
        const bounds = Rectangle.fromHandle(GetPlayableMapRect());

        this._minX = bounds.minX;
        this._maxX = bounds.maxX;
        this._minY = bounds.minY;
        this._maxY = bounds.maxY;
    }

    public get maxX() {
        return this._maxX;
    }
    public get maxY() {
        return this._maxY;
    }
    public get minX() {
        return this._minX;
    }
    public get minY() {
        return this._minY;
    }

    public getAABB() {
        return new AABB(
            this.minX,
            this.minY,
            this.maxX - this.minX,
            this.maxY - this.minY
        );
    }
}

const WORLD = new World();

export { WORLD };
