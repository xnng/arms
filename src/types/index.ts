import { H5LogData } from "./h5";
import { WeappLogData } from "./weapp";

// 基础配置接口
export interface BaseConfig {
  /** 日志上传地址 */
  slsUrl: string;
  /** 应用ID */
  appId: string;
  /** 应用版本 */
  appVersion: string;
  /** 是否自动捕获未处理的错误 */
  autoCapture?: boolean;
  /** 单次最大上传数量 */
  maxUploadNum?: number;
  /** 初始化延迟时间（毫秒） */
  initDelay?: number;
  /** 无任务等待时间（毫秒） */
  emptyQueueWaitTime?: number;
  /** 上传后等待时间（毫秒） */
  uploadWaitTime?: number;
  /** 错误后等待时间（毫秒） */
  errorWaitTime?: number;
}

// Arms 配置接口
export interface ArmsConfig extends BaseConfig {
  /** 平台类型 */
  platformType: 'weapp' | 'h5';
}

// 通用日志数据接口
export interface BaseLogData {
  /** 日志唯一ID */
  logid: string;
  /** 应用版本 */
  version: string;
  /** 应用ID */
  appid: string;
  /** 日志时间 */
  logtime: string;
  /** 日志消息 */
  msg: string;
  /** 日志描述 */
  desc: string;
  /** 日志类型 */
  type: string;
  /** 设备唯一标识 */
  device_id: string;
  /** 用户自定义键1 */
  user_key_1: string;
  /** 用户自定义键2 */
  user_key_2: string;
  /** 用户自定义键3 */
  user_key_3: string;
  /** 用户自定义键4 */
  user_key_4: string;
  /** 用户自定义键5 */
  user_key_5: string;
  /** 用户自定义键6 */
  user_key_6: string;
}

// 通用日志数据类型
export type LogData = WeappLogData | H5LogData;

// 平台接口定义
export interface IPlatform<T extends BaseLogData> {
  /** 获取设备ID */
  getDeviceId(): string;
  /** 上传日志 */
  uploadLog(logs: T[], slsUrl: string): Promise<void>;
  /** 初始化平台相关信息 */
  init(): void;
  /** 获取设备ID */
  getDeviceId(): string;
  /** 获取平台特定的日志数据 */
  getLogData(msg: string | Error | object, desc?: string, type?: string): T;
}
