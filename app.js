import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import compression from 'compression';
import cors from 'cors';
import httpStatus from 'http-status';
import { successHandler as morganSuccessHandler, errorHandler as morganErrorHandler } from './src/config/morgan.js';
import { errorConverter, errorHandler } from './src/middleware/error.mw.js';
import { eventDispatcherAdapted } from './src/middleware/webhook.mw.js';
import ApiError from './src/util/api-err.js';
import routes from './src/routes/index.js';
import db from './src/models/index.js';
import bodyParser from 'body-parser';

const app = express();

app.use(morganSuccessHandler);
app.use(morganErrorHandler);

// 设置安全性 HTTP 标头
app.use(helmet());

// 解析 JSON 请求正文
app.use(express.json());

// 解析 urlencode 请求正文
app.use(express.urlencoded({ extended: true }));

// 防xss攻击
app.use(xss());

// gzip压缩
app.use(compression());

// 启用cors
app.use(cors());
app.use(bodyParser.json());
app.options('*', cors());


// 启动前，同步数据库
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log(`Failed to sync db: ${err.message}`);
  });

app.use('/webhook/event', eventDispatcherAdapted);
// 路由入口
app.use('/', routes);

// 为任何未知 API 请求发回 404 错误
app.use((req, res, next) => {
  console.log(req);
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// 将错误转换为 ApiError
app.use(errorConverter);

// 处理错误
app.use(errorHandler);

export default app;
