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
arms.error(new Error('错误对象'));
arms.error('错误信息', '错误描述');

// 设置用户自定义键值
arms.setUserKey(1, 'user_id_123');
arms.setUserKey(2, 'channel_abc');
arms.setUserKey(3, 'custom_value');
arms.setUserKey(4, 'business_line_x');
arms.setUserKey(5, 'feature_flag_on');
arms.setUserKey(6, 'experiment_group_b');
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

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| logid | string | 日志唯一ID |
| version | string | 应用版本号 |
| appid | string | 应用ID |
| logtime | string | 日志时间，格式：YYYY-MM-DD HH:mm:ss.SSS |
| msg | string | 错误消息 |
| desc | string | 错误描述 |
| page_path | string | 页面路径 |
| type | string | 日志类型，如 'error' |
| device_brand | string | 设备品牌 |
| device_model | string | 设备型号 |
| device_system | string | 设备系统 |
| device_platform | string | 设备平台 |
| device_cpu_type | string | CPU类型 |
| device_memory_size | string | 内存大小 |
| weapp_account_id | string | 小程序账号ID |
| weapp_version | string | 小程序版本 |
| weapp_env | string | 小程序环境 |
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
| device_id | string | 设备唯一标识 |
| user_key_1 | string | 用户自定义键1 |
| user_key_2 | string | 用户自定义键2 |
| user_key_3 | string | 用户自定义键3 |
| user_key_4 | string | 用户自定义键4 |
| user_key_5 | string | 用户自定义键5 |
| user_key_6 | string | 用户自定义键6 |

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
