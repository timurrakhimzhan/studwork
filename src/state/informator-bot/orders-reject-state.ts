import {AbstractOrderRejectState, OrdersState} from "./internal";
import InformatorStateContext from "./informator-state-context";
import Order from "../../database/models/Order";
import {STATUS_REJECTED_BY_TEACHER} from "../../constants";

export default class OrdersRejectState extends AbstractOrderRejectState {
    stateContext: InformatorStateContext;

    constructor(stateContext: InformatorStateContext, order: Order) {
        super(stateContext, order);
        this.stateContext = stateContext;
    }
    async onBackMessage(): Promise<any> {
        return this.stateContext.setState(new OrdersState(this.stateContext));
    }

    protected async updateDatabase(rejectionReason: string): Promise<any> {
        this.order.rejectionTeacherReason = rejectionReason;
        const stateContext = this.stateContext;
        const statuses = stateContext.getBotContext().getStatuses();
        const statusFound = statuses.find((status) => status.name === STATUS_REJECTED_BY_TEACHER);
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