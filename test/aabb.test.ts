
import { AABB } from '../src/projectile/AABB';


describe('AABB', () => {
    it('contains', () => {
        const box = new AABB(0, 0, 10, 10);
        expect(box.contains({ x: 5, y: 5 })).toEqual(true);
        expect(box.contains({ x: 11, y: 5 })).toEqual(false);
    })

    it('intersects', () => { 
        const box = new AABB(0, 0, 10, 10);
        
        expect(box.intersects(new AABB(5, 5, 10, 10))).toEqual(true);
        expect(box.intersects(new AABB(11, 11, 10, 10))).toEqual(false);
    })
    
})