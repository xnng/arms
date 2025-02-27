import { BaseLogData } from "./index";

// 小程序日志数据接口
export interface WeappLogData extends BaseLogData {
  /** 微信小程序 appId */
  weapp_account_appid: string;
  /** 微信小程序环境 */
  weapp_account_env: string;
  /** 微信小程序版本 */
  weapp_account_version: string;
  /** 设备品牌 */
  device_brand: string;
  /** 设备型号 */
  device_model: string;
  /** 设备系统 */
  device_system: string;
  /** 设备平台 */
  device_platform: string;
  /** CPU类型 */
  device_cpu_type: string;
  /** 内存大小 */
  device_memory_size: string;
  /** 基础库版本 */
  weapp_base_sdk_version: string;
  /** 调试模式 */
  weapp_base_enable_debug: string;
  /** 语言设置 */
  weapp_base_language: string;
  /** 基础库版本 */
  weapp_base_version: string;
  /** 字体大小缩放比例 */
  weapp_base_font_size_scale_factor: string;
  /** 字体大小设置 */
  weapp_base_font_size_setting: string;
  /** 小程序进入场景值 */
  weapp_enter_scene: string;
  /** 小程序进入路径 */
  weapp_enter_path: string;
  /** 小程序进入查询参数 */
  weapp_enter_query: string;
  /** 小程序进入来源信息 */
  weapp_enter_refer_info: string;
  /** 前台/后台状态 */
  weapp_state: string;
}


// 设备信息接口
export interface DeviceInfo {
  /** 设备品牌 */
  brand: string;
  /** 设备型号 */
  model: string;
  /** 设备系统 */
  system: string;
  /** 设备平台 */
  platform: string;
  /** CPU类型 */
  cpuType: string;
  /** 内存大小 */
  memorySize: string;
}

// 小程序账号信息接口
export interface WeappAccountInfo {
  /** 小程序appId */
  appId: string;
  /** 小程序版本 */
  version: string;
  /** 小程序环境 */
  envVersion: string;
}

// 小程序基础库信息接口
export interface AppBaseInfo {
  /** 基础库版本 */
  SDKVersion: string;
  /** 语言设置 */
  language: string;
  /** 版本 */
  version: string;
  /** 字体大小缩放比例 */
  fontSizeScaleFactor: string;
  /** 字体大小设置 */
  fontSizeSetting: string;
  /** 是否开启调试 */
  enableDebug: string;
}

/** 小程序状态 */
export type WeappState = 'foreground' | 'background' | '';

// UniApp 接口
export interface UniApp {
  /** 获取系统信息 */
  getSystemInfoSync: () => {
    /** 设备品牌 */
    brand: string;
    /** 设备型号 */
    model: string;
    /** 设备系统 */
    system: string;
    /** 设备平台 */
    platform: string;
    /** CPU类型 */
    cpuType: string;
    /** 内存大小 */
    memorySize: string;
    /** 基础库版本 */
    SDKVersion: string;
    /** 语言设置 */
    language: string;
    /** 版本 */
    version: string;
    /** 字体大小缩放比例 */
    fontSizeScaleFactor: string;
    /** 字体大小设置 */
    fontSizeSetting: string;
    /** 是否开启调试 */
    enableDebug?: boolean;
  }
  /** 获取本地存储 */
  getStorageSync: (key: string) => any;
  /** 设置本地存储 */
  setStorageSync: (key: string, data: any) => void;
  /** 获取小程序账号信息 */
  getAccountInfoSync: () => {
    /** 小程序账号信息 */
    miniProgram: {
      /** 小程序appId */
      appId: string;
      /** 小程序版本 */
      version: string;
      /** 小程序环境 */
      envVersion: string;
    };
  };
  /** 获取小程序启动信息 */
  getEnterOptionsSync: () => {
    /** 启动小程序的路径 */
    path: string;
    /** 启动小程序的场景值 */
    scene: number;
    /** 启动小程序的 query 参数 */
    query: Record<string, string>;
    /** 分享转发信息 */
    referrerInfo?: {
      /** 来源小程序或公众号或 App 的 appId */
      appId?: string;
      /** 来源小程序传过来的数据 */
      extraData?: Record<string, any>;
    };
    /** 打开的文件信息 */
    forwardMaterials?: Array<{
      /** 文件类型 */
      type: string;
      /** 文件名 */
      name: string;
      /** 文件路径（如果是webview则是url） */
      path: string;
      /** 文件大小 */
      size: number;
    }>;
    /** 从另一个小程序进入小程序时，返回此字段 */
    shareTicket?: string;
    /** 通过 API 打开小程序时，由调用方传入 */
    apiCategory?: string;
    /** 通过分享卡片进入小程序时，返回此字段 */
    chatType?: number;
  };
  /** 发起网络请求 */
  request: (options: {
    /** 请求地址 */
    url: string;
    /** 请求方法 */
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    /** 请求数据 */
    data?: any;
    /** 请求头 */
    header?: Record<string, string>;
    /** 成功回调 */
    success?: (res: any) => void;
    /** 失败回调 */
    fail?: (err: any) => void;
    /** 完成回调 */
    complete?: () => void;
  }) => void;
  /** 监听小程序进入前台 */
  onAppShow: (callback: () => void) => void;
  /** 监听小程序进入后台 */
  onAppHide: (callback: () => void) => void;
}

// 全局对象类型定义
declare global {
  const uni: UniApp;
}