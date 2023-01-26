import { AABB } from "../src/projectile/AABB";
import { QuadTree } from "../src/projectile/quadTree";

describe("QuadTree", () => {
    it("query range", () => {
        const tree = new QuadTree(new AABB(0, 0, 10, 10));

        tree.insert({
            pos: {
                x: 5,
                y: 5,
            },
        });

        expect(tree.queryRange(new AABB(3, 3, 6, 6))).toEqual([
            { pos: { x: 5, y: 5 } },
        ]);
    });
});
