export const Models = {
    Fireball: "Abilities\\Weapons\\RedDragonBreath\\RedDragonMissile.mdl",
    QuestionMark: "Objects\\RandomObject\\RandomObject",
    Frostball: "Abilities\\Weapons\\FrostWyrmMissile\\FrostWyrmMissile.mdl",
    Cannonball: "Abilities\\Weapons\\BoatMissile\\BoatMissile.mdl",
    FrostNova: "Abilities\\Spells\\Undead\\FrostNova\\FrostNovaTarget.mdl",
    CannonFireExplosion: "Abilities\\Spells\\Other\\Incinerate\\FireLordDeathExplode.mdl",
    Fire: "Abilities\\Spells\\Other\\BreathOfFire\\BreathOfFireDamage.mdl"

};

export type ModelName = keyof typeof Models;
