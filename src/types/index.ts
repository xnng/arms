import { UniAppLogData } from "./uniapp";

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
  /** 用户信息 */
  user: string;
}

// 通用日志数据类型
export type LogData = UniAppLogData;
