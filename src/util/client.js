import lark from '@larksuiteoapi/node-sdk';
import { Configuration } from 'openai';
import config from '../config/config.js';
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
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
const model = new ChatGoogleGenerativeAI({
  apiKey: config.gemini.key,
  modelName: "gemini-pro",
  maxOutputTokens: 2048,
});
const chat = new ChatOpenAI({
  configuration: {
    apiKey: config.openai.key,
    baseURL: config.openai.basePath,
  },
  openAIApiKey: config.openai.key,
  modelName: "gpt-3.5-turbo",
  temperature: 0.2,
});
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant. Answer all questions to the best of your ability.",
  ],
  new MessagesPlaceholder("messages"),
]);
const chain = prompt.pipe(model);
export { larkClient, configuration, chain, model };