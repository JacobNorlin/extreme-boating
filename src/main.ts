import { Unit, Timer, Trigger, addScriptHook, W3TS_HOOK, TextTag } from "w3ts";
import { Players } from "w3ts/globals";
import { CameraComponent } from "./engine/components/cameraComponent";
import { CollisionComponent } from "./engine/components/collisionComponent";
import { MotionComponent } from "./engine/components/motionComponent";
import { PositionComponent } from "./engine/components/positionComponent";
import { UnitComponent } from "./engine/components/unitComponent";
import { ECS } from "./engine/ecs/ecs";
import { Entity } from "./engine/ecs/entity";
import { BuffSystem } from "./engine/systems/buffSystem";
import { CameraSystem } from "./engine/systems/cameraSystem";
import { CollisionSystem } from "./engine/systems/collisionSystem";
import { MovementSystem } from "./engine/systems/movementSystem";
import { wrapped } from "./engine/util/logger";
import { Boat } from "./game/boat";
import { Powerup } from "./game/powerup";
import { ChainModifier } from "./game/projectile/chainModifier";
import { FrostModifier } from "./game/projectile/frostModifier";
import { HomingModifier } from "./game/projectile/homingModifier";
import { ProjectileModifier } from "./game/projectile/modifier";
import { NovaModifier } from "./game/projectile/novaModifier";
import { SplitModifier } from "./game/projectile/splitModifier";
import { WORLD } from "./game/world";

const BUILD_DATE = compiletime(() => new Date().toUTCString());
const TS_VERSION = compiletime(() => require("typescript").version);
const TSTL_VERSION = compiletime(() => require("typescript-to-lua").version);

function tsMain() {
    print(`Build: ${BUILD_DATE}`);
    print(`Typescript: v${TS_VERSION}`);
    print(`Transpiler: v${TSTL_VERSION}`);
    print(" ");
    print("Welcome to TypeScript!");

    try {
        wrapped.init();
        WORLD.initialize();

        const tag = new TextTag();
        tag.setPos(0, 0, 0);
        tag.setText("Hello World", 12, true);
        tag.setColor(0, 255, 0, 255);
        tag.setVisible(true);
        tag.setPermanent(true);

        const ecs = ECS.getInstance();

        const boat = new Boat([], Players[0]);
        boat.getComponent<MotionComponent>('motion').velocity.multiply(2.5);
        const boat2 = new Boat([], Players[1]);

        ecs.addEntity(boat);
        ecs.addEntity(boat2);

        const collisionSystem = new CollisionSystem(WORLD.getAABB());
        const movementSystem = new MovementSystem();
        const cameraSystem = new CameraSystem();
        const buffSystem = new BuffSystem();

        ecs.addSystem(collisionSystem);
        ecs.addSystem(movementSystem);
        ecs.addSystem(cameraSystem);
        ecs.addSystem(buffSystem);

        const tick = new Timer();
        tick.start(0.03, true, () => {
            try {
                ecs.tick(0.03);
            } catch (e) {
                print(e);
            }
        });
        const pt = new Trigger();
        pt.registerPlayerChatEvent(Players[0], "", false);

        pt.addAction(() => {
            try {
                const msg = GetEventPlayerChatString();
    
                const split = msg.split(" ");
                print(`Setting modifiers to ${split.join(" -> ")}`);
                if (split.length === 0) {
                    return;
                }
                split.reverse();
    
                const first = split.shift() as string;
                const lastModifier = getModifier(first, []);
    
                const finalModifier = split.reduce((acc, m) => {
                    return getModifier(m, [acc]);
                }, lastModifier);
    
                boat.leftCannon.setProjectileModifiers(finalModifier);
            } catch (e) {
                print(e);
            }
        });

        const power = new Powerup([], 100, 100, [new NovaModifier([], {})]);
        ecs.addEntity(power);
    } catch (e) {
        print(e);
    }
}

function getModifier(m: string, modifiers: ProjectileModifier[]) {
    if (m === "nova") {
        return new NovaModifier(modifiers, {range: 250, speedModifier: 1.2, numProjs: 16});
    } else if (m === "split") {
        return new SplitModifier(modifiers);
    } else if (m === "chain") {
        return new ChainModifier(modifiers);
    } else if (m === "homing") {
        return new HomingModifier(modifiers);
    } else if (m === "frost") {
        return new FrostModifier(modifiers);
    }
    return new FrostModifier(modifiers);
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, tsMain);
