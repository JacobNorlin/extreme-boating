import { MotionComponent } from "../../../engine/components/motionComponent";
import { Entity } from "../../../engine/ecs/entity";
import { Buff } from "./buff";

type SlowBuffArgs = {
    amount: number //percentage
    duration: number
}

export class SlowBuff extends Buff<[MotionComponent]> {
    requiredComponents: ["motion"] = ["motion"];
    private amount: number;

    constructor({amount = 0.5, duration = 3} : SlowBuffArgs) {
        super("Slow", duration);
        this.amount = amount;
    }

    apply(entity: Entity): void {
        const motionComp = entity.getComponent<MotionComponent>('motion');
        motionComp.velocity.multiply(this.amount);
    }

    unapply(entity: Entity) {
        const motionComp = entity.getComponent<MotionComponent>('motion');
        motionComp.velocity.multiply(1 / this.amount);
    }
}
