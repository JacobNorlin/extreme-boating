import { MotionComponent } from "../components/motionComponent";
import { Entity } from "../ecs/entity";
import { System } from "../ecs/system";
import { WORLD } from "../../game/world";
import { PositionComponent } from "../components/positionComponent";
import { EffectComponent } from "../components/effectComponent";
import { UnitComponent } from "../components/unitComponent";

export class MovementSystem extends System<
    [MotionComponent, PositionComponent]
> {
    types: ["motion", "position"] = ["motion", "position"];

    update(entities: Set<Entity>, delta: number): void {
        for (const entity of entities) {
            const motionComp = entity.getComponent<MotionComponent>("motion");
            const posComp = entity.getComponent<PositionComponent>("position");

            //Update the position from velocity
            const deltaVel = motionComp.velocity.getMultiplied(delta);
            posComp.position.add(deltaVel);
            motionComp.distance += deltaVel.length();

            //Update velocity
            if (motionComp.friction > 0) {
                motionComp.velocity.multiply(1 - motionComp.friction);
            }

            if (motionComp.angularVelocity > 0) {
                motionComp.velocity.rotate(motionComp.angularVelocity);
            }

            //Clamp the position to world bounds to prevent wc3 from crashing
            if (posComp.position.x > WORLD.maxX) {
                posComp.position.x = WORLD.minX;
            }
            if (posComp.position.x < WORLD.minX) {
                posComp.position.x = WORLD.maxX;
            }
            if (posComp.position.y > WORLD.maxY) {
                posComp.position.y = WORLD.minY;
            }
            if (posComp.position.y < WORLD.minY) {
                posComp.position.y = WORLD.maxY;
            }
            posComp.position.clampMin(WORLD.minX, WORLD.minY);
            posComp.position.clampMax(WORLD.maxX, WORLD.maxY);

            //Realize the position into wc3. System's currently don't support
            //optional component types, so we just check here.
            if (entity.hasComponent<UnitComponent>("unit")) {
                const unitComp = entity.getComponent<UnitComponent>("unit");
                unitComp.updatePosition(
                    posComp.position.x,
                    posComp.position.y
                );

                //Allow using move commands to update velocity
                const currSpeed = motionComp.velocity.length();
                const wc3Angle = unitComp.getAngle()
                motionComp.velocity.x = currSpeed * math.cos(wc3Angle);
                motionComp.velocity.y = currSpeed * math.sin(wc3Angle);
            }
            if (entity.hasComponent<EffectComponent>("effect")) {
                const effectComp = entity.getComponent<EffectComponent>("effect");
                effectComp.updatePosition(
                    posComp.position.x,
                    posComp.position.y
                );

                //Effects can't move on user input so we can always sync the angle
                effectComp.setAngle(motionComp.velocity.angle());
            }

            motionComp.events.emit("move");
        }
    }
}
