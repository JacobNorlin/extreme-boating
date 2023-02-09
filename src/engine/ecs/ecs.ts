import { Unit } from "w3ts";
import { PositionComponent } from "../components/positionComponent";
import { UnitComponent } from "../components/unitComponent";
import { AABB } from "../util/AABB";
import { Logger } from "../util/logger";
import { QuadTree } from "../util/quadTree";
import { Component, LiftCompType } from "./component";
import { Entity } from "./entity";
import { System } from "./system";

const logger = Logger.getInstance('ECS');

type AwaitedCallback = {
    duration: number;
    callback: (this: any) => void
}

//Container for everything in the system
export class ECS {
    private systems: System[] = [];
    private entities: Set<Entity> = new Set();
    private static _instance: ECS | null = null;
    private awaitedCallbacks: Set<AwaitedCallback> = new Set();

    static getInstance() {
        if (!this._instance) {
            this._instance = new ECS();
        }

        return this._instance;
    }

    constructor() {}


    awaitDuration(duration: number, callback: (this: any) => void) {
        this.awaitedCallbacks.add({
            duration: duration,
            callback: callback
        });
    }

    private tickAwaitedCallbacks(delta: number) {
        for (const awaitedCallback of this.awaitedCallbacks) {
            awaitedCallback.duration -= delta;
            if (awaitedCallback.duration <= 0) {
                awaitedCallback.callback();
                this.awaitedCallbacks.delete(awaitedCallback);
            }
        }
    }

    addEntity(entity: Entity) {
        logger.log(`Add entity: ${entity.id}`);
        this.entities.add(entity);
    }

    removeEntity(entity: Entity) {
        this.entities.delete(entity);
    }

    addSystem(system: System) {
        this.systems.push(system);
    }

    runSystems(delta: number) {
        for (const system of this.systems) {
            const matched = this.queryEntities(system.types);
            system.update(matched, delta);
        }
    }

    tick(delta: number) {
        this.runSystems(delta);
        this.tickAwaitedCallbacks(delta);
    }

    queryEntities(components: readonly LiftCompType<Component>[]) {
        const matched = new Set<Entity>();

        for (const entity of this.entities) {
            const canAdd = components.every((comp) =>
                entity.hasComponent(comp)
            );
            if (canAdd) {
                matched.add(entity);
            }
        }

        return matched;
    }

    getEntityWithUnit(unit: Unit) {
        const entities = this.queryEntities(["unit"]);
        for (const entity of entities) {
            const unitComp = entity.getComponent<UnitComponent>("unit");
            if (unitComp.unit === unit) {
                return entity;
            }
        }
        return null;
    }

    getEntitiesInBounds(x: number, y: number, range: number) {
        const bounds = new AABB(
            x - (range + 10) / 2,
            y - (range + 10) / 2,
            range + 10,
            range + 10
        );

        const tree = new QuadTree<PositionComponent>(bounds);
        const motionEntities = this.queryEntities(["motion"]);
        for (const entity of motionEntities) {
            const motion = entity.getComponent<PositionComponent>("position");
            tree.insert(motion);
        }

        const matches = tree.queryRange(bounds);
        //Don't think this can ever actually not be set
        return matches.map((e) => e.owner as Entity);
    }
}
