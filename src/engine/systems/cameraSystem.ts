import { CameraComponent } from "../components/cameraComponent";
import { MotionComponent } from "../components/motionComponent";
import { PositionComponent } from "../components/positionComponent";
import { Entity } from "../ecs/entity";
import { System } from "../ecs/system";

export class CameraSystem extends System<[CameraComponent, MotionComponent]> {
    types: ["camera", "motion"] = ["camera", "motion"];

    update(entities: Set<Entity>, delta: number): void {
        for (const entity of entities) {
            const cameraComp = entity.getComponent<CameraComponent>("camera");
            const posComp = entity.getComponent<PositionComponent>("position");

            //Sync camera position to the unit.
            //This will break if you have multiple units for the same camera
            PanCameraToTimedForPlayer(
                cameraComp.player.handle,
                posComp.position.x,
                posComp.position.y,
                0
            );
        }
    }
}
