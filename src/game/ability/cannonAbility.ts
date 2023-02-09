import { Effect, Timer } from "../../../node_modules/w3ts/index";
import { CollisionComponent } from "../../engine/components/collisionComponent";
import { MotionComponent } from "../../engine/components/motionComponent";
import { PositionComponent } from "../../engine/components/positionComponent";
import { TextComponent } from "../../engine/components/textComponent";
import { ECS } from "../../engine/ecs/ecs";
import { Entity } from "../../engine/ecs/entity";
import { Vec2 } from "../../engine/util/vec2";
import { Models } from "../models";
import { ProjectileModifier } from "../projectile/modifier";
import { Projectile } from "../projectile/projectile";
import { WrappedAbility } from "./wrappedAbility";

type CannonAbilityArgs = {
    abilityId: number;
    angle?: number;
    owner: Entity;
    name: string;
    ammoProvider: CannonAmmoProvider;
};

export class CannonAmmoProvider {
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
        if (!this.owner.hasComponent<TextComponent>("text")) {
            return;
        }
        const textComp = this.owner.getComponent<TextComponent>("text");
        textComp.setLine("Ammo", this.currAmmo, 8);
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

    constructor({
        abilityId,
        owner,
        name,
        ammoProvider,
        angle = 0,
    }: CannonAbilityArgs) {
        this.wrapped = new WrappedAbility(abilityId);
        this.angle = angle;
        this.owner = owner;
        this.name = name;
        this.ammoProvider = ammoProvider;

        this.wrapped.bind(owner);

        this.wrapped.events.on("cast", (caster) => {
            this.fire(caster);
        });
    }

    setProjectileModifiers(...modifiers: ProjectileModifier[]) {
        this.projectileModifiers = modifiers;
    }


    private getFirePos(caster: Entity) {
        const posComp = caster.getComponent<PositionComponent>('position');
        const motionComp = caster.getComponent<MotionComponent>('motion');

        //Target vector relative to caster position
        const targetVec = motionComp.velocity.clone();
        targetVec.rotate(this.angle);
        //Make independent of caster velocity
        targetVec.normalize();
        //Offset so projectile isn't fire from inside the caster
        targetVec.multiply(40);
        //Translate to global coordinate system
        targetVec.add(posComp.position);

        return targetVec;
    }

    private fire(caster: Entity) {

        const collisionComp = caster.getComponent<CollisionComponent>('collision');
        const positionComp = caster.getComponent<PositionComponent>('position');
        const motionComp = caster.getComponent<MotionComponent>('motion')

        this.ammoProvider.consumeAmmo();

        const firePos = this.getFirePos(caster);
        //Projectiles target a point so just extend the fire position a bit

        const preFireFx = new Effect(
            Models.Fire,
            firePos.x,
            firePos.y
        );


        const fireFx = new Effect(
            Models.Cannonball,
            firePos.x,
            firePos.y
        );
        const fireAngle = firePos.clone().diff(positionComp.position).angle();
        fireFx.scale = 0.7;
        fireFx.setOrientation(fireAngle - math.pi/2, 0, 90);
        fireFx.destroy();

        ECS.getInstance().awaitDuration(0.3, () => {
            preFireFx.destroy();
        });

        const proj = new Projectile({
            startX: positionComp.position.x,
            startY: positionComp.position.y,
            targetX: firePos.x,
            targetY: firePos.y,
            angularVelocity: 0,
            model: "Cannonball",
            collisionGroup: collisionComp.group,
            modifiers: this.projectileModifiers.slice(),
            owner: caster,
            range: 500,
            speed: 500,
        });

        //Perform a single velocity update to preserve caster momentum in proj
        const projMotion = proj.getComponent<MotionComponent>("motion");
        projMotion.velocity.add(motionComp.velocity);
        

        //Move the caster slightly in opposite direction of the shot
        positionComp.position.x += 5 * math.cos(fireAngle);
        positionComp.position.y += 5 * math.sin(fireAngle);
        
        ECS.getInstance().addEntity(proj);
    }
}
