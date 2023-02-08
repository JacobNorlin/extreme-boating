import { Logger } from "../../engine/util/logger";
import { MotionComponent } from "../../engine/components/motionComponent";
import { ECS } from "../../engine/ecs/ecs";
import { EventModifier, Modifier } from "./modifier";
import { Projectile } from "./projectile";
import { PositionComponent } from "../../engine/components/positionComponent";
import { Vec2 } from "../../engine/util/vec2";

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
        const posComp = p.getComponent<PositionComponent>("position");

        let targets = ECS.getInstance()
            .getEntitiesInBounds(posComp.position.x, posComp.position.y, 1000)
            .filter((t) => {
                return (
                    t.id !== p.id &&
                    p.config.owner.id !== t.id &&
                    !(t instanceof Projectile)
                );
            });

        if (targets.length === 0) {
            return;
        }

        //Find closest target
        let minDist = 10000;
        let closest = targets[0];
        for (const target of targets) {
            const targetPos =
                target.getComponent<PositionComponent>("position");
            const dist = new Vec2(
                posComp.position.x - targetPos.position.x,
                posComp.position.y - targetPos.position.y
            ).length();
            if (dist < minDist) {
                minDist = dist;
                closest = target;
            }
        }

        const targetPos = closest.getComponent<PositionComponent>("position");
        const dist = new Vec2(
            posComp.position.x - targetPos.position.x,
            posComp.position.y - targetPos.position.y
        );
        const midPoint = dist.add(motion.velocity);
        midPoint.multiply(motion.velocity.length() / midPoint.length());
        print(midPoint.length());

        motion.velocity.x = midPoint.x;
        motion.velocity.y = midPoint.y;
    }
}
