import { Players } from "../../node_modules/w3ts/globals/index";
import { Effect, MapPlayer, Unit } from "../../node_modules/w3ts/index";
import { CollisionComponent } from "../engine/components/collisionComponent";
import { EffectComponent } from "../engine/components/effectComponent";
import { MapIconComponent } from "../engine/components/mapIconComponent";
import { PositionComponent } from "../engine/components/positionComponent";
import { UnitComponent } from "../engine/components/unitComponent";
import { Component } from "../engine/ecs/component";
import { Entity } from "../engine/ecs/entity";
import { Models } from "./models";

const TerrainModels = {
    Ship: [
        "Doodads\\LordaeronSummer\\Structures\\GoblinShipyardRuined\\GoblinShipyardRuined.mdl",
        "Doodads\\Cinematic\\NightElfTransportShipRuined\\NightElfTransportShipRuined.mdl",
        "Doodads\\Northrend\\Water\\BattleshipDestroyed\\BattleshipDestroyed.mdl",
    ],
    Rock: [
        "Doodads\\Dungeon\\Rocks\\DungeonRock\\DungeonRock0.mdx",
        "Doodads\\Dungeon\\Rocks\\DungeonRock\\DungeonRock1.mdx",
        "Doodads\\Dungeon\\Rocks\\DungeonRock\\DungeonRock2.mdx",
        "Doodads\\Dungeon\\Rocks\\DungeonRock\\DungeonRock3.mdx",
        "Doodads\\Dungeon\\Rocks\\DungeonRock\\DungeonRock4.mdx",
        "Doodads\\Dungeon\\Rocks\\DungeonRock\\DungeonRock5.mdx",
        "Doodads\\Dungeon\\Rocks\\DungeonRock\\DungeonRock6.mdx",
        "Doodads\\Dungeon\\Rocks\\DungeonRock\\DungeonRock7.mdx",
        "Doodads\\Dungeon\\Rocks\\DungeonRock\\DungeonRock8.mdx",
        "Doodads\\Dungeon\\Rocks\\DungeonRock\\DungeonRock9.mdx",
        "Doodads\\Felwood\\Rocks\\FelwoodRock\\FelwoodRock0.mdx",
        "Doodads\\Felwood\\Rocks\\FelwoodRock\\FelwoodRock1.mdx",
        "Doodads\\Felwood\\Rocks\\FelwoodRock\\FelwoodRock2.mdx",
        "Doodads\\Felwood\\Rocks\\FelwoodRock\\FelwoodRock3.mdx",
        "Doodads\\Felwood\\Rocks\\FelwoodRock\\FelwoodRock4.mdx",
        "Doodads\\Felwood\\Rocks\\FelwoodRock\\FelwoodRock5.mdx",
        "Doodads\\Felwood\\Rocks\\FelwoodRock\\FelwoodRock6.mdx",
        "Doodads\\Felwood\\Rocks\\FelwoodRock\\FelwoodRock7.mdx",
        "Doodads\\Felwood\\Rocks\\FelwoodRock\\FelwoodRock8.mdx",
        "Doodads\\Felwood\\Rocks\\FelwoodRock\\FelwoodRock9.mdx",
    ],
    Coral: [
        "Doodads\\Ruins\\Water\\Coral\\Coral0.mdx",
        "Doodads\\Ruins\\Water\\Coral\\Coral1.mdx",
        "Doodads\\Ruins\\Water\\Coral\\Coral2.mdx",
        "Doodads\\Ruins\\Water\\Coral\\Coral3.mdx",
        "Doodads\\Ruins\\Water\\Coral\\Coral4.mdx",
        "Doodads\\Ruins\\Water\\Coral\\Coral5.mdx",
        "Doodads\\Ruins\\Water\\Coral\\Coral6.mdx",
        "Doodads\\Ruins\\Water\\Coral\\Coral7.mdx",
        "Doodads\\Ruins\\Water\\Coral\\Coral8.mdx",
        "Doodads\\Ruins\\Water\\Coral\\Coral9.mdx",
    ],
};

type TerrainArgs = {
    x: number;
    y: number;
    height: number;
};

export class Terrain extends Entity {
    constructor({ x, y, height }: TerrainArgs, components: Component[] = []) {
        super(components);

        this.addComponent(new PositionComponent({ x, y }));
        const collision = new CollisionComponent(
            Math.max(0.1, height) * 600,
            99
        );
        this.addComponent(collision);

        const fx = new Effect(this.getTerrainModel(height), x, y);

        fx.scale = Math.max(0.5, 4 * height);
        this.addComponent(new EffectComponent({ fx }));

        //Dummy unit to paint on minimap
        // const unit = new Unit(Players[8], FourCC("h001"), x, y, 0, 0);
        const icon = CreateMinimapIcon(
            x,
            y,
            255,
            255,
            0,
            "UI\\Minimap\\Minimap-Waypoint.mdl",
            FOG_OF_WAR_VISIBLE
        );
        this.addComponent(new MapIconComponent(icon));

        collision.events.on("collision", (other) => {
            other.destroy();
        });
    }

    private getTerrainModel(height: number) {
        if (height >= 0.3) {
            return this.getRandomModel("Rock");
        } else if (height >= 0.05) {
            return this.getRandomModel("Coral");
        } else {
            return this.getRandomModel("Ship");
        }
    }

    private getRandomModel(modelType: keyof typeof TerrainModels) {
        const num = math.random(
            math.floor(TerrainModels[modelType].length - 0.5)
        );
        return TerrainModels[modelType][num];
    }
}
