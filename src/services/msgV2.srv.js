// @CreateTime: 2023/3/3
// @Author: key7men
// @Contact: key7men@gmail.com
// @Last Modified By: key7men
// @Last Modified Time: 09:27
// @Description: 处理请求，并分析请求目的，交由不同的service处理
// @Link: https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message/events/receive

import db from '../models/index.js';
import { reply, getAIAnswer } from './msg.srv.js';
import { runConversation } from './actions.srv.js';
const questionDao = db.question;

const asyncAnswer = async (data) => {
    // 事件标识符，同一个事件，只处理一次
    const eventId = data.event_id;
    // 用户id
    const userId = data.sender.sender_id.open_id;
    // 消息ID，通过这个ID能够准确将消息返回给问题提出者
    const msgId = data.message.message_id;
    // 消息类型
    const msgType = data.message.message_type;
    // 消息内容
    const content = data.message.content;

    // -------------------------------- 消息处理 ------------------------------

    // step 1: 检查该事件是否已经处理过
    let questionRecord = await questionDao.findByPk(eventId);
    if (questionRecord === null) {
        // 没有该事件的记录，就插入该事件，稍后回答完之后，再更新该事件的记录
        questionRecord = await questionDao.create({
            id: eventId,
            question_content: JSON.parse(content).text
        })
    } else {
        // 已经处理过了，直接返回
        return null
    }

    // step 2: 检查消息格式是否允许，并给出对应的响应方式
    if (msgType === 'text') {

        // 明确是text类型的消息，则可以提取问题，并通过OPENAI机器人回答
        const question = JSON.parse(content).text;
        if (question.includes('weather')) {
            
            const response = await runConversation(question);
            return await reply('just-answer',msgId, title, response.content);
        }
        const [answer, cost] = await getAIAnswer(question, 'text');

        // 更新问题表
        questionRecord.set({
            user_id: userId,
            answer_content: answer,
            cost: cost
        });
        await questionRecord.save();
        // 如果text中包含"天气", 执行runConversation获取天气信息, 使用replay返回
        const title = `${question}`;

        // openai返回的是类似于markdown的内容，利用飞书解析markdown的能力，将其转换为富文本
        return await reply('just-answer', msgId, title, answer);

    } else if (msgType === 'post') {
        // TODO: 后续可以通过解析（post）富文本类型的消息实现针对图片的处理
    } else {
        return await reply(msgId, '抱歉，目前您只能通过文本消息的方式，向我提问。（🌍May Be Force With You🌍）')
    }
}

export { asyncAnswer };
