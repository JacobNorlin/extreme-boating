import { Entity } from "../../engine/ecs/entity";
import { Logger } from "../../engine/util/logger";
import { MotionComponent } from "../../engine/components/motionComponent";
import { ECS } from "../../engine/ecs/ecs";
import { EventModifier, Modifier } from "./modifier";
import { Projectile } from "./projectile";

const logger = Logger.getInstance("ChainModifer");

export class ChainModifier implements EventModifier {
    type: "event" = "event";
    modifiers: Modifier[] = [];
    constructor(modifiers: Modifier[]) {
        this.modifiers = modifiers;
    }

    bindEvents(sourceProjectile: Projectile): void {
        sourceProjectile.events.on("collide", (p, o) => {
            this.run(p, o);
        });
    }

    run(p: Projectile, targetEntity: Entity): void {
        const motion = p.getComponent<MotionComponent>("motion");

        logger.log(`chain proj: ${p.id}, target: ${targetEntity.id}`);
        let targets = ECS.getInstance()
            .getEntitiesInBounds(motion.position.x, motion.position.y, 1000)
            .filter((t) => {
                logger.log(`chain-filter target ${t.id}`);
                return (
                    t.id !== p.id &&
                    t.id !== targetEntity.id &&
                    p.config.owner.id !== t.id &&
                    !(t instanceof Projectile)
                );
            });

        if (targets.length === 0) {
            return;
        }

        //Should probably sort these by distance
        const target = targets[0];
        logger.log(`Chain target: ${target.id}`);
        const targetMotion = target.getComponent<MotionComponent>("motion");

        const chain = new Projectile({
            ...p.config,
            startX: motion.position.x,
            startY: motion.position.y,
            targetX: targetMotion.position.x,
            targetY: targetMotion.position.y,
            modifiers: this.modifiers.slice(),
        });

        ECS.getInstance().addEntity(chain);
    }
}
