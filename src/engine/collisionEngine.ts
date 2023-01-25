import { QuadTree } from "../projectile/quadTree";
import { Timer } from "w3ts";
import { WORLD } from "./world";
import { AABB } from "../projectile/AABB";

interface Collidable {
    pos: Point;
    size: number;
}

interface Point {
    x: number;
    y: number;
}

/**
 * Continuously updates a QuadTree with all items that can collide.
 * Used to query if something is colliding, up to someone else to do something.
 */
export class CollisionEngine {
    private collisionItems: Collidable[] = [];
    private updateTick = new Timer();
    private quadTree: QuadTree<Collidable> = new QuadTree(WORLD.getAABB());

    constructor() {
        this.updateTick.start(0.1, true, () => this.updateTree());
    }

    public addCollidable(collidable: Collidable) {
        this.collisionItems.push(collidable);
    }

    public removeCollidable(collidable: Collidable) {
        this.collisionItems = this.collisionItems.filter(
            (c) => c !== collidable
        );
    }

    private updateTree() {
        try {
            this.quadTree.empty();

            for (const item of this.collisionItems) {
                this.quadTree.insert(item);
            }
        } catch (e) {
            print(e);
        }
    }

    public getCollisions<T extends Collidable>(target: T) {
        const range = new AABB(
            target.pos.x,
            target.pos.y,
            target.size,
            target.size
        );
        const inRange = this.quadTree.queryRange(range);

        for (const elm of inRange) {
            if (this.elmsIntersect(elm, target)) {
                return elm;
            }
        }
    }

    private elmsIntersect(a: Collidable, b: Collidable) {
        const dx = b.pos.x - b.pos.x;
        const dy = b.pos.y - a.pos.y;
        const len = math.sqrt(dx * dx + dy * dy);

        return len <= a.size + b.size;
    }
}
