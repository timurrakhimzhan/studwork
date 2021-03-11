import {Sequelize} from "sequelize-typescript";
import FeedbackType, {
    feedbackTypeMeaningMap,
    FeedbackTypeName,
} from "../../database/models/FeedbackType";
import Feedback from "../../database/models/Feedback";
import {AbstractItemsState} from "../shared/internal";
import InformatorStateContext from "./informator-state-context";
import {InlineKeyboardButton} from "node-telegram-bot-api";
import {generateFeedbackInfo} from "../../utils/message-utils";

export default class FeedbacksState extends AbstractItemsState<FeedbackType, FeedbackTypeName, Feedback> {
    stateContext: InformatorStateContext;
    constructor(stateContext: InformatorStateContext) {
        const feedbackTypes = stateContext.getBotContext().getFeedbackTypes().map((feedbackType) => feedbackType.name);
        super(stateContext, feedbackTypes, feedbackTypeMeaningMap);
        this.stateContext = stateContext;
    }

    async initMaps(): Promise<any> {
        const feedbackTypeCounts = await this.fetchFeedbackTypeCounts();
        feedbackTypeCounts.forEach((feedbackTypeCount) => {
            this.categoryCountMap[feedbackTypeCount.get('name')] = parseInt(feedbackTypeCount.get('feedbacksCount') as string)
        })
    }

    async initState(): Promise<any> {
        await this.stateContext.sendMessage('Выберите категорию отзыва:');
    }

     private async fetchFeedbackTypeCounts() {
        return FeedbackType.findAll({
            attributes: ['feedbackTypeId', 'name',
                [Sequelize.fn('count', Sequelize.col('feedbacks.feedbackId')), 'feedbacksCount']
            ],
            group: 'FeedbackType.feedbackTypeId',
            include: [{
                model: Feedback, attributes: [], required: false,
                where: {
                    mock: !!process.env['MOCK'],
                },
            }],
        });
    }

    protected generateItemMessage(feedback: Feedback): string {
        return generateFeedbackInfo(feedback);
    }

    protected generateExtraInlineMarkup(feedback: Feedback): Array<Array<InlineKeyboardButton>> {
        return []
    }

    async fetchItems() {
        return Feedback.findAll({
            include: [FeedbackType],
            order: Sequelize.literal('"Feedback"."feedbackId" DESC'),
            where: {
                mock: !!process.env['MOCK'],
            }
        })
    }
}