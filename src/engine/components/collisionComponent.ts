import { Entity } from "../ecs/entity";
import { EventHandler } from "../event/eventHandler";
import { Component } from "../ecs/component";
import { AABB } from "../util/AABB";
import { Vec2 } from "../util/vec2";

type CollisionEvents = {
    collision: <T>(this: T, collider: Entity) => void;
};

export class CollisionComponent extends Component<"collision"> {
    type: "collision" = "collision";

    events = new EventHandler<CollisionEvents>();

    size: number;
    //Collision group to avoid post hoc filtering of collisions
    group: number;

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
}
