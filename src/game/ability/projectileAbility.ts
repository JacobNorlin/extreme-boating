
import { Modifier } from "../projectile/modifier";
import { MotionComponent } from "../../engine/components/motionComponent";
import { ECS } from "../../engine/ecs/ecs";
import { Entity } from "../../engine/ecs/entity";
import { Loc } from "../../engine/util/types";
import { Projectile } from "../projectile/projectile";
import { WrappedAbility } from "./wrappedAbility";
import { CollisionComponent } from "engine/components/collisionComponent";
import { Logger } from "../../engine/util/logger";

const logger = Logger.getInstance('ProjectileAbility');

export class ProjectileAbility {
    wrapped: WrappedAbility;
    private modifiers: Modifier[] = [];

    constructor(abilityId: string) {
        this.wrapped = new WrappedAbility(abilityId);

        this.bindEvents();
    }

    private bindEvents() {
        this.wrapped.events.on("cast", (caster, target) => {
            if (!target) {
                logger.warn("Projectile without target location");
                return;
            }
            this.cast(caster, target);
        });
    }

    bind(entity: Entity) {
        this.wrapped.bind(entity);
    }

    addModifier(modifier: Modifier) {
        this.modifiers.push(modifier);
    }

    setModifiers(...modifiers: Modifier[]) {
        this.modifiers = modifiers;
    }

    private cast(caster: Entity, target: Loc) {
        try {
            const motion = caster.getComponent<MotionComponent>("motion");
            const collision = caster.getComponent<CollisionComponent>('collision');
            const p = new Projectile({
                startX: motion.position.x,
                startY: motion.position.y,
                targetX: target.x,
                targetY: target.y,
                model: "Fireball",
                modifiers: this.modifiers.slice(),
                range: 400,
                speed: 500,
                collisionGroup: collision.group,
                angularVelocity: 0,
                owner: caster
            });
    
            ECS.getInstance().addEntity(p);
        } catch (e) {
            print(e);
        }
    }
}
