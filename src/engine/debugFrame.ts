import { Frame } from "w3ts";

export class DebugFrame{
    frame: Frame;
    constructor() {
        this.frame = new Frame("debug", Frame.fromOrigin(ORIGIN_FRAME_GAME_UI, 0), 0, 0, "BACKDROP", "");
        this.frame.setSize(0.2, 0.2);
        this.frame.setAbsPoint(FRAMEPOINT_CENTER, 0.1, 0.4);
        // this.frame.setTexture("replaceabletextures\\teamcolor\\teamcolor00", 0, false);
        this.frame.setVertexColor(BlzConvertColor(78, 255, 255, 255));
        this.frame.setTextColor(BlzConvertColor(255, 0, 0, 0));
        this.frame.setAlpha(128);
        

        this.frame.setText("Test hello\nworld lol");
    }
}