import { Frame } from "w3ts";

type ComponentBaseProps = {
    children: Component[]
}

export abstract class Component<Props = {}, State = {}> {

    state: State;
    private props: Props & ComponentBaseProps;

    constructor(props: Props) {
        this.state = {} as State;
        this.props = {
            ...props,
            children: []
        }
    }


    setState(state: Partial<State>) {
        this.state = {
            ...this.state,
            ...state,
        };
    }

    abstract render(): any 

}
