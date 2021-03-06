import {AbstractOrderState, ReceiverStateContext} from "./internal";
import Order from "../../database/models/Order";

export default abstract class AbstractReceiverOrderState extends AbstractOrderState {
    stateContext: ReceiverStateContext;
    private invoiceMessageIdToDelete: number | null;
    constructor(stateContext: ReceiverStateContext, order: Order) {
        super(stateContext, order);
        this.stateContext = stateContext;
        this.invoiceMessageIdToDelete = null;
    }
}