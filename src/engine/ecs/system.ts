import { Component, LiftCompType } from "./component";
import { Entity } from "./entity";

export interface SystemCtor<T extends System> {
    new (...args: any[]): T;
}

type FlatMapCompType<Comps extends Component[]> = {[K in keyof Comps] : Comps[K] extends Component ? LiftCompType<Comps[K]> : never}

export abstract class System<C extends Component[] = Component[]> {
    abstract readonly types: FlatMapCompType<C>;

    abstract update(entities: Set<Entity>, delta: number): void;
}