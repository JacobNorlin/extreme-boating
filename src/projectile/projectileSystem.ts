import { CollisionEngine } from "engine/collisionEngine";
import { Effect, Timer, Unit } from "w3ts";
import { ProjDefinition } from "./projectile";
import { Vec2 } from "./vec2";

interface Projectile {
    owner: Unit;
    pos: Vec2;
    velocity: Vec2;
    angleVelocity: number;
    effect: Effect;
    distance: number;
    maxDistance: number;
    size: number
}

export class ProjectileSystem {
    private readonly TICK_SPEED = 0.03;
    private tick: Timer = new Timer();

    private projectiles: Projectile[] = [];


    private collisionEngine: CollisionEngine

    constructor(collisionEngine: CollisionEngine) {
        this.collisionEngine = collisionEngine;
        this.tick.start(this.TICK_SPEED, true, () => this.onTick());
    }

    spawn(def: ProjDefinition, owner: Unit, targetX: number, targetY: number) {
        const effect = new Effect(def.modelName, owner.x, owner.y);
        const pos = new Vec2(owner.x, owner.y);
        const target = new Vec2(targetX, targetY);
        const angle = Atan2(target.y - pos.y, target.x - pos.x);

        print(angle);

        const proj: Projectile = {
            owner: owner,
            pos: pos,
            velocity: new Vec2(
                Math.cos(angle) * def.speed * this.TICK_SPEED,
                Math.sin(angle) * def.speed * this.TICK_SPEED
            ),
            angleVelocity: def.angleVelocity * this.TICK_SPEED,
            effect: effect,
            distance: 0,
            size: def.size,
            maxDistance: def.range,
        };

        this.collisionEngine.addCollidable(proj);

        this.projectiles.push(proj);
    }

    private onTick() {
        for (const proj of this.projectiles) {
            //Apply angular velocity
            proj.velocity.rotate(proj.angleVelocity);

            //Add velocity to position vector
            proj.pos.add(proj.velocity);

            //Update distance travelled
            proj.distance += proj.velocity.length();

            //Resolve range limitations
            if (proj.distance >= proj.maxDistance) {
                this.destroyProjectile(proj);
            }

            const collision = this.collisionEngine.getCollisions(proj);
            if (collision) {
                print("Collision!");
            }

            //Update position rendering
            proj.effect.x = proj.pos.x;
            proj.effect.y = proj.pos.y;
        }
    }

    private destroyProjectile(proj: Projectile) {
        print("Destroying projectile");
        this.projectiles = this.projectiles.filter((p) => p !== proj);
        proj.effect.destroy();

        //TODO post effects
    }
}
