import { CameraComponent } from "engine/components/cameraComponent";
import { MotionComponent } from "engine/components/motionComponent";
import { UnitComponent } from "engine/components/unitComponent";
import { Entity } from "../ecs/entity";
import { System } from "../ecs/system";

export class CameraSystem extends System<[CameraComponent, MotionComponent]> {
    types: ["camera", "motion"] = ["camera", "motion"];

    update(entities: Set<Entity>, delta: number): void {
        for (const entity of entities) {
            const cameraComp = entity.getComponent<CameraComponent>("camera");
            const motionComp = entity.getComponent<MotionComponent>("motion");

            //Sync camera position to the unit.
            //This will break if you have multiple units for the same camera
            PanCameraToTimedForPlayer(
                cameraComp.player.handle,
                motionComp.position.x,
                motionComp.position.y,
                0
            );
        }
    }
}
