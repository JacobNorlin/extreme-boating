import { AABB } from "./AABB";

export class DebugRenderer {
    static renderBoxAsLightning(bounds: AABB) {
        const h = 0;
        const fx = "LEAS";
        return [
            //top
            AddLightningEx(
                fx,
                false,
                bounds.x,
                bounds.y,
                h,
                bounds.right,
                bounds.y,
                h
            ),
            //right
            AddLightningEx(
                fx,
                false,
                bounds.right,
                bounds.y,
                h,
                bounds.right,
                bounds.bottom,
                h
            ),
            //bottom
            AddLightningEx(
                fx,
                false,
                bounds.right,
                bounds.bottom,
                h,
                bounds.x,
                bounds.bottom,
                h
            ),
            //left
            AddLightningEx(
                fx,
                false,
                bounds.x,
                bounds.bottom,
                h,
                bounds.x,
                bounds.y,
                h
            ),
        ];
    }

    static destroyDebugRender(fxs: lightning[]) {
        fxs.forEach(f => DestroyLightning(f));
    }
}
