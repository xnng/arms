# Arms

前端应用监控 SDK，用于收集和上报应用日志和错误信息。支持小程序和 H5 平台。

## 安装

```bash
# 使用 pnpm
pnpm add @xnng/arms

# 或使用 npm
npm install @xnng/arms

# 或使用 yarn
yarn add @xnng/arms
```

### 依赖

本 SDK 依赖以下库，请确保它们已安装：

```bash
# 使用 pnpm
pnpm add axios dayjs

# 或使用 npm
npm install axios dayjs

# 或使用 yarn
yarn add axios dayjs
```

## 使用方法

### 使用工厂函数创建实例

```javascript
import { createArms, PlatformType } from '@xnng/arms';

// 创建小程序实例
const weappArms = createArms({
  slsUrl: 'https://your-log-service-url',
  appId: 'your-app-id',
  appVersion: '1.0.0'
}, PlatformType.WEAPP);

// 创建 H5 实例
const h5Arms = createArms({
  slsUrl: 'https://your-log-service-url',
  appId: 'your-app-id',
  appVersion: '1.0.0',
  autoCapture: true // 自动捕获未处理的错误
}, PlatformType.H5);

// 上报错误
weappArms.error('发生了一个错误');
weappArms.error(new Error('错误对象'));
weappArms.error('错误信息', '错误描述');

// 设置用户自定义键值
weappArms.setUserKey(1, 'user_id_123');
weappArms.setUserKey(2, 'channel_abc');
```

### 直接创建平台特定实例

```javascript
// 小程序
import { WeappArms } from '@xnng/arms';

const weappArms = new WeappArms({
  slsUrl: 'https://your-log-service-url',
  appId: 'your-app-id',
  appVersion: '1.0.0'
});

// H5
import { H5Arms } from '@xnng/arms';

const h5Arms = new H5Arms({
  slsUrl: 'https://your-log-service-url',
  appId: 'your-app-id',
  appVersion: '1.0.0',
  autoCapture: true  // 自动捕获未处理的错误
});
```

## 依赖说明

- 小程序平台：依赖 UniApp API
- H5 平台：依赖 axios 进行网络请求

## 配置项

### 通用配置

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

### H5 平台特有配置

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| autoCapture | boolean | 否 | false | 是否自动捕获未处理的错误 |

## API

### error(msg, desc)

上报错误信息。

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| msg | string \| Error \| object | 是 | 错误信息或错误对象 |
| desc | string | 否 | 错误描述，提供更多上下文信息 |

### setUserKey(index, value)

设置用户自定义键值，用于业务标记。

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| index | number | 是 | 键索引，范围 1-6 |
| value | string | 是 | 键值 |

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
| type | string | 日志类型，如 'error' |
| device_id | string | 设备唯一标识 |
| user_key_1 | string | 用户自定义键1 |
| user_key_2 | string | 用户自定义键2 |
| user_key_3 | string | 用户自定义键3 |
| user_key_4 | string | 用户自定义键4 |
| user_key_5 | string | 用户自定义键5 |
| user_key_6 | string | 用户自定义键6 |

### 小程序平台特有字段

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| weapp_account_appid | string | 小程序账号ID |
| weapp_account_version | string | 小程序版本 |
| weapp_account_env | string | 小程序环境 |
| device_brand | string | 设备品牌 |
| device_model | string | 设备型号 |
| device_system | string | 设备系统 |
| device_platform | string | 设备平台 |
| device_cpu_type | string | CPU类型 |
| device_memory_size | string | 内存大小 |
| weapp_base_sdk_version | string | 基础库版本 |
| weapp_base_language | string | 语言设置 |
| weapp_base_version | string | 基础库版本 |
| weapp_base_font_size_scale_factor | string | 字体大小缩放比例 |
| weapp_base_font_size_setting | string | 字体大小设置 |
| weapp_enter_scene | string | 小程序进入场景值 |
| weapp_enter_path | string | 小程序进入路径 |
| weapp_enter_query | string | 小程序进入查询参数 |
| weapp_enter_refer_info | string | 小程序进入来源信息 |
| weapp_state | string | 小程序状态，foreground 或 background |

### H5 平台特有字段

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| browser_name | string | 浏览器名称 |
| browser_version | string | 浏览器版本 |
| os_name | string | 操作系统 |
| os_version | string | 操作系统版本 |
| screen_width | string | 屏幕宽度 |
| screen_height | string | 屏幕高度 |
| page_url | string | 页面URL |
| page_title | string | 页面标题 |
| page_referrer | string | 页面来源 |
| network_type | string | 网络类型 |

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
