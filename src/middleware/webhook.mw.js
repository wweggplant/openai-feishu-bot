import lark from '@larksuiteoapi/node-sdk';
import config from '../config/config.js';
import { asyncAnswer } from '../services/msgV2.srv.js';

const eventDispatcher = new lark.EventDispatcher({
    encryptKey: config.lark.encryptKey,
    verificationToken: config.lark.verificationToken,
    LoggerLevel: 5
}).register({
    'im.message.receive_v1': asyncAnswer
});

export const eventDispatcherAdapted = lark.adaptExpress(eventDispatcher);