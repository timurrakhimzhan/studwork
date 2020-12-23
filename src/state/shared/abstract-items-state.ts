import {AbstractBaseState} from "./internal";
import {CallbackQuery, InlineKeyboardButton, Message, SendMessageOptions} from "node-telegram-bot-api";
import {generateKeyboardMenu, generateReceipt, getBufferFromUrl} from "../../utils/message-utils";
import AbstractStateContext from "../abstract-state-context";
import {CALLBACK_ITEM_BACK, CALLBACK_ITEM_NEXT} from "../../constants";

export default abstract class AbstractItemsState<T, K extends string, R> extends AbstractBaseState {
    protected categories: Array<K>;
    protected categoryMeaningMap: {[key in K]: string};
    protected categoryCountMap: {[key in K]?: number} = {};
    protected categoryItemsMap: {[key in K]?: Array<R>} = {}
    protected currentCategory: K | null = null;
    protected currentItemPosition = 0;
    protected offset = 0;

    protected constructor(stateContext: AbstractStateContext, categories: Array<K>, categoryMeaningMap: {[key in K]: string}) {
        super(stateContext);
        this.categories = categories;
        this.categoryMeaningMap = categoryMeaningMap;
    }

    async sendMessage(message: string, options?: SendMessageOptions): Promise<Message> {
        const keyboardMenu = generateKeyboardMenu(this.categories.map((category: K) => ({
            name: `${this.categoryMeaningMap[category]} (${this.categoryCountMap[category]})`
        })));
        keyboardMenu.push([{text: 'Вернуться в меню'}])
        return super.sendMessage(message, options || {
            parse_mode: 'Markdown',
            reply_markup: {
                keyboard: keyboardMenu,
                resize_keyboard: true,
            },
        });
    }

    abstract initState(): Promise<any>;

    protected abstract fetchItems(): Promise<Array<R>>;
    protected abstract generateExtraInlineMarkup(item: R): Array<Array<InlineKeyboardButton>>;

    protected async fillCurrentCategoryItems(category: K) {
        const items: Array<R> | undefined = this.categoryItemsMap[category];
        if(!items) {
            this.categoryItemsMap[category] = await this.fetchItems();
            return;
        }
        if(items.length === this.categoryCountMap[category]) {
            return;
        }
        if(items.length === this.currentItemPosition) {
            this.offset += 10;
            const nextItems: Array<R> = await this.fetchItems();
            this.categoryItemsMap[category] = items.concat(nextItems);
        }
    }

    protected abstract generateItemMessage(item: R): string;

    protected async showItem(editCurrentMessage?: boolean): Promise<void> {
        if(!this.currentCategory) {
            return;
        }
        const stateContext = this.stateContext;
        const bot = stateContext.getBotContext().getBot();
        let inlineMarkup: Array<Array<InlineKeyboardButton>> = [[
            {text: '⬅️ Назад', callback_data: CALLBACK_ITEM_BACK},
            {text: 'Вперед ➡️', callback_data: CALLBACK_ITEM_NEXT}
        ]]
        if(this.categoryCountMap[this.currentCategory] === 0) {
            return stateContext.sendMessage('Список пуст.');
        }
        if(this.currentItemPosition === 0) {
            inlineMarkup[0].shift();
        }
        if(this.currentItemPosition + 1 === this.categoryCountMap[this.currentCategory]) {
            inlineMarkup[0].pop();
        }
        await this.fillCurrentCategoryItems(this.currentCategory);
        const items = this.categoryItemsMap[this.currentCategory] as Array<R>;
        const item = items[this.currentItemPosition];
        const message = this.generateItemMessage(item);
        const inlineMenu = this.generateExtraInlineMarkup(item)
        inlineMarkup = [...inlineMarkup, ...inlineMenu];
        if(editCurrentMessage) {
            await bot.editMessageText(message, {
                chat_id: stateContext.getChatId(),
                message_id: stateContext.getLastMessageId() as number,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: inlineMarkup
                }
            })
        } else {
            await stateContext.sendMessage(message, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: inlineMarkup
                }
            })
        }
    }



    async messageController(message: Message): Promise<any> {
        const categoryChosen =
            this.categories.find((category) => message.text?.includes(this.categoryMeaningMap[category]));
        if(!categoryChosen) {
            await this.stateContext.sendMessage('Некорректный ввод, пожалуйста, повторите еще раз');
            return;
        }
        this.currentCategory = categoryChosen;
        await this.showItem();
    }

    async callbackController(callback: CallbackQuery): Promise<any> {
        if(!this.currentCategory) {
            return;
        }
        const stateContext = this.stateContext;
        const botContext = stateContext.getBotContext();
        const bot = botContext.getBot();
        const callbackData = callback.data as string;
        if(callbackData === CALLBACK_ITEM_BACK) {
            if(this.currentItemPosition > 0) {
                this.currentItemPosition--;
            }
            await this.showItem(true);
            await bot.answerCallbackQuery(callback.id);
        }
        if(callbackData === CALLBACK_ITEM_NEXT) {
            if(this.currentItemPosition + 1 !== this.categoryCountMap[this.currentCategory]) {
                this.currentItemPosition++;
            }
            await this.showItem(true);
            await bot.answerCallbackQuery(callback.id);
        }
    }



}