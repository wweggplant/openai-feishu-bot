const lark = require('@larksuiteoapi/node-sdk');
const {Configuration } = require('openai');
const config = require('../config/config');
const larkClient = new lark.Client({
  appId: config.lark.id,
  appSecret: config.lark.secret,
  disableTokenCache: false,
})

const configuration = new Configuration({
  // organization: config.openai.orgID,
  basePath: config.openai.basePath,  
  apiKey: config.openai.key,
})


module.exports = {
  larkClient,
  configuration
};