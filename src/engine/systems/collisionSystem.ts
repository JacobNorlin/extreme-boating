import { CollisionComponent } from "../components/collisionComponent";
import { PositionComponent } from "../components/positionComponent";
import { Entity } from "../ecs/entity";
import { System } from "../ecs/system";
import { AABB } from "../util/AABB";
import { QuadTree } from "../util/quadTree";

export class CollisionSystem extends System<
    [PositionComponent, CollisionComponent]
> {
    types: ["position", "collision"] = ["position", "collision"];

    private quadTree: QuadTree<PositionComponent>;

    constructor(worldSize: AABB) {
        super();

        this.quadTree = new QuadTree(worldSize);
    }

    update(entities: Set<Entity>, delta: number): void {
        this.quadTree.empty();

        //Update the quad tree
        for (const entity of entities) {
            const posComp = entity.getComponent<PositionComponent>("position");
            this.quadTree.insert(posComp);
        }

        //Run through all entities to figure out what is colliding
        for (const entity of entities) {
            const collisionComp =
                entity.getComponent<CollisionComponent>("collision");

            //We can ignore items that don't care about collision events
            if (!collisionComp.events.isActive()) {
                continue;
            }

            const posComp = entity.getComponent<PositionComponent>("position");
            const boundary = collisionComp.getBoundary(
                posComp.position.x,
                posComp.position.y
            );

            const colliding = this.quadTree.queryRange(boundary);

            for (const collider of colliding) {
                const owner = collider.owner;
                if (!owner) {
                    continue;
                }
                const collidingWithSelf = collider === posComp;
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
