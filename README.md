# Arms

前端应用监控 SDK，用于收集和上报应用日志和错误信息。支持 uni-app 平台。

## 安装

```bash
npm install @xnng/arms
```

### 依赖

本 SDK 依赖以下库，请确保它们已安装：

```bash
npm install dayjs
```

## 使用方法

### 创建监控实例

```javascript
import { createArms } from '@xnng/arms';

// 创建实例
const arms = createArms({
  slsUrl: 'https://your-log-service-url',
  appId: 'your-app-id',
  appVersion: '1.0.0',
  autoCapture: true
});
```

### 上报错误

```javascript
// 优先上报错误堆栈
arms.error(error.stack);

// 上报错误对象
arms.error(new Error('错误对象'));

// 上报错误信息和描述
arms.error('错误信息', '错误描述');
```

### 设置用户信息

用户信息可用于业务标记，方便日志分析和筛选，预留了 6 个字段，索引范围 1-6，可根据业务实际情况使用

```javascript
// 设置用户信息，索引范围 1-6
arms.setUserKey(1, 'uid');
arms.setUserKey(2, 'phone');
arms.setUserKey(3, 'token');
arms.setUserKey(4, 'tenantId');
```

## 配置项

### 通用配置

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| slsUrl | string | 是 | - | 日志上传地址 |
| appId | string | 是 | - | 应用ID |
| appVersion | string | 是 | - | 应用版本 |
| maxUploadNum | number | 否 | 10 | 单次最大上传数量 |
| initDelay | number | 否 | 3000 | 初始化延迟时间（毫秒） |
| emptyQueueWaitTime | number | 否 | 500 | 无任务等待时间（毫秒） |
| uploadWaitTime | number | 否 | 1000 | 上传后等待时间（毫秒） |
| errorWaitTime | number | 否 | 2000 | 错误后等待时间（毫秒） |
| autoCapture | boolean | 否 | false | 是否自动捕获未处理的错误 |

## 依赖说明

- 基于 uni-app API

## API

### error(msg, desc)

上报错误信息。

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| msg | string / Error / object | 是 | 错误信息、错误对象或自定义对象 |
| desc | string | 否 | 错误描述，提供更多上下文信息 |

```javascript
// 优先上报错误堆栈
arms.error(error.stack);
```

### info(msg, desc)

上报普通信息。

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| msg | string / Error / object | 是 | 信息内容、错误对象或自定义对象 |
| desc | string | 否 | 信息描述 |

```javascript
arms.info('用户登录', '登录成功');
```

### warn(msg, desc)

上报警告信息。

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| msg | string / Error / object | 是 | 警告内容、错误对象或自定义对象 |
| desc | string | 否 | 警告描述 |

```javascript
arms.warn('接口超时', '请求超过3秒');
```

### point(msg, desc)

上报埋点信息。

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| msg | string / Error / object | 是 | 埋点内容、错误对象或自定义对象 |
| desc | string | 否 | 埋点描述 |

```javascript
arms.point('button_click', '用户点击了提交按钮');
```

### setUserKey(index, value)

设置用户自定义键值，用于业务标记，预留了 6 个字段，可根据实际情况设置

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| index | number | 是 | 键索引，范围 1-6 |
| value | string | 是 | 键值 |

```javascript
// 设置用户标记
arms.setUserKey(1, 'uid');
arms.setUserKey(2, 'phone');
arms.setUserKey(3, 'token');
```

## 上报数据字段说明

SDK 上报的数据包含以下字段：

### 通用字段

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| logid | string | 日志唯一ID |
| version | string | 应用版本号 |
| appid | string | 应用ID |
| logtime | string | 日志时间，格式：YYYY-MM-DD HH:mm:ss.SSS |
| msg | string | 错误消息 |
| desc | string | 错误描述 |
| type | string | 日志类型，如 'error'、'info'、'warn'、'point' |
| device_id | string | 设备唯一标识 |
| user_key_1 | string | 用户自定义键1 |
| user_key_2 | string | 用户自定义键2 |
| user_key_3 | string | 用户自定义键3 |
| user_key_4 | string | 用户自定义键4 |
| user_key_5 | string | 用户自定义键5 |
| user_key_6 | string | 用户自定义键6 |

### 平台特有字段

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| account_appid | string | 应用账号ID |
| account_version | string | 应用版本 |
| account_env | string | 应用环境 |
| device_brand | string | 设备品牌 |
| device_model | string | 设备型号 |
| device_system | string | 设备系统 |
| device_platform | string | 设备平台 |
| device_memory_size | string | 内存大小 |
| base_sdk_version | string | 基础库版本 |
| base_language | string | 语言设置 |
| base_version | string | 基础库版本 |
| base_enable_debug | string | 是否开启调试 |
| enter_scene | string | 应用进入场景值 |
| enter_path | string | 应用进入路径 |
| enter_query | string | 应用进入查询参数 |
| enter_refer_info | string | 应用进入来源信息 |
| state | string | 应用状态，foreground 或 background |

## 开发

```bash
# 安装依赖
pnpm install

# 构建
pnpm build
```

## 许可证

MIT
