import { Frame } from "w3ts";
import { Element, ElementLayout } from "./element";

type LayoutDirection = "vertical" | "horizontal";

type PanelLayout = {
    direction: LayoutDirection;
};

export class Panel implements Element {
    static ID = 0;
    static getId() {
        return "" + this.ID++;
    }
    //Frames are only passed in render so I don't want to deal with null checks
    //This is probably a terrible idea in case I ever reference from outside
    frame: Frame = null as any;
    id: string;
    children: Element[] = [];
    parent: Element | null = null;
    dir: LayoutDirection = "vertical";
    layoutOpts = null as any;

    constructor(dir: LayoutDirection) {
        this.id = Panel.getId();
        this.dir = dir;
    }

    addChild(elm: Element) {
        elm.parent = elm;
        this.children.push(elm);
        return this;
    }

    clear() {
        this.children.forEach((c) => c.dispose());
        this.children = [];
    }

    dispose(): void {
        if (this.frame) {
            this.frame.destroy();
        }
    }

    render(parentFrame: Frame, layout: ElementLayout): void {
        print(
            `x: ${layout.x}, y: ${layout.y}, w: ${layout.width}, h: ${layout.height}`
        );
        this.frame = new Frame(
            "CheckListBox",
            parentFrame,
            0,
            0,
        );

        this.frame
            //Set top left corner of the frame
            .setPoint(
                FRAMEPOINT_TOPLEFT,
                parentFrame,
                FRAMEPOINT_TOPLEFT,
                layout.x,
                layout.y
            )
            .setSize(layout.width, layout.height);
        // this.frame.setVertexColor(BlzConvertColor(78, 255, 255, 255));
        // this.frame.setTextColor(BlzConvertColor(255, 0, 0, 0));
        // this.frame.setAlpha(128);
        // this.frame.setVisible(true);

        const mainPos = this.dir === "vertical" ? "y" : "x";
        const crossPos = this.dir === "vertical" ? "x" : "y";
        const mainSize = this.dir === "vertical" ? "height" : "width";
        const crossSize = this.dir === "vertical" ? "width" : "height";
        let currMainPos = layout[mainPos];
        let currCrossPos = layout[crossPos];
        for (const child of this.children) {
            const childMainPos = currMainPos;
            const childCrossPos = currCrossPos;

            const childLayout = {
                [mainPos]: childMainPos,
                [crossPos]: childCrossPos,
                width: child.layoutOpts.width,
                height: child.layoutOpts.height,
            };

            if (
                childLayout[mainPos] + childLayout[mainSize] >
                layout[mainPos] + layout[mainSize]
            ) {
                currMainPos = 0;
                //This assumes all children are the same size when overflowing :^)
                currCrossPos += childLayout[crossPos];

                childLayout[mainPos] = currMainPos;
                childLayout[crossPos] = currCrossPos;
            }

            //ts can't infer union types as keys in objects, not based
            child.render(this.frame, childLayout as any as ElementLayout);

            //Move position pointer
            currMainPos += childLayout[mainSize];
        }
    }
}

// export class REFORGEDUIMAKER {
//     BackdropSemiTrans01: Frame;
//     Text02: Frame;
//     Ability: Frame;

//     constructor() {
//         let t: Trigger;

//         this.BackdropSemiTrans01 = new Frame(
//             "CheckListBox",
//             Frame.fromOrigin(ORIGIN_FRAME_GAME_UI, 0),
//             0,
//             0
//         )
//             .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.01809, 0.55316)
//             .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.30843, 0.18736);

//         this.Text02 = new Frame(
//             "name",
//             this.BackdropSemiTrans01,
//             0,
//             0,
//             "TEXT",
//             ""
//         )
//             .setPoint(
//                 FRAMEPOINT_TOPLEFT,
//                 this.BackdropSemiTrans01,
//                 FRAMEPOINT_TOPLEFT,
//                 0.0134,
//                 -0.01896
//             )
//             .setPoint(
//                 FRAMEPOINT_BOTTOMRIGHT,
//                 this.BackdropSemiTrans01,
//                 FRAMEPOINT_BOTTOMRIGHT,
//                 -0.01563,
//                 0.32342
//             )
//             .setText("|cffFFCC00Abilities|r")
//             .setEnabled(false)
//             .setScale(1.0);
//         BlzFrameSetTextAlignment(
//             this.Text02.handle,
//             TEXT_JUSTIFY_TOP,
//             TEXT_JUSTIFY_LEFT
//         );

//         this.Ability = new Frame(
//             "ScriptDialogButton",
//             this.BackdropSemiTrans01,
//             0,
//             0
//         )
//             .setPoint(
//                 FRAMEPOINT_TOPLEFT,
//                 this.BackdropSemiTrans01,
//                 FRAMEPOINT_TOPLEFT,
//                 0.01563,
//                 -0.05465
//             )
//             .setPoint(
//                 FRAMEPOINT_BOTTOMRIGHT,
//                 this.BackdropSemiTrans01,
//                 FRAMEPOINT_BOTTOMRIGHT,
//                 -0.20771,
//                 0.24758
//             )
//             .setText("|cffFCD20DFireball|r")
//             .setScale(1.0);
//         t = new Trigger();
//         t.triggerRegisterFrameEvent(this.Ability, FRAMEEVENT_CONTROL_CLICK);
//         t.addAction(() => {
//             this.Ability.enabled = false;
//             this.Ability.enabled = true;
//         });
//     }
// }
