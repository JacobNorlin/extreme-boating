import { Frame } from "w3ts";

export interface ElementLayout{
    x: number
    y: number
    width: number
    height: number
}

export interface LayoutOptions {
    width: number
    height: number
}

export interface Element {
    frame: Frame|null
    parent: Element | null;
    dispose(): void
    layoutOpts: LayoutOptions

    render(parentFrame: Frame, layout: ElementLayout): void
}


