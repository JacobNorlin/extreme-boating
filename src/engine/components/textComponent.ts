import { TextTag } from "../../../node_modules/w3ts/index";
import { Component } from "../ecs/component";

export class TextComponent extends Component<"text"> {
    type: "text" = "text";

    lines: Record<string, string> = {};
    tags: TextTag[] = [];

    constructor() {
        super();
    }

    setLine(title: string, value: string) {
        this.lines[title] = value;

        this.dispose();

        const keys = Object.keys(this.lines);
        for (const key of keys) {
            const value = this.lines[key];
            const tag = new TextTag();
            tag.setPermanent(true);
            print(`Update tag with ${key}: ${value}`);
            tag.setText(`${key}: ${value}`, 12, true);
            tag.setColor(255, 0, 0, 255);
            tag.setVisible(true);
            tag.setVelocity(0, 0);
            tag.setFadepoint(2.0);
            this.tags.push(tag);
        }
    }

    updatePosition(x: number, y: number) {
        let currY = 0;
        for (const tag of this.tags) {
            tag.setPos(x, y, currY);
            currY += 15;
        }
    }

    dispose(): void {
        this.tags.forEach((t) => t.destroy());
        this.tags = [];
    }
}
