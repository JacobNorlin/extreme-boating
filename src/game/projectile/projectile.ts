import { Vec2 } from "../../engine/util/vec2";
import { Effect, Timer, Unit } from "w3ts";
import { CollisionComponent } from "../../engine/components/collisionComponent";
import {
    MotionArgs,
    MotionComponent,
} from "../../engine/components/motionComponent";
import { Entity } from "../../engine/ecs/entity";
import { ModelName, Models } from "../models";
import { EventHandler } from "../../engine/event/eventHandler";
import { Modifier } from "./modifier";
import { PositionComponent } from "../../engine/components/positionComponent";
import { EffectComponent } from "../../engine/components/effectComponent";

interface ProjectileArgs {
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    speed: number;
    range: number;
    model: ModelName;
    modifiers: Modifier[];
    collisionGroup: number;
    angularVelocity: number;
    owner: Entity;
}

type ProjectileEvents = {
    collide: (projectile: Projectile, other: Entity) => void;
    expire: (projectile: Projectile) => void;
    move: (projectile: Projectile) => void;
};

export class Projectile extends Entity {
    config: ProjectileArgs;
    private fx: Effect;
    events = new EventHandler<ProjectileEvents>();

    constructor(config: ProjectileArgs, public depth = 0) {
        super([]);

        this.config = config;

        this.fx = new Effect(
            Models[config.model],
            config.startX,
            config.startY
        );
        this.fx.scale = 0.5;

        this.addComponent(new CollisionComponent(120, config.collisionGroup));
        this.addComponent(
            new PositionComponent({
                x: this.config.startX,
                y: this.config.startY,
            })
        );
        this.addComponent(new EffectComponent({ fx: this.fx }));
        this.addComponent(new MotionComponent(this.getMotionArgs()));

        this.bindEvents();
        this.runModifiers();
    }

    private runModifiers() {
        this.config.modifiers.forEach((m) => {
            switch (m.type) {
                case "event":
                    m.bindEvents(this);
                    break;
                case "static":
                    m.run(this);
                    break;
            }
        });
    }

    private getMotionArgs(): MotionArgs {
        const angle = Atan2(
            this.config.targetY - this.config.startY,
            this.config.targetX - this.config.startX
        );

        return {
            velX: this.config.speed * Math.cos(angle),
            velY: this.config.speed * Math.sin(angle),
            inertia: 0,
            friction: 0,
            angularVelocity: this.config.angularVelocity,
        };
    }

    private bindEvents() {
        const motion = this.getComponent<MotionComponent>("motion");
        const collision = this.getComponent<CollisionComponent>("collision");

        motion.events.on("move", () => {
            this.events.emit("move", this);
            if (motion.distance >= this.config.range) {
                this.events.emit("expire", this);
                this.destroy();
            }
        });

        collision.events.on("collision", (other) => {
            if (other instanceof Projectile) {
                return;
            }

            this.events.emit("collide", this, other);

            const otherMotion = other.getComponent<MotionComponent>("motion");

            this.destroy();
        });
    }
}
