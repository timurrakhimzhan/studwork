import {AbstractOrderRejectState, OrdersState} from "./internal";
import InformatorStateContext from "./informator-state-context";
import Order from "../../database/models/Order";
import Status from "../../database/models/Status";
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

    protected async updateDatabase(rejectionComment: string): Promise<any> {
        this.order.rejectionTeacherReason = rejectionComment;
        const status = await Status.findOne({ where: {name: STATUS_REJECTED_BY_TEACHER}});
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