import lark from '@larksuiteoapi/node-sdk';
import { Configuration } from 'openai';
import config from '../config/config.js';
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


export { larkClient, configuration };