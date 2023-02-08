import { Projectile } from "./projectile";

export type Modifier = EventModifier | StaticModifier;

export interface EventModifier {
    type: "event";
    modifiers: Modifier[];
    bindEvents(p: Projectile): void;
}

export interface StaticModifier {
    type: "static";
    run(p: Projectile): void;
}
