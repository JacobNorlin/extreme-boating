import { Component } from "../ecs/component";
import { Effect, Unit } from "w3ts";

export class Wc3PositionComponent extends Component<"wc3-position"> {
    type: "wc3-position" = "wc3-position";

    private positionable: Unit | Effect;

    constructor(positionable: Unit | Effect, public syncAngle = false, public syncWc3AngleToVelocity = false) {
        super();
        this.positionable = positionable;
    }

    get x() {
        return this.positionable.x;
    }

    get y() {
        return this.positionable.y;
    }

    set x(v: number) {
        this.positionable.x = v;
    }

    set y(v: number) {
        this.positionable.y = v;
    }

    set facing(v: number) {
        if (this.positionable instanceof Effect) {
            this.positionable.setYaw(v);
        }
    }

    get facing() {
        if (this.positionable instanceof Unit) {
            return math.rad(this.positionable.facing);
        }
        return 0;
    }
}
