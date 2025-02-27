// 配置类型定义
export interface ArmsConfig {
  /** 日志上传地址 */
  slsUrl: string;
  /** 应用ID */
  appId: string;
  /** 应用版本 */
  appVersion: string;
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

// 微信小程序账号信息
export interface WeappConfig {
  /** 程序 appId */
  appId: string;
  /** 线上小程序版本号 */
  version: string;
  /** 小程序版本 可选值: 'develop': 开发版; 'trial': 体验版; 'release': 正式版; */
  envVersion: string;
}

// 设备信息
export interface DeviceInfo {
  /** 设备品牌 */
  brand: string;
  /** 设备型号 */
  model: string;
  /** 操作系统及版本 */
  system: string;
  /** 客户端平台 */
  platform: string;
  /** 设备 CPU 型号（仅 Android 支持) */
  cpuType: string;
  /** 设备内存大小，单位为 MB */
  memorySize: string;
}

// 应用基础信息
export interface AppBaseInfo {
  /** 客户端基础库版本 */
  SDKVersion: string;
  /** 是否已打开调试 */
  enableDebug: string;
  /** 微信设置的语言 */
  language: string;
  /** 微信版本号 */
  version: string;
  /** 微信字体大小缩放比例 */
  fontSizeScaleFactor: string;
  /** 微信字体大小，单位px */
  fontSizeSetting: string;
}

// 日志数据类型
export interface LogData {
  /** 日志ID */
  logid: string;
  /** 版本号 */
  version: string;
  /** 应用ID */
  appid: string;
  /** 日志时间 */
  logtime: string;
  /** 日志信息 */
  msg: string;
  /** 日志描述 */
  desc: string;
  /** 日志类型 */
  type: string;
  /** 微信小程序 appId */
  weapp_account_appid: string;
  /** 微信小程序环境 */
  weapp_account_env: string;
  /** 微信小程序版本号 */
  weapp_account_version: string;
  /** 微信设备品牌 */
  weapp_device_brand: string;
  /** 微信设备型号 */
  weapp_device_model: string;
  /** 微信设备系统 */
  weapp_device_system: string;
  /** 微信设备平台 */
  weapp_device_platform: string;
  /** 微信设备 CPU 类型 */
  weapp_device_cpu_type: string;
  /** 微信设备内存大小 */
  weapp_device_memory_size: string;
  /** 微信基础库版本 */
  weapp_base_sdk_version: string;
  /** 微信是否开启调试 */
  weapp_base_enable_debug: string;
  /** 微信语言 */
  weapp_base_language: string;
  /** 微信版本号 */
  weapp_base_version: string;
  /** 微信字体大小缩放因子 */
  weapp_base_font_size_scale_factor: string;
  /** 微信字体大小设置 */
  weapp_base_font_size_setting: string;
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

// 全局对象类型定义
export interface UniApp {
  /** 获取小程序账号信息 */
  getAccountInfoSync: () => {
    miniProgram: {
      /** 环境版本 */
      envVersion: string;
      /** 小程序 appId */
      appId: string;
      /** 版本号 */
      version: string;
    }
  };
  /** 从本地缓存中同步获取指定 key 对应的内容 */
  getStorageSync: (key: string) => any;
  /** 将数据同步存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容 */
  setStorageSync: (key: string, data: any) => void;
  /** 发起网络请求 */
  request: (options: {
    /** 请求地址 */
    url: string;
    /** 请求方法 */
    method: string;
    /** 请求头 */
    header: Record<string, string>;
    /** 请求数据 */
    data: any;
  }) => Promise<any>;
}

export interface WxApp {
  /** 获取设备信息 */
  getDeviceInfo: () => {
    /** 设备品牌 */
    brand: string;
    /** 设备型号 */
    model: string;
    /** 操作系统及版本 */
    system: string;
    /** 客户端平台 */
    platform: string;
    /** cpu型号 */
    cpuType: string;
    /** 内存大小 */
    memorySize: string;
  };
  /** 获取应用基础信息 */
  getAppBaseInfo: () => {
    /** SDK版本 */
    SDKVersion: string;
    /** 是否开启调试 */
    enableDebug: boolean;
    /** 语言 */
    language: string;
    /** 微信版本号 */
    version: string;
    /** 用户设置的字体大小的缩放因子 */
    fontSizeScaleFactor: number;
    /** 用户字体大小 */
    fontSizeSetting: number;
  };
}

// 声明全局变量
declare global {
  /** uni-app 全局对象 */
  var uni: UniApp;
  /** 微信小程序全局对象 */
  var wx: WxApp;
}