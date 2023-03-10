import { Entity } from "./entity";

export type ComponentCtor<T extends Component = Component<any>> = new (
    ...args: any[]
) => T;

export type LiftCompType<C extends Component> = C extends Component<infer R> ? R : never;

export abstract class Component<CompType extends string = string> {
    abstract readonly type: CompType;
    private _owner?: Entity

    get owner() {
        if (!this._owner) {
            throw Error(`Component ${type} has no owner`);
        }
        return this._owner as Entity;
    }

    set owner(entity: Entity){
        this._owner = entity;
    }

    abstract dispose(): void
}
