import { Timer } from "../../../node_modules/w3ts/index";
import { CollisionComponent } from "../../engine/components/collisionComponent";
import { MotionComponent } from "../../engine/components/motionComponent";
import { PositionComponent } from "../../engine/components/positionComponent";
import { TextComponent } from "../../engine/components/textComponent";
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
    private owner: Entity;


    private maxAmmo = 6;
    private currAmmo = 6;

    private ammoTimer = new Timer();

    constructor({ abilityId, owner, angle = 0 }: Partial<CannonAbilityArgs>) {
        this.wrapped = new WrappedAbility(abilityId);
        this.angle = angle;
        this.owner = owner;

        this.wrapped.bind(owner);

        this.wrapped.events.on("cast", (caster) => {
            this.fire(caster);
        });

        this.ammoTimer.start(1, true, () => {
            this.updateAmmo();
        });
    }

    private updateAmmo() {
        try {
            this.currAmmo++;
            const textComp = this.owner.getComponent<TextComponent>('text');
            textComp.setLine('Ammo', ''+this.currAmmo);
        } catch (e) {
            print(e);
        }
    }

    setProjectileModifiers(...modifiers: Modifier[]) {
        this.projectileModifiers = modifiers;
    }

    fire(caster: Entity) {
        this.currAmmo -= 1;
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
            range: 1000,
            speed: 2000,
        });

        ECS.getInstance().addEntity(proj);
    }
}
