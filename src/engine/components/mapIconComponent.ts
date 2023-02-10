import { Component } from "../ecs/component";

export class MapIconComponent extends Component<"map-icon"> {
    type: "map-icon" = "map-icon";
    private mapIcon: minimapicon;
    constructor(icon: minimapicon) {
        super();
        this.mapIcon = icon;
    }

    dispose() {
        DestroyMinimapIcon(this.mapIcon);
    }
}
