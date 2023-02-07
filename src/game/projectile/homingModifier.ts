import { Entity } from "../../engine/ecs/entity";
import { Logger } from "../../engine/util/logger";
import { MotionComponent } from "../../engine/components/motionComponent";
import { ECS } from "../../engine/ecs/ecs";
import { EventModifier, Modifier } from "./modifier";
import { Projectile } from "./projectile";

const logger = Logger.getInstance("ChainModifer");

export class HomingModifier implements EventModifier {
    type: "event" = "event";
    modifiers: Modifier[] = [];

    constructor(modifiers: Modifier[]) {
        this.modifiers = modifiers;
    }

    bindEvents(sourceProjectile: Projectile): void {
        sourceProjectile.events.on("move", (p) => {
            this.run(p);
        });
    }

    run(p: Projectile): void {
        const motion = p.getComponent<MotionComponent>("motion");

        let targets = ECS.getInstance()
            .getEntitiesInBounds(motion.position.x, motion.position.y, 1000)
            .filter((t) => {
                return t.id !== p.id && p.config.owner.id !== t.id && !(t instanceof Projectile)
            });

        if (targets.length === 0) {
            return;
        }

        //Find closest target
        let minDist = 10000;
        let closest = targets[0];
        for (const target of targets) {
            const targetMotion = target.getComponent<MotionComponent>("motion");
            const dist = motion.position.diff(targetMotion.position).length();
            if (dist < minDist) {
                minDist = dist;
                closest = target;
            }
        }

        const targetMotion = closest.getComponent<MotionComponent>("motion");
        const dist = motion.position.diff(targetMotion.position);
        const midPoint = dist.add(motion.velocity);
        midPoint.multiply(motion.velocity.length() / midPoint.length());
        print(midPoint.length());

        motion.velocity.x = midPoint.x;
        motion.velocity.y = midPoint.y;

        // const half = motion.velocity.clone().add(dist).divide(2).rotate(math.pi);

        // motion.velocity.x = half.x;
        // motion.velocity.y = half.y;
    }
}
