import { EventHandler } from "../event/eventHandler";
import { Unit } from "w3ts";
import { Component } from "../ecs/component";
import { Vec2 } from "../util/vec2";

export interface MotionArgs {
    x: number;
    y: number;
    velX: number;
    velY: number;
    friction: number;
    inertia: number;
    angularVelocity: number
}

type MotionEvents = {
    'move': <T>(this: T) => void
}

export class MotionComponent extends Component<"motion"> {
    type: "motion" = "motion";

    position: Vec2;
    velocity: Vec2;
    friction: number;
    inertia: number;
    distance = 0;
    angularVelocity = 0;

    events = new EventHandler<MotionEvents>();

    constructor(args: MotionArgs) {
        super();
        this.position = new Vec2(args.x, args.y);
        this.velocity = new Vec2(args.velX, args.velY);
        this.friction = args.friction;
        this.inertia = args.inertia;
        this.angularVelocity = args.angularVelocity;
    }
}
