import { Unit } from "w3ts";
import { Component } from "../ecs/component";

export class UnitComponent extends Component<"unit"> {
    type: "unit" = "unit";

    unit: Unit;

    constructor(unit: Unit) {
        super();
        this.unit = unit;
    }

    updatePosition(x: number, y: number) {
        this.unit.x = x;
        this.unit.y = y;
    }

    setAngle(angle: number) {
        this.unit.facing = math.deg(angle);
    }

    getAngle() {
        return math.rad(this.unit.facing);
    }

    dispose(): void {
        this.unit.destroy();
    }
}
