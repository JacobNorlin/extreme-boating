import { Frame, Trigger } from "w3ts";
import { Element, ElementLayout, LayoutOptions } from "./element";

type ButtonArgs = {
    text: string;
};

export class Button implements Element {
    frame: Frame = null as any;
    textFrame: Frame = null as any;
    parent: Element | null = null;

    triggers: Trigger[] = [];
    text: string;

    layoutOpts: LayoutOptions;

    private onClickCallback: ((this: any, ...args: any[]) => any) | null = null;
    private onClickTrigger = new Trigger();

    constructor(args: ButtonArgs, opts: LayoutOptions) {
        this.text = args.text;
        this.layoutOpts = opts;
    }

    dispose(): void {
        this.frame.destroy();
        this.textFrame.destroy();
    }

    onClick(cb: (this: any, ...args: any[]) => any) {
        this.onClickCallback = cb;
        return this;
    }

    render(parentFrame: Frame, layout: ElementLayout) {
        print(
            `x: ${layout.x}, y: ${layout.y}, w: ${layout.width}, h: ${layout.height}`
        );
        this.frame = new Frame("ScriptDialogButton", parentFrame, 0, 0);

        this.frame
            .setPoint(
                FRAMEPOINT_TOPLEFT,
                parentFrame,
                FRAMEPOINT_TOPLEFT,
                layout.x,
                layout.y
            )
            .setSize(layout.width, layout.height)
            .setText(`|cffFCD20D${this.text}|r`);

        this.onClickTrigger.triggerRegisterFrameEvent(
            this.frame,
            FRAMEEVENT_CONTROL_CLICK
        );
        this.onClickTrigger.addAction(() => {
            if (this.onClickCallback) {
                this.onClickCallback(this.text);
            }
        });

        // this.textFrame = new Frame(
        //     "test123-text",
        //     this.frame,
        //     0,
        //     0,
        //     "TEXT",
        //     ""
        // );
        // this.textFrame
        //     .setPoint(FRAMEPOINT_TOPLEFT, this.frame, FRAMEPOINT_TOPLEFT, 0, 0)
        //     .setPoint(
        //         FRAMEPOINT_BOTTOMRIGHT,
        //         this.frame,
        //         FRAMEPOINT_BOTTOMRIGHT,
        //         layout.x + layout.width,
        //         layout.y + layout.height
        //     );
        // this.textFrame.setText(this.text);
        // BlzFrameSetTextAlignment(
        //     this.textFrame.handle,
        //     TEXT_JUSTIFY_CENTER,
        //     TEXT_JUSTIFY_CENTER
        // );
    }
}
