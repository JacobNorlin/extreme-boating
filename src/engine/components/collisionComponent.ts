import { Entity } from "../ecs/entity";
import { EventHandler } from "../event/eventHandler";
import { Component } from "../ecs/component";
import { AABB } from "../util/AABB";
import { Vec2 } from "../util/vec2";
import { DebugRenderer } from "../util/debugRenderer";

type CollisionEvents = {
    collision: <T>(this: T, collider: Entity) => void;
};

export class CollisionComponent extends Component<"collision"> {
    type: "collision" = "collision";

    events = new EventHandler<CollisionEvents>();

    size: number;
    //Collision group to avoid post hoc filtering of collisions
    group: number;

    private debugFx: lightning[] = [];

    constructor(size: number, group: number) {
        super();
        this.size = size;
        this.group = group;
    }

    getBoundary(x: number, y: number) {
        return new AABB(
            x - this.size / 2,
            y - this.size / 2,
            this.size,
            this.size
        );
    }

    debugRender(cx: number, cy: number) {
        for (const l of this.debugFx) {
            DestroyLightning(l);
        }

        const bounds = this.getBoundary(cx, cy);
        this.debugFx = DebugRenderer.renderBoxAsLightning(bounds);
    }

    dispose(): void {
        this.debugFx.forEach(fx => DestroyLightning(fx));
    }
}
