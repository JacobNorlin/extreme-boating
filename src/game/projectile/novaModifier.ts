import { PositionComponent } from "../../engine/components/positionComponent";
import { ECS } from "../../engine/ecs/ecs";
import { EventModifier, Modifier } from "./modifier";
import { Projectile } from "./projectile";

export class NovaModifier implements EventModifier {
    type: "event" = "event";
    modifiers: Modifier[] = [];
    constructor(modifiers: Modifier[]) {
        this.modifiers = modifiers;
    }

    bindEvents(projectile: Projectile) {
        projectile.events.on("expire", (p) => this.run(p));
        projectile.events.on("collide", (p, _o) => this.run(p));
    }

    run(projectile: Projectile) {
        const posComp = projectile.getComponent<PositionComponent>("position");
        const position = posComp.position;

        for (let i = 0; i < 6; i++) {
            const angle = ((math.pi * 2) / 6) * i;
            const p = new Projectile({
                ...projectile.config,
                startX: position.x,
                startY: position.y,
                targetX: position.x + 2 * Math.cos(angle),
                targetY: position.y + 2 * Math.sin(angle),
                range: projectile.config.range,
                speed: projectile.config.speed,
                modifiers: this.modifiers.slice(),
                angularVelocity: 0.1,
            });
            ECS.getInstance().addEntity(p);
        }
    }
}
