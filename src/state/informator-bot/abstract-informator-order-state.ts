import {AbstractOrderState, InformatorStateContext} from "./internal";
import Order from "../../database/models/Order";

export default abstract class AbstractInformatorOrderState extends AbstractOrderState {
    stateContext: InformatorStateContext;
    constructor(stateContext: InformatorStateContext, order: Order) {
        super(stateContext, order);
        this.stateContext = stateContext;
    }
}