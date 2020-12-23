import {AbstractOrderRejectState, OrdersState} from "./internal";
import Order from "../../database/models/Order";
import ReceiverStateContext from "./receiver-state-context";
import Status from "../../database/models/Status";
import {STATUS_PAYED, STATUS_REJECTED_BY_CLIENT} from "../../constants";

export default class OrderRejectState extends AbstractOrderRejectState {

    stateContext: ReceiverStateContext;

    constructor(stateContext: ReceiverStateContext, order: Order) {
        super(stateContext, order);
        this.stateContext = stateContext;
    }

    async onBackMessage(): Promise<any> {
        await this.stateContext.setState(new OrdersState(this.stateContext));
    }

    protected async updateDatabase(rejectionReason: string): Promise<any> {
        this.order.rejectionClientReason = rejectionReason;
        const stateContext = this.stateContext;
        const statuses = stateContext.getBotContext().getStatuses();
        const statusFound = statuses.find((status) => status.name === STATUS_REJECTED_BY_CLIENT);
        if(!statusFound) {
            await stateContext.sendMessage('Ошибка сервера, пожалуйста, повторите позже');
            return stateContext.setState(new OrdersState(stateContext));
        }
        await this.order.save();
        await this.order.$set('status', statusFound);
    }

    protected async onSuccess(): Promise<any> {
        return this.stateContext.setState(new OrdersState(this.stateContext));
    }
}