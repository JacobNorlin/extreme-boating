import { MotionComponent } from "../../engine/components/motionComponent";
import { ECS } from "../../engine/ecs/ecs";
import { EventModifier, Modifier } from "./modifier";
import { Projectile } from "./projectile";

export class SplitModifier implements EventModifier {
    type: "event" = "event";

    modifiers: Modifier[] = [];
    constructor(modifiers: Modifier[]) {
        this.modifiers = modifiers;
    }

    bindEvents(p: Projectile): void {
        p.events.on("collide", (p) => this.run(p));
        p.events.on("expire", (p) => this.run(p));
    }

    run(p: Projectile) {
        const motion = p.getComponent<MotionComponent>("motion");

        const v1 = motion.velocity.clone().rotate(0.3);
        const v2 = motion.velocity.clone().rotate(-0.3);

        const p1 = new Projectile({
            ...p.config,
            startX: motion.position.x,
            startY: motion.position.y,
            targetX: motion.position.x + v1.x,
            targetY: motion.position.y + v1.y,
            range: p.config.range /1.5,
            modifiers: this.modifiers.slice(),
            angularVelocity: 0
        });
        const p2 = new Projectile({
            ...p.config,
            startX: motion.position.x,
            startY: motion.position.y,
            targetX: motion.position.x + v2.x,
            targetY: motion.position.y + v2.y,
            range: p.config.range / 1.5,
            modifiers: this.modifiers.slice(),
            angularVelocity: 0
        });

        ECS.getInstance().addEntity(p1);
        ECS.getInstance().addEntity(p2);
    }
}
