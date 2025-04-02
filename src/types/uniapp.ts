import { BaseLogData } from './index';

/**
 * 设备信息
 */
export interface DeviceInfo {
  /** 手机品牌 */
  brand: string;
  /** 手机型号 */
  model: string;
  /** 操作系统及版本 */
  system: string;
  /** 客户端平台 */
  platform: string;
  /** 设备内存大小 */
  memorySize: string;
}

/**
 * 应用帐号信息
 */
export interface UniAppAccountInfo {
  /** 账号 appId */
  appId: string;
  /** 应用版本号 */
  version: string;
  /** 应用环境版本 */
  envVersion: string;
}

/**
 * 应用基础信息
 */
export interface AppBaseInfo {
  /** 基础库版本 */
  SDKVersion: string;
  /** 当前环境语言 */
  language: string;
  /** 微信版本号 */
  version: string;
  /** 是否开启调试 */
  enableDebug: string;
}

/**
 * 应用状态
 */
export type UniAppState = 'foreground' | 'background' | '';

/**
 * 应用日志数据
 */
export interface UniAppLogData extends BaseLogData {
  /** 账号 appId */
  account_appid: string;
  /** 环境版本 */
  account_env: string;
  /** 应用版本 */
  account_version: string;
  /** 设备品牌 */
  device_brand: string;
  /** 设备型号 */
  device_model: string;
  /** 系统版本 */
  device_system: string;
  /** 平台 */
  device_platform: string;
  /** 内存大小 */
  device_memory_size: string;
  /** 基础库版本 */
  base_sdk_version: string;
  /** 是否开启调试 */
  base_enable_debug: string;
  /** 语言 */
  base_language: string;
  /** 客户端版本 */
  base_version: string;
  /** 小程序启动场景值 */
  enter_scene: string;
  /** 小程序启动路径 */
  enter_path: string;
  /** 小程序启动参数 */
  enter_query: string;
  /** 小程序启动来源信息 */
  enter_refer_info: string;
  /** 小程序状态：前台还是后台 */
  state: string;
} 