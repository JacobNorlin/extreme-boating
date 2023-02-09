import { Buff } from "../../game/ability/buff/buff";
import { Component } from "../ecs/component";

export class BuffComponent extends Component<"buff"> {
    type: "buff" = "buff";
    buffs: Set<Buff> = new Set();

    constructor() {
        super();
    }

    addBuff(buff: Buff) {
        const canAdd = buff.requiredComponents.every((compType) =>
            this.owner.hasComponent(compType)
        );

        if (!canAdd) {
            print(
                `Unable to add buff ${
                    buff.name
                } with require components ${buff.requiredComponents.join(", ")}`
            );
            return;
        }

        this.buffs.add(buff);
    }

    removeBuff(buff: Buff) {
        this.buffs.delete(buff);
    }

    dispose(): void {
        this.buffs.clear();
    }
}
