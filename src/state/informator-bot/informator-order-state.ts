import {AbstractOrderState, InformatorStateContext} from "./internal";
import Order from "../../database/models/Order";

export default class InformatorOrderState extends AbstractOrderState {
    stateContext: InformatorStateContext;
    constructor(stateContext: InformatorStateContext, order: Order) {
        super(stateContext, order);
        this.stateContext = stateContext;
    }
}