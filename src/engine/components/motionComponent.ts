import { EventHandler } from "../event/eventHandler";
import { Component } from "../ecs/component";
import { Vec2 } from "../util/vec2";

export interface MotionArgs {
    velX: number;
    velY: number;
    friction: number;
    inertia: number;
    angularVelocity: number;
}

type MotionEvents = {
    move: <T>(this: T) => void;
};

export class MotionComponent extends Component<"motion"> {
    type: "motion" = "motion";

    velocity: Vec2;
    friction: number;
    inertia: number;
    distance = 0;
    angularVelocity = 0;

    events = new EventHandler<MotionEvents>();

    constructor({
        velX = 0,
        velY = 0,
        friction = 0,
        inertia = 0,
        angularVelocity = 0,
    }: Partial<MotionArgs>) {
        super();
        this.velocity = new Vec2(velX, velY);
        this.friction = friction;
        this.inertia = inertia;
        this.angularVelocity = angularVelocity;
    }

    dispose(): void {
        
    }
}
