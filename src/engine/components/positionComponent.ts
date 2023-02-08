import { Component } from "../ecs/component";
import { Vec2 } from "../util/vec2";

type PositionArgs = {
    x: number
    y: number
}

export class PositionComponent extends Component<'position'>{
    type: "position" = "position";



    position: Vec2;
    constructor({ x, y }: PositionArgs) {
        super();
        this.position = new Vec2(x, y);
    }
}