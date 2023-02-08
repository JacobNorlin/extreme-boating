import { CollisionComponent } from "../engine/components/collisionComponent";
import { MotionComponent } from "../engine/components/motionComponent";
import { Component } from "../engine/ecs/component";
import { Entity } from "../engine/ecs/entity";


export class Powerup extends Entity{
    constructor(components: Component[], x: number, y: number) {
        super(components);

        this.addComponent(new CollisionComponent(120, 99));
        this.addComponent(new MotionComponent({
            velX: 0,
            velY: 0,
            angularVelocity: 0,
            friction: 0,
            inertia: 0
        }));

        this.bindEvents();
    }

    private bindEvents() {
        const collision = this.getComponent<CollisionComponent>('collision');

        collision.events.on('collision', (other) => {
            this.destroy()
        })
    }

    private applyPowerup(other: Entity) {
        //Not sure about instanceof checks here
    }
}