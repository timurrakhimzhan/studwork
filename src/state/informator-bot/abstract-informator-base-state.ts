import {AbstractBaseState, InformatorStateContext} from "./internal";

export default abstract class AbstractInformatorBaseState extends AbstractBaseState {
    stateContext: InformatorStateContext;
    constructor(context: InformatorStateContext) {
        super(context);
        this.stateContext = context;
    }
}