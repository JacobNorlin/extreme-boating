import { PositionComponent } from "../../engine/components/positionComponent";
import { ECS } from "../../engine/ecs/ecs";
import { EventModifier, ProjectileModifier } from "./modifier";
import { Projectile } from "./projectile";

type NovaModifierArgs = {
    numProjs?: number;
    speedModifier?: number;
    angularVelocity?: number;
    range?: number
};

export class NovaModifier extends EventModifier {

    private numProjs: number;
    private speedModifier: number;
    private angularVelocity: number;
    private range: number

    constructor(
        modifiers: ProjectileModifier[],
        {
            numProjs = 12,
            speedModifier = 1.5,
            angularVelocity = 0,
            range = 0
        }: NovaModifierArgs
    ) {
        super(modifiers);

        this.numProjs = numProjs;
        this.speedModifier = speedModifier;
        this.angularVelocity = angularVelocity;
        this.range = range;
    }

    bindEvents(projectile: Projectile) {
        projectile.events.on("expire", (p) => this.run(p));
        projectile.events.on("collide", (p, _o) => this.run(p));
    }

    run(projectile: Projectile) {
        const posComp = projectile.getComponent<PositionComponent>("position");
        const position = posComp.position;

        for (let i = 0; i < this.numProjs; i++) {
            const angle = ((math.pi * 2) / this.numProjs) * i;
            const p = new Projectile({
                ...projectile.config,
                startX: position.x,
                startY: position.y,
                targetX: position.x + 2 * Math.cos(angle),
                targetY: position.y + 2 * Math.sin(angle),
                range: this.range === 0 ? projectile.config.range : this.range,
                speed: projectile.config.speed * this.speedModifier,
                modifiers: this.modifiers.slice(),
                angularVelocity: this.angularVelocity,
            });
            ECS.getInstance().addEntity(p);
        }
    }
}
