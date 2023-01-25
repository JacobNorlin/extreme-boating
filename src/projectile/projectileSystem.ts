import { Effect, Timer, Unit } from "w3ts";
import { ProjDefinition } from "./projectile";

interface Vec2 {
    x: number;
    y: number;
}

interface Projectile {
    owner: Unit;
    pos: Vec2;
    velocity: Vec2;
    angleVelocity: number;
    effect: Effect;
    distance: number;
    maxDistance: number;
}

class Vec2 {
    x: number = 0;
    y: number = 0;

    constructor(x1: number, y1: number) {
        this.x = x1;
        this.y = y1;
    }

    rotate(angle: number) {
        const cos = math.cos(angle);
        const sin = math.sin(angle);
        const nx = cos * this.x - sin * this.y;
        const ny = sin * this.x + cos * this.y;
        this.x = nx;
        this.y = ny;
    }

    add(other: Vec2) {
        this.x += other.x;
        this.y += other.y;
    }

    angle() {
        return Atan2(this.y, this.x);
    }

    length() {
        return math.sqrt(Pow(this.x, 2) + Pow(this.y, 2));
    }
}

export class ProjectileSystem {
    private readonly TICK_SPEED = 0.03;
    private tick: Timer = new Timer();

    private projectiles: Projectile[] = [];

    constructor() {
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
            maxDistance: def.range,
        };

        this.projectiles.push(proj);
    }

    private onTick() {
        for (const proj of this.projectiles) {
            //Apply angular velocity
            proj.velocity.rotate(proj.angleVelocity);
            print(proj.velocity.angle());

            //Add velocity to position vector
            proj.pos.add(proj.velocity);

            //Update distance travelled
            proj.distance += proj.velocity.length();

            //Resolve range limitations
            if (proj.distance >= proj.maxDistance) {
                this.destroyProjectile(proj);
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
