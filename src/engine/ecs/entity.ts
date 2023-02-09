import { Component, LiftCompType } from "./component";
import { ECS } from "./ecs";

export class Entity {
    protected static ID = 0;
    id: number;
    componentMap: Map<LiftCompType<Component>, Component<any>> = new Map();

    private _typesMemo: string[] = [];
    constructor(components: Component[]) {
        this.id = Entity.ID++;

        for (const comp of components) {
            this.addComponent(comp);
        }
    }

    addComponent<T extends Component>(comp: T) {
        comp.owner = this;
        this.componentMap.set(comp.type, comp);
        this.rebuildTypesMemo();
    }

    private rebuildTypesMemo() {
        const comps = this.componentMap.values();
        const typesMemo = [];
        for (const comp of comps) {
            typesMemo.push(comp.type);
        }
        this._typesMemo = typesMemo;
    }

    getComponent<T extends Component>(compType: LiftCompType<T>): T {
        return this.componentMap.get(compType) as T;
    }

    hasComponent<T extends Component>(compType: LiftCompType<T>) {
        return this.componentMap.has(compType);
    }

    getTypes() {
        return this._typesMemo;
    }

    destroy() {
        this.dispose();
        ECS.getInstance().removeEntity(this);
    }

    dispose() {
        for (const comp of this.componentMap.values()) {
            comp.dispose();
        }
        this.componentMap.clear();
    }
}
