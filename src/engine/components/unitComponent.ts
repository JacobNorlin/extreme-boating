import { Unit } from "w3ts";
import { Component } from "../ecs/component";

export class UnitComponent implements Component<"unit"> {
    type: "unit" = "unit";

    unit: Unit;

    constructor(unit: Unit) {
        this.unit = unit;
    }
}
