import { MotionComponent } from "../../engine/components/motionComponent";
import { PositionComponent } from "../../engine/components/positionComponent";
import { ECS } from "../../engine/ecs/ecs";
import { EventModifier, ProjectileModifier } from "./modifier";
import { Projectile } from "./projectile";

export class SplitModifier extends EventModifier {
    constructor(modifiers: ProjectileModifier[]) {
        super(modifiers);
    }

    bindEvents(p: Projectile): void {
        p.events.on("collide", (p) => this.run(p));
        p.events.on("expire", (p) => this.run(p));
    }

    run(p: Projectile) {
        const motionComp = p.getComponent<MotionComponent>("motion");
        const posComp = p.getComponent<PositionComponent>("position");
        const position = posComp.position;

        const v1 = motionComp.velocity.clone().rotate(0.3);
        const v2 = motionComp.velocity.clone().rotate(-0.3);

        const p1 = new Projectile({
            ...p.config,
            startX: position.x,
            startY: position.y,
            targetX: position.x + v1.x,
            targetY: position.y + v1.y,
            range: p.config.range / 1.5,
            modifiers: this.modifiers.slice(),
            angularVelocity: 0,
        });
        const p2 = new Projectile({
            ...p.config,
            startX: position.x,
            startY: position.y,
            targetX: position.x + v2.x,
            targetY: position.y + v2.y,
            range: p.config.range / 1.5,
            modifiers: this.modifiers.slice(),
            angularVelocity: 0,
        });

        ECS.getInstance().addEntity(p1);
        ECS.getInstance().addEntity(p2);
    }
}
