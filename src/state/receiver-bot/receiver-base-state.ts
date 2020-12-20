import {ReceiverStateContext, AbstractBaseState} from "./internal";

export default class ReceiverBaseState extends AbstractBaseState {
    stateContext: ReceiverStateContext;
    constructor(context: ReceiverStateContext) {
        super(context);
        this.stateContext = context;
    }
}