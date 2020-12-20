import {AbstractBaseState, InformatorStateContext} from "./internal";

export default class InformatorBaseState extends AbstractBaseState {
    stateContext: InformatorStateContext;
    constructor(context: InformatorStateContext) {
        super(context);
        this.stateContext = context;
    }
}