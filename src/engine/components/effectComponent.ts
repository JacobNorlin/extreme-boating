import { Effect } from "w3ts";
import { Component } from "../ecs/component";

type EffectArgs = {
    fx: Effect
}

export class EffectComponent extends Component<'effect'>{
    type: "effect" = "effect";

    private fx: Effect;
    constructor({ fx }: EffectArgs) {
        super();
        this.fx = fx;
    }

    updatePosition(x: number, y: number) {
        this.fx.x = x;
        this.fx.y = y;
    }

    //rad
    setAngle(angle: number) {
        this.fx.setYaw(angle);
    }

    dispose(): void {
        this.fx.destroy();
    }
}