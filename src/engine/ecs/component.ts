import { Entity } from "./entity";

export type ComponentCtor<T extends Component = Component<any>> = new (
    ...args: any[]
) => T;

export type LiftCompType<C extends Component> = C extends Component<infer R> ? R : never;

export abstract class Component<CompType extends string = string> {
    abstract readonly type: CompType;
    owner?: Entity
}
