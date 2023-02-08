import { AABB } from "./AABB";
import { DebugRenderer } from "./debugRenderer";

interface Collidable {
    position: Point;
}

interface Point {
    x: number;
    y: number;
}

export class QuadTree<T extends Collidable> {
    readonly CAPACITY = 4;
    private boundary: AABB;
    private elms: T[] = [];

    private nw: QuadTree<T> = null as any;
    private ne: QuadTree<T> = null as any;
    private se: QuadTree<T> = null as any;
    private sw: QuadTree<T> = null as any;
    private debugFx: any[] = [];

    constructor(boundary: AABB) {
        this.boundary = boundary;
    }

    empty() {
        this.elms = [];
        this.subdivide();
    }


    public insert(elm: T) {
        if (!this.boundary.contains(elm.position)) {
            return false;
        }


        if (this.elms.length < this.CAPACITY && !this.hasChildren()) {
            this.elms.push(elm);
            return true;
        }

        if (!this.hasChildren()) {
            this.subdivide();
        }

        const inserted = this.insertInChild(elm);

        return inserted;
    }

    public insertAll(elms: T[]) {
        for (const elm of elms) {
            this.insert(elm);
        }
    }

    private insertInChild(elm: T) {
        this.nw.insert(elm) ||
            this.ne.insert(elm) ||
            this.se.insert(elm) ||
            this.sw.insert(elm);
    }

    private subdivide() {
        this.nw = new QuadTree<T>(this.boundary.nw());
        this.ne = new QuadTree<T>(this.boundary.ne());
        this.se = new QuadTree<T>(this.boundary.se());
        this.sw = new QuadTree<T>(this.boundary.sw());

        for (const elm of this.elms) {
            this.insertInChild(elm);
        }

        this.elms = [];
    }

    public queryRange(range: AABB): T[] {
        if (!this.boundary.intersects(range)) {
            return [];
        }

        const inRange = this.elms.filter((elm) => {
            return range.contains(elm.position);
        });

        if (!this.hasChildren()) {
            return inRange;
        }

        return [
            ...inRange,
            ...this.nw.queryRange(range),
            ...this.ne.queryRange(range),
            ...this.se.queryRange(range),
            ...this.sw.queryRange(range),
        ];
    }

    private hasChildren() {
        return (
            this.nw !== null &&
            this.ne !== null &&
            this.se !== null &&
            this.sw !== null
        );
    }

    debugRender() {
        this.debugFx = DebugRenderer.renderBoxAsLightning(this.boundary);

        if (!this.nw) {
            return;
        }
        this.nw.debugRender();
        this.ne.debugRender();
        this.se.debugRender();
        this.sw.debugRender();
    }

    disposeDebug() {
        DebugRenderer.destroyDebugRender(this.debugFx);
        if (!this.nw) {
            return;
        }
        this.nw.disposeDebug();
        this.ne.disposeDebug();
        this.se.disposeDebug();
        this.sw.disposeDebug();
    }
}
