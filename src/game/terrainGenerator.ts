import { ECS } from "../engine/ecs/ecs";
import { Logger } from "../engine/util/logger";
import { PerlinNoise } from "../engine/util/perlin";
import { Terrain } from "./terrain";
import { WORLD } from "./world";

const logger = Logger.getInstance("TerrainGenerator");

export class TerrainGenerator {
    private currentTerrain: Terrain[] = [];

    generateTerrain(size: number, maxBlocks: number) {
        this.currentTerrain.forEach((t) => {
            t.destroy();
        });
        const noiseMap = this.generateNoiseMap(size, size, 2);

        //Every point in the noise map has some value. To constrain the number
        //of terrain elements we add we want to find the pivot of where only
        //N elements have a higher value.
        const allNoiseValues = noiseMap.reduce((acc, row) => {
            return acc.concat(row);
        }, []);
        allNoiseValues.sort();
        //Take right offset by max amount of blocks to find pivot value
        const pivot = allNoiseValues[allNoiseValues.length - maxBlocks - 1];
        print(`Pivot ${pivot}`);
        const maxValue = allNoiseValues[allNoiseValues.length - 1];

        const worldBounds = WORLD.getAABB();
        const widthScale = worldBounds.w / size;
        const heightScale = worldBounds.h / size;

        let numTerrains = 0;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const val = noiseMap[y][x];

                if (val >= pivot) {
                    //Translate to world coordinate system
                    const worldX =
                        math.floor(x * widthScale) - worldBounds.w / 2;
                    const worldY =
                        math.floor(y * heightScale) - worldBounds.h / 2;

                    //Normalize height value around the pivot
                    const normVal = (val - pivot) / (maxValue - pivot);
                    logger.log("" + normVal);
                    numTerrains++;
                    const terrain = new Terrain({
                        x: worldX,
                        y: worldY,
                        height: normVal,
                    });
                    this.currentTerrain.push(terrain);
                    ECS.getInstance().addEntity(terrain);
                }
            }
        }

        print(`Added ${numTerrains} terrain blocks`);
    }

    private generateNoiseMap(width: number, height: number, octaves: number) {
        //width* height size
        const data: number[][] = [];

        let min = Infinity;
        let max = -Infinity;

        const perlin = new PerlinNoise();

        let frequency = 7;
        let amplitude = 5;

        for (let octave = 0; octave < octaves; octave++) {
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    if (!data[i]) {
                        data[i] = [];
                        for (let k = 0; k < width; k++) {
                            data[i][k] = 0;
                        }
                    }
                    const noise = perlin.noise(
                        (i * frequency) / width,
                        (j * frequency) / height
                    );

                    data[i][j] += noise;
                    min = Math.min(min, data[i][j]);
                    max = Math.max(max, data[i][j]);
                }
            }
            frequency = frequency * 2;
            amplitude = amplitude / 2;
        }

        //Normalize the output
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                data[i][j] = (data[i][j] - min) / (max - min);
            }
        }

        return data;
    }
}
