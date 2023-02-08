import { CollisionComponent } from "../../engine/components/collisionComponent";
import { MotionComponent } from "../../engine/components/motionComponent";
import { PositionComponent } from "../../engine/components/positionComponent";
import { ECS } from "../../engine/ecs/ecs";
import { Entity } from "../../engine/ecs/entity";
import { Models } from "../models";
import { Modifier } from "../projectile/modifier";
import { Projectile } from "../projectile/projectile";
import { WrappedAbility } from "./wrappedAbility";

type CannonAbilityArgs = {
    abilityId: number;
    angle: number;
    owner: Entity;
};

export class CannonAbility {
    wrapped: WrappedAbility;
    private projectileModifiers: Modifier[] = [];
    private angle: number;

    constructor({ abilityId, owner, angle = 0 }: Partial<CannonAbilityArgs>) {
        this.wrapped = new WrappedAbility(abilityId);
        this.angle = angle;

        this.wrapped.bind(owner);

        this.wrapped.events.on("cast", (caster) => {
            this.fire(caster);
        });
    }

    setProjectileModifiers(...modifiers: Modifier[]) {
        this.projectileModifiers = modifiers;
    }

    fire(caster: Entity) {
        const posComp = caster.getComponent<PositionComponent>("position");
        const motionComp = caster.getComponent<MotionComponent>("motion");
        const collisonComp =
            caster.getComponent<CollisionComponent>("collision");

        //Target is the casters current velocity rotated by some amount
        //and ensured to have some actual length
        const velClone = motionComp.velocity.clone();
        const targetPos = velClone.rotate(this.angle).normalize();


        const proj = new Projectile({
            startX: posComp.position.x,
            startY: posComp.position.y,
            targetX: posComp.position.x + targetPos.x,
            targetY: posComp.position.y + targetPos.y,
            angularVelocity: 0,
            model: "Fireball",
            collisionGroup: collisonComp.group,
            modifiers: this.projectileModifiers.slice(),
            owner: caster,
            range: 500,
            speed: 500,
        });

        ECS.getInstance().addEntity(proj);
    }
}
