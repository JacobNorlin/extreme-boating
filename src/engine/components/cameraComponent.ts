import { Component } from "../ecs/component";
import { MapPlayer } from "w3ts";

export class CameraComponent extends Component<'camera'>{
    type: "camera" = "camera";

    player: MapPlayer;

    constructor(player: MapPlayer) {
        super();
        this.player = player;
    }
}