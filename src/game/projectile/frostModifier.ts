import { Effect } from "../../../node_modules/w3ts/index";
import { PositionComponent } from "../../engine/components/positionComponent";
import { Entity } from "../../engine/ecs/entity";
import { Models } from "../models";
import { EventModifier, ProjectileModifier } from "./modifier";
import { Projectile } from "./projectile";

export class FrostModifier extends EventModifier {
    //Modifiers can be shared across many projectile so they have
    //to manage any internal state with regard to that
    private fxPerProj: Map<number, Effect> = new Map();

    constructor(modifiers: ProjectileModifier[]) {
        super(modifiers);
    }

    bindEvents(proj: Projectile): void {
        proj.events.on("move", () => this.updateEffect(proj));
        proj.events.on('collide', (p, o) => this.onHit(p, o));
        proj.events.on('expire', (p) => this.onHit(p));
    }

    updateEffect(p: Projectile) {
        const posComp = p.getComponent<PositionComponent>("position");
        if (!this.fxPerProj.has(p.id)) {
            this.fxPerProj.set(p.id, new Effect(
                Models.Frostball,
                posComp.position.x,
                posComp.position.y
            ));
        }

        //Has check above prevents this from being undefined...
        const fx = this.fxPerProj.get(p.id) as Effect;
        fx.x = posComp.position.x;
        fx.y = posComp.position.y;
    }

    onHit(p: Projectile, target?: Entity) {
        const posComp = p.getComponent<PositionComponent>("position");

        const explodeFx = new Effect(
            Models.FrostNova,
            posComp.position.x,
            posComp.position.y
        );
        explodeFx.destroy();

        this.dispose(p.id);


    }

    dispose(projId: number) {
        if (this.fxPerProj.get(projId)) {
            this.fxPerProj.get(projId)?.destroy();
        }
    }
}
