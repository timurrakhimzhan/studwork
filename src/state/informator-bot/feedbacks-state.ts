import {AbstractInformatorBaseState} from "./internal";
import {Sequelize} from "sequelize-typescript";
import FeedbackType from "../../database/models/FeedbackType";
import Feedback from "../../database/models/Feedback";

class FeedbacksState extends AbstractInformatorBaseState {
    private async fetchFeedbackTypeCounts() {
        return FeedbackType.findAll({
            attributes: ['statusId', 'name',
                [Sequelize.fn('count', Sequelize.col('feedbacks.feedbackId')), 'feedbacksCount']
            ],
            group: 'FeedbackType.statusId',
            include: [{
                model: Feedback, attributes: [], required: false,
                where: {
                    mock: !!process.env['MOCK'],
                },
            }],
        });
    }
    private async fetchFeedbacks() {

    }
    async initState(): Promise<any> {
    }
}