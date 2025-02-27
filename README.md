# Arms

前端应用监控 SDK，用于收集和上报应用日志和错误信息。

## 安装

```bash
# 使用 pnpm
pnpm add @xnng/arms

# 或使用 npm
npm install @xnng/arms

# 或使用 yarn
yarn add @xnng/arms
```

## 使用方法

### 创建监控实例

```javascript
import { Arms } from '@xnng/arms';

// 创建实例
const arms = new Arms({
  slsUrl: 'https://your-log-service-url',
  appId: 'your-app-id',
  appVersion: '1.0.0',
  // 可选配置
  maxUploadNum: 10,
  initDelay: 2000,
  emptyQueueWaitTime: 1000,
  uploadWaitTime: 1500,
  errorWaitTime: 3000
});

// 上报错误
arms.error('发生了一个错误');
arms.error({ message: '错误信息', stack: '错误堆栈' });
```

## 配置项

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| slsUrl | string | 是 | - | 日志上传地址 |
| appId | string | 是 | - | 应用ID |
| appVersion | string | 是 | - | 应用版本 |
| maxUploadNum | number | 否 | 10 | 单次最大上传数量 |
| initDelay | number | 否 | 2000 | 初始化延迟时间（毫秒） |
| emptyQueueWaitTime | number | 否 | 1000 | 无任务等待时间（毫秒） |
| uploadWaitTime | number | 否 | 1000 | 上传后等待时间（毫秒） |
| errorWaitTime | number | 否 | 3000 | 错误后等待时间（毫秒） |

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 类型检查
pnpm type-check
```

## 许可证

MIT
