import { Wc3PositionComponent } from "../components/wc3PositionComponent";
import { MotionComponent } from "../components/motionComponent";
import { UnitComponent } from "../components/unitComponent";
import { Entity } from "../ecs/entity";
import { System } from "../ecs/system";
import { WORLD } from "../../game/world";

export class MovementSystem extends System<[MotionComponent, Wc3PositionComponent]> {
    types: ["motion", "wc3-position"] = ["motion", "wc3-position"];

    update(entities: Set<Entity>, delta: number): void {
        for (const entity of entities) {
            const motionComp = entity.getComponent<MotionComponent>("motion");
            const wc3PositionComp = entity.getComponent<Wc3PositionComponent>("wc3-position");

            //Sync unit position to motion component
            motionComp.position.x = wc3PositionComp.x;
            motionComp.position.y = wc3PositionComp.y;

            //Update the position from velocity
            const deltaVel = motionComp.velocity.getMultiplied(delta);
            motionComp.position.add(deltaVel);
            motionComp.distance += deltaVel.length();

            //Update velocity
            if (motionComp.friction > 0) {
                motionComp.velocity.multiply(1 - motionComp.friction);
            }

            if (motionComp.angularVelocity > 0) {
                motionComp.velocity.rotate(motionComp.angularVelocity);
            }

            if (wc3PositionComp.syncAngle) {
                wc3PositionComp.facing = motionComp.velocity.angle();
            }

            //To handle gliding and using the turn rate of the unit
            if (wc3PositionComp.syncWc3AngleToVelocity) {
                const currSpeed = motionComp.velocity.length();
                const wc3Angle = wc3PositionComp.facing;
                motionComp.velocity.x = currSpeed * math.cos(wc3Angle);
                motionComp.velocity.y = currSpeed * math.sin(wc3Angle);
            }

            //Clamp the position to world bounds to prevent wc3 from crashing
            if (motionComp.position.x > WORLD.maxX) {
                motionComp.position.x = WORLD.minX;
            }
            if (motionComp.position.x < WORLD.minX) {
                motionComp.position.x = WORLD.maxX;
            }
            if (motionComp.position.y > WORLD.maxY) {
                motionComp.position.y = WORLD.minY;
            }
            if (motionComp.position.y < WORLD.minY) {
                motionComp.position.y = WORLD.maxY;
            }
            motionComp.position.clampMin(WORLD.minX, WORLD.minY);
            motionComp.position.clampMax(WORLD.maxX, WORLD.maxY);

            //Realize position to wc3
            wc3PositionComp.x = motionComp.position.x;
            wc3PositionComp.y = motionComp.position.y;

            motionComp.events.emit('move');

        }

    }
}
