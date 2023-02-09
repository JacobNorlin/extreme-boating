import { MapPlayer, Unit } from "../../node_modules/w3ts/index";
import { CameraComponent } from "../engine/components/cameraComponent";
import { CollisionComponent } from "../engine/components/collisionComponent";
import { MotionComponent } from "../engine/components/motionComponent";
import { PositionComponent } from "../engine/components/positionComponent";
import { TextComponent } from "../engine/components/textComponent";
import { UnitComponent } from "../engine/components/unitComponent";
import { Component } from "../engine/ecs/component";
import { Entity } from "../engine/ecs/entity";
import { AbilityIds } from "./ability/abilityIds";
import { CannonAbility, CannonAmmoProvider } from "./ability/cannonAbility";

export class Boat extends Entity {

    leftCannon: CannonAbility;
    private centerCannon: CannonAbility;
    private rightCannon: CannonAbility
    private ammoProvider: CannonAmmoProvider;

    constructor(components: Component[], player: MapPlayer) {
        super(components);

        const unit = new Unit(player, FourCC("h000"), 0, 0, 0, 0);

        this.addComponent(new UnitComponent(unit));
        this.addComponent(new MotionComponent({
            angularVelocity: 0,
            velX: 100,
            velY: 100,
            inertia: 0,
            friction: 0
        }));
        this.addComponent(new PositionComponent({
            x: unit.x,
            y: unit.y
        }));
        this.addComponent(new CollisionComponent(120, player.id));
        this.addComponent(new CameraComponent(player));
        this.addComponent(new TextComponent());

        this.ammoProvider = new CannonAmmoProvider(this);

        this.leftCannon = new CannonAbility({
            abilityId: AbilityIds.LeftCannon,
            owner: this,
            angle: math.pi / 2,
            name: "Left",
            ammoProvider: this.ammoProvider
        });

        this.centerCannon = new CannonAbility({
            abilityId: AbilityIds.CenterCannon,
            owner: this,
            angle: 0,
            name: "Center",
            ammoProvider: this.ammoProvider
        });

        this.rightCannon = new CannonAbility({
            abilityId: AbilityIds.RightCannon,
            owner: this,
            angle: -math.pi / 2,
            name: "Right",
            ammoProvider: this.ammoProvider
        });
    }

    dispose(): void {
        this.ammoProvider.dispose();
        super.dispose();
    }



}