import path from 'path';
import { fileURLToPath } from 'url'; // 引入 url 模块的 fileURLToPath 方法
import dotenv from 'dotenv';
import Joi from 'joi';

// 使用 fileURLToPath 和 import.meta.url 获取当前文件的绝对路径
const __filename = fileURLToPath(import.meta.url);
// 使用 path.dirname 获取当前文件所在的目录
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development').required(),
    PORT: Joi.number().default(3000),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(3306),
    DB_NAME: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASS: Joi.string().required(),
    DB_MAX_CONN: Joi.number().default(5),
    DB_MIN_CONN: Joi.number().default(0),
    DB_ACQUIRE: Joi.number().default(30000), // 30 sec
    DB_IDLE: Joi.number().default(10000), // 10sec
    GEMINI_KEY: Joi.string().optional().allow(''),
    OPENAI_KEY: Joi.string().required(),
    OPENAI_MODEL: Joi.string().default('gpt-3.5-turbo-0301'),
    OPENAI_MAX_TOKENS: Joi.number().default(4096),
    OPENAI_ORG_ID: Joi.string().optional().allow(''),
    FEISHU_APP_NAME: Joi.string().required(),
    FEISHU_APP_ID: Joi.string().required(),
    FEISHU_APP_SECRET: Joi.string().required(),
    FEISHU_APP_ENCRYPTKEY: Joi.string().required(),
    FEISHU_APP_VERIFICATIONTOKEN: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  db: {
    name: envVars.DB_NAME,
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    user: envVars.DB_USER,
    passwd: envVars.DB_PASS,
    pool: {
      maxConn: envVars.DB_MAX_CONN,
      minConn: envVars.DB_MIN_CONN,
      acquire: envVars.DB_ACQUIRE,
      idle: envVars.DB_IDLE
    }
  },
  openai: {
    key: envVars.OPENAI_KEY,
    model: envVars.OPENAI_MODEL,
    maxTokens: envVars.OPENAI_MAX_TOKENS,
    orgID: envVars.OPENAI_ORG_ID,
    basePath: envVars.OPENAI_BASEPATH,
  },
  lark: {
    name: envVars.FEISHU_APP_NAME,
    id: envVars.FEISHU_APP_ID,
    secret: envVars.FEISHU_APP_SECRET,
    encryptKey: envVars.FEISHU_APP_ENCRYPTKEY,
    verificationToken: envVars.FEISHU_APP_VERIFICATIONTOKEN,
  },
  gemini: {
    key: envVars.GEMINI_KEY,
  }
};
