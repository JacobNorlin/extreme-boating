import { Logger } from "../../engine/util/logger";
import { MotionComponent } from "../../engine/components/motionComponent";
import { ECS } from "../../engine/ecs/ecs";
import { EventModifier, ProjectileModifier } from "./modifier";
import { Projectile } from "./projectile";
import { PositionComponent } from "../../engine/components/positionComponent";
import { Vec2 } from "../../engine/util/vec2";

const logger = Logger.getInstance("ChainModifer");

export class HomingModifier extends EventModifier {
    constructor(modifiers: ProjectileModifier[]) {
        super(modifiers);
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



        //Basic strategy here is to move the current velocity vector
        //of the projectile to the midpoint between it's current trajectory
        //and the position of the target. The "homingness" should be 
        //adjustable by chosing a point less or more towards the middle
        const targetPos = closest.getComponent<PositionComponent>("position");
        //Find vector between projectile and target it is aiming for
        const dist = new Vec2(
            targetPos.position.x - posComp.position.x,
            targetPos.position.y - posComp.position.y
        );
        //Find vector halfway between the projectiles current velocity
        //and the direct path to the target
        const midPoint = dist.add(motion.velocity);
        //Normalize to length of current projectile velocity
        midPoint.multiply(motion.velocity.length() / midPoint.length());

        //Update velocity to the midpoint
        motion.velocity.x = midPoint.x;
        motion.velocity.y = midPoint.y;
    }
}
