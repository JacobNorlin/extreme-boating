import { Entity } from "../../engine/ecs/entity";
import { Logger } from "../../engine/util/logger";
import { ECS } from "../../engine/ecs/ecs";
import { EventModifier, ProjectileModifier } from "./modifier";
import { Projectile } from "./projectile";
import { PositionComponent } from "../../engine/components/positionComponent";

const logger = Logger.getInstance("ChainModifer");

export class ChainModifier extends EventModifier {
    type: "event" = "event";
    constructor(modifiers: ProjectileModifier[]) {
        super(modifiers);
    }

    bindEvents(sourceProjectile: Projectile): void {
        sourceProjectile.events.on("collide", (p, o) => {
            this.run(p, o);
        });
    }

    run(p: Projectile, targetEntity: Entity): void {
        const posComp = p.getComponent<PositionComponent>("position");
        const position = posComp.position;

        logger.log(`chain proj: ${p.id}, target: ${targetEntity.id}`);
        let targets = ECS.getInstance()
            .getEntitiesInBounds(position.x, position.y, 1000)
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
        const targetPosComp =
            target.getComponent<PositionComponent>("position");
        const targetPos = targetPosComp.position;

        const chain = new Projectile({
            ...p.config,
            startX: position.x,
            startY: position.y,
            targetX: targetPos.x,
            targetY: targetPos.y,
            modifiers: this.modifiers.slice(),
        });

        ECS.getInstance().addEntity(chain);
    }
}
