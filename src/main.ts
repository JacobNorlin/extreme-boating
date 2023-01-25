import { ProjectileSystem } from "projectile/projectileSystem";
import { Point, Timer, Trigger, Unit } from "w3ts";
import { Players } from "w3ts/globals";
import { addScriptHook, W3TS_HOOK } from "w3ts/hooks";

const BUILD_DATE = compiletime(() => new Date().toUTCString());
const TS_VERSION = compiletime(() => require("typescript").version);
const TSTL_VERSION = compiletime(() => require("typescript-to-lua").version);

function tsMain() {
    print(`Build: ${BUILD_DATE}`);
    print(`Typescript: v${TS_VERSION}`);
    print(`Transpiler: v${TSTL_VERSION}`);
    print(" ");
    print("Welcome to TypeScript!");

    const unit = new Unit(Players[0], FourCC("hfoo"), 0, 0, 270);
    unit.name = "TypeScript";

    new Timer().start(1.0, true, () => {
        unit.color = Players[math.random(0, bj_MAX_PLAYERS)].color;
    });

    const t = new Trigger();

    const ps = new ProjectileSystem();

    const projDef = {
        angleVelocity: 1,
        speed: 500,
        range: 1000,
        modelName: "Abilities\\Weapons\\SorceressMissile\\SorceressMissile.mdl",
    }
    t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SPELL_CAST);
    t.addAction(() => {
        print("cast");
        const caster = Unit.fromEvent();
        const targetLoc = Point.fromHandle(GetSpellTargetLoc());
        ps.spawn(projDef, caster, targetLoc.x, targetLoc.y);
    })
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, tsMain);
