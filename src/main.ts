import { Unit, Timer, Trigger, addScriptHook, W3TS_HOOK, TextTag } from "w3ts";
import { Players } from "w3ts/globals";
import { CameraComponent } from "./engine/components/cameraComponent";
import { CollisionComponent } from "./engine/components/collisionComponent";
import { MotionComponent } from "./engine/components/motionComponent";
import { PositionComponent } from "./engine/components/positionComponent";
import { UnitComponent } from "./engine/components/unitComponent";
import { ECS } from "./engine/ecs/ecs";
import { Entity } from "./engine/ecs/entity";
import { CameraSystem } from "./engine/systems/cameraSystem";
import { CollisionSystem } from "./engine/systems/collisionSystem";
import { MovementSystem } from "./engine/systems/movementSystem";
import { wrapped } from "./engine/util/logger";
import { Boat } from "./game/boat";
import { ChainModifier } from "./game/projectile/chainModifier";
import { HomingModifier } from "./game/projectile/homingModifier";
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

        ecs.addEntity(boat);

        const collisionSystem = new CollisionSystem(WORLD.getAABB());
        const movementSystem = new MovementSystem();
        const cameraSystem = new CameraSystem();

        ecs.addSystem(collisionSystem);
        ecs.addSystem(movementSystem);
        ecs.addSystem(cameraSystem);

        const tick = new Timer();
        tick.start(0.03, true, () => {
            try {
                ecs.runSystems(0.03);
            } catch (e) {
                print(e);
            }
        });
        const pt = new Trigger();
        pt.registerPlayerChatEvent(Players[0], "", false);

        pt.addAction(() => {
            const msg = GetEventPlayerChatString();

            const split = msg.split(" ");
            print(`Setting modifiers to ${split.join(" -> ")}`);
            if (split.length === 0) {
                return;
            }
            split.reverse();

            const first = split.shift() as string;
            const ctor = getModifierCtor(first);

            const lastModifier = new ctor([]);

            const finalModifier = split.reduce((acc, m) => {
                const ctor = getModifierCtor(m);
                return new ctor([acc]);
            }, lastModifier);

            boat.leftCannon.setProjectileModifiers(finalModifier);
        });
    } catch (e) {
        print(e);
    }
}

function getModifierCtor(m: string) {
    if (m === "nova") {
        return NovaModifier;
    } else if (m === "split") {
        return SplitModifier;
    } else if (m === "chain") {
        return ChainModifier;
    } else if (m === "homing") {
        return HomingModifier;
    }
    return null as any;
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, tsMain);
