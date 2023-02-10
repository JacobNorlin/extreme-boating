import { Vec2 } from "./vec2";

export class PerlinNoise {
    private perm: number[] = [];

    private gradients: Vec2[] = [];

    constructor() {
        this.calculatePermutations();
        this.calculateGradients();
    }

    private calculatePermutations() {
        this.perm = [];
        for (let i = 0; i < 256; i++) {
            this.perm[i] = i;
        }
        for (let i = 0; i < 256; i++) {
            const source = Math.floor(math.random() * 255);
            const t = this.perm[i];
            this.perm[i] = this.perm[source];
            this.perm[source] = t;
        }
    }

    public reseed() {
        this.calculatePermutations();
    }

    private calculateGradients() {
        this.gradients = [];
        for (let i = 0; i < 256; i++) {
            //Psuedo random vector
            const theta = math.random() * 2 * math.pi;
            const gradient = new Vec2(
                math.cos(theta),
                math.sin(theta)
            ).normalize();

            this.gradients[i] = gradient;
        }
    }

    private drop(t: number) {
        t = math.abs(t);
        //No idea what this is derived from
        return 1 - t * t * t * (t * (t * 6 - 15) + 10);
    }

    private q(u: number, v: number) {
        return this.drop(u) * this.drop(v);
    }

    public noise(x: number, y: number) {
        const cell = new Vec2(math.floor(x), math.floor(y));
        let total = 0;
        let corners = [
            new Vec2(0, 0),
            new Vec2(0, 1),
            new Vec2(1, 0),
            new Vec2(1, 1),
        ];

        for (const corner of corners) {
            const ij = cell.clone().add(corner);
            const uv = new Vec2(x - ij.x, y - ij.y);

            let index = this.perm[ij.x % this.perm.length];
            index = this.perm[(index + ij.y) % this.perm.length];

            const grad = this.gradients[index % this.gradients.length];

            total += this.q(uv.x, uv.y) * Vec2.dot(grad, uv);
        }

        return math.max(math.min(total, 1), -1);
    }
}
