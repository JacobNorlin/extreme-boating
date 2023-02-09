import { BuffComponent } from "../components/buffComponent";
import { Entity } from "../ecs/entity";
import { System } from "../ecs/system";

export class BuffSystem extends System<[BuffComponent]> {
    types: ["buff"] = ["buff"];

    update(entities: Set<Entity>, delta: number): void {
        for (const entity of entities) {
            const buffComp = entity.getComponent<BuffComponent>("buff");

            for (const buff of buffComp.buffs) {
                if (!buff.isApplied) {
                    print(`Applying buff ${buff.name}`);
                    buff.apply(entity);
                    buff.isApplied = true;
                }

                buff.onTick(delta);

                if (buff.currDuration >= buff.duration) {
                    print(`Removing buff ${buff.name}`);
                    buff.unapply(entity);
                    buffComp.removeBuff(buff);
                }
            }
        }
    }
}
