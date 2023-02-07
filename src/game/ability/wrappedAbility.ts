import { Logger } from "../../engine/util/logger";
import { Point, Trigger, Unit } from "w3ts";
import { UnitComponent } from "../../engine/components/unitComponent";
import { ECS } from "../../engine/ecs/ecs";
import { Entity } from "../../engine/ecs/entity";
import { EventHandler } from "../../engine/event/eventHandler";

const logger = Logger.getInstance('WrappedAbility');

type AbilityEvents = {
    cast: (caster: Entity, point?: { x: number; y: number }) => void;
};

export class WrappedAbility {
    triggers: Trigger[] = [];
    events = new EventHandler<AbilityEvents>();
    abilityId: number;

    constructor(abilityId: string) {
        this.abilityId = FourCC(abilityId);
    }

    onCast() {
        try {
            const loc = GetSpellTargetLoc();
            const unit = Unit.fromEvent();
            const entity = ECS.getInstance().getEntityWithUnit(unit);
            if (entity === null) {
                logger.warn("Ability cast by non entity unit");
                return;
            }

            if (loc) {
                const point = Point.fromHandle(loc);
                this.events.emit("cast", entity, { x: point.x, y: point.y });
            } else {
                this.events.emit("cast", entity);
            }
        } catch (e) {
            print(e);
        }
    }

    bind(entity: Entity) {
        if (!entity.hasComponent<UnitComponent>("unit")) {
            logger.warn("Trying to bind ability to non unit entity");
            return;
        }

        const castTrigger = new Trigger();
        this.triggers.push(castTrigger);
        castTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SPELL_CAST);
        castTrigger.addAction(() => this.onCast());

        const unitComp = entity.getComponent<UnitComponent>("unit");
        const unit = unitComp.unit;

        unit.addAbility(this.abilityId);

        castTrigger.addCondition(() => {
            const abilityId = GetSpellAbilityId();
            const caster = Unit.fromEvent();
            return caster === unit && this.abilityId === abilityId;
        });
    }
}
