import { Projectile } from "./projectile";

export type ProjectileModifier = EventModifier | StaticModifier;

export abstract class EventModifier{
    type = "event" as const;
    modifierType = "projectile" as const;
    modifiers: ProjectileModifier[] = [];

    constructor(modifiers: ProjectileModifier[]) {
        this.modifiers = modifiers;
    }

    abstract bindEvents(p: Projectile): void;
}

export abstract class StaticModifier {
    type = "static" as const;
    abstract run(p: Projectile): void;
    modifierType = "projectile" as const;
}
