import { CollisionComponent } from "../components/collisionComponent";
import { MotionComponent } from "../components/motionComponent";
import { Entity } from "../ecs/entity";
import { System } from "../ecs/system";
import { AABB } from "../util/AABB";
import { QuadTree } from "../util/quadTree";

export class CollisionSystem extends System<
    [MotionComponent, CollisionComponent]
> {
    types: ["motion", "collision"] = ["motion", "collision"];

    private quadTree: QuadTree<MotionComponent>;

    constructor(worldSize: AABB) {
        super();

        this.quadTree = new QuadTree(worldSize);
    }

    update(entities: Set<Entity>, delta: number): void {
        this.quadTree.empty();

        //Update the quad tree
        for (const entity of entities) {
            const motionComp = entity.getComponent<MotionComponent>("motion");
            this.quadTree.insert(motionComp);
        }

        //Run through all entities to figure out what is colliding
        for (const entity of entities) {
            const collisionComp =
                entity.getComponent<CollisionComponent>("collision");

            //We can ignore items that don't care about collision events
            if (!collisionComp.events.isActive()) {
                continue;
            }

            const motionComp = entity.getComponent<MotionComponent>("motion");
            const boundary = collisionComp.getBoundary(motionComp.position);

            const colliding = this.quadTree.queryRange(boundary);

            for (const collider of colliding) {
                const owner = collider.owner;
                if (!owner) {
                    continue;
                }
                const collidingWithSelf = collider === motionComp;
                const ownerCollisionComp =
                    owner.getComponent<CollisionComponent>("collision");
                const sameCollisionGroup =
                    ownerCollisionComp.group === collisionComp.group;

                if (!collidingWithSelf && !sameCollisionGroup) {
                    collisionComp.events.emit("collision", owner);
                }
            }
        }
    }
}
