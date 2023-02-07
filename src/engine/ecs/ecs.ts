import { MotionComponent } from "engine/components/motionComponent";
import { UnitComponent } from "engine/components/unitComponent";
import { AABB } from "../util/AABB";
import { QuadTree } from "../util/quadTree";
import { Unit } from "w3ts";
import { Component, ComponentCtor, LiftCompType } from "./component";
import { Entity } from "./entity";
import { System } from "./system";
import { Logger } from "../util/logger";

const logger = Logger.getInstance('ECS');

//Container for everything in the system
export class ECS {
    private systems: System[] = [];
    private entities: Set<Entity> = new Set();
    private static _instance: ECS | null = null;

    static getInstance() {
        if (!this._instance) {
            this._instance = new ECS();
        }

        return this._instance;
    }

    constructor() {}

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

        const tree = new QuadTree<MotionComponent>(bounds);
        const motionEntities = this.queryEntities(["motion"]);
        for (const entity of motionEntities) {
            const motion = entity.getComponent<MotionComponent>("motion");
            tree.insert(motion);
        }

        const matches = tree.queryRange(bounds);
        //Don't think this can ever actually not be set
        return matches.map((e) => e.owner as Entity);
    }
}
