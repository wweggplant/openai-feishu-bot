const lark = require('@larksuiteoapi/node-sdk');
const config = require('../config/config');
const {asyncAnswer} = require('../services/msgV2.srv');

const eventDispatcher = new lark.EventDispatcher({
    encryptKey: config.lark.encryptKey,
    verificationToken: config.lark.verificationToken,
    LoggerLevel: 5
}).register({
  'im.message.receive_v1': asyncAnswer
});


module.exports = {eventDispatcher : lark.adaptExpress(eventDispatcher)};