import { Timer } from "../../../node_modules/w3ts/index";
import { CollisionComponent } from "../../engine/components/collisionComponent";
import { MotionComponent } from "../../engine/components/motionComponent";
import { PositionComponent } from "../../engine/components/positionComponent";
import { TextComponent } from "../../engine/components/textComponent";
import { ECS } from "../../engine/ecs/ecs";
import { Entity } from "../../engine/ecs/entity";
import { ProjectileModifier } from "../projectile/modifier";
import { Projectile } from "../projectile/projectile";
import { WrappedAbility } from "./wrappedAbility";

type CannonAbilityArgs = {
    abilityId: number;
    angle?: number;
    owner: Entity;
    name: string;
    ammoProvider: CannonAmmoProvider
};


export class CannonAmmoProvider{

    private maxAmmo = 6;
    private currAmmo = 6;
    private owner: Entity;

    private autoReplenishTimer: Timer;

    constructor(owner: Entity) {
        this.owner = owner;

        this.autoReplenishTimer = new Timer();
        this.autoReplenishTimer.start(1, true, () => {
            this.addAmmo(1);
        });
    }

    hasAmmo() {
        return this.currAmmo > 0;
    }

    consumeAmmo() {
        this.currAmmo--;
        this.updateAmmoText();
    }

    addAmmo(amount: number) {
        this.currAmmo = Math.min(this.currAmmo + amount, this.maxAmmo);
        this.updateAmmoText();
    }

    updateAmmoText() {
        if (!this.owner.hasComponent<TextComponent>('text')) {
            return;
        }
        const textComp = this.owner.getComponent<TextComponent>('text');
        textComp.setLine('Ammo', this.currAmmo, 8);
    }

    dispose() {
        this.autoReplenishTimer.destroy();
    }

}

export class CannonAbility {
    wrapped: WrappedAbility;
    private projectileModifiers: ProjectileModifier[] = [];
    private angle: number;
    private owner: Entity;
    private name: string;
    private ammoProvider: CannonAmmoProvider;

    private maxAmmo = 6;
    private currAmmo = 6;

    private ammoTimer = new Timer();

    constructor({ abilityId, owner, name, ammoProvider, angle = 0 }: CannonAbilityArgs) {
        this.wrapped = new WrappedAbility(abilityId);
        this.angle = angle;
        this.owner = owner;
        this.name = name;
        this.ammoProvider = ammoProvider;

        this.wrapped.bind(owner);

        this.wrapped.events.on("cast", (caster) => {
            this.fire(caster);
        })
    }

    setProjectileModifiers(...modifiers: ProjectileModifier[]) {
        this.projectileModifiers = modifiers;
    }

    fire(caster: Entity) {
        if (!this.ammoProvider.hasAmmo()) {
            return;
        }

        this.ammoProvider.consumeAmmo();

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
            model: "Cannonball",
            collisionGroup: collisonComp.group,
            modifiers: this.projectileModifiers.slice(),
            owner: caster,
            range: 500,
            speed: 500,
        });

        //Perform a single velocity update to preserve caster momentum in proj
        const projMotion = proj.getComponent<MotionComponent>('motion');
        projMotion.velocity.add(motionComp.velocity);

        ECS.getInstance().addEntity(proj);
    }
}
