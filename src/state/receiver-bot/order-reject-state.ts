import {AbstractOrderRejectState, OrdersState} from "./internal";
import Order from "../../database/models/Order";
import ReceiverStateContext from "./receiver-state-context";
import Status from "../../database/models/Status";
import {STATUS_REJECTED_BY_CLIENT} from "../../constants";

export default class OrderRejectState extends AbstractOrderRejectState {

    stateContext: ReceiverStateContext;

    constructor(stateContext: ReceiverStateContext, order: Order) {
        super(stateContext, order);
        this.stateContext = stateContext;
    }

    async onBackMessage(): Promise<any> {
        await this.stateContext.setState(new OrdersState(this.stateContext));
    }

    protected async updateDatabase(rejectionComment: string): Promise<any> {
        this.order.rejectionClientComment = rejectionComment;
        const status = await Status.findOne({ where: {name: STATUS_REJECTED_BY_CLIENT}});
        if(!status) {
            const stateContext = this.stateContext;
            await stateContext.sendMessage('Ошибка сервера, пожалуйста, повторите позже');
            return stateContext.setState(new OrdersState(stateContext));
        }
        await this.order.$set('status', status);
    }

    protected async onSuccess(): Promise<any> {
        return this.stateContext.setState(new OrdersState(this.stateContext));
    }
}