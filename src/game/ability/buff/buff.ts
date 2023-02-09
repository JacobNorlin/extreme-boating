import { Component } from "../../../engine/ecs/component";
import { Entity } from "../../../engine/ecs/entity";
import { FlatMapCompType } from "../../../engine/ecs/system";

export abstract class Buff<T extends Component[] = Component[]> {
    name: string;
    duration: number;
    currDuration = 0;
    stackable = false;
    isApplied = false;
    abstract requiredComponents: FlatMapCompType<T>;

    constructor(name: string, duration: number) {
        this.name = name;
        this.duration = duration;
    }

    onTick(delta: number) {
        this.currDuration += delta;
    }

    abstract apply(entity: Entity): void;
    abstract unapply(entity: Entity): void;
}
