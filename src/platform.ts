import dayjs from 'dayjs';
import { BaseLogData, LogData } from './types';
import { generateUniqueId } from './utils';
import { AppBaseInfo, DeviceInfo, UniAppAccountInfo, UniAppState } from './types/uniapp';

/**
 * 平台功能实现
 */
export class Platform {
  // uni-app 前台还是在后台
  private uniAppState: UniAppState = ''

  // 设备信息
  private deviceInfo: DeviceInfo = {
    brand: '',
    model: '',
    system: '',
    platform: '',
    memorySize: ''
  };

  // 账号信息
  private accountInfo: UniAppAccountInfo = {
    appId: '',
    version: '',
    envVersion: ''
  };

  // 应用基础信息
  private appBaseInfo: AppBaseInfo = {
    SDKVersion: '',
    language: '',
    version: '',
    enableDebug: ''
  };

  // 设备ID
  private deviceId: string = '';

  /**
   * 初始化平台信息
   */
  public init(): void {
    this.getDeviceInfo();
    this.getAccountInfo();
    this.getAppBaseInfo();
    this.initUniAppState();
    this.initDeviceId();
  }

  /**
   * 上传日志
   */
  public async uploadLog(logs: LogData[], slsUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      uni.request({
        url: slsUrl,
        method: 'POST',
        data: {
          '__logs__': logs
        },
        header: {
          'x-log-apiversion': '0.6.0',
          'content-type': 'application/json'
        },
        success: () => {
          resolve();
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }

  /**
   * 获取设备ID
   */
  public getDeviceId(): string {
    const storageKey = 'arms_device_id';
    // 尝试从存储中获取设备ID
    let deviceId = '';
    deviceId = uni.getStorageSync(storageKey);

    // 如果没有获取到设备ID，则生成一个新的
    if (!deviceId) {
      const newDeviceId = generateUniqueId(32);
      uni.setStorageSync(storageKey, newDeviceId);
      return newDeviceId;
    }
    return deviceId;
  }

  /**
   * 获取日志数据
   */
  public getLogData(msg: string | Error | object, desc?: string, type: string = 'error'): LogData {
    const enterInfo = this.getEnterInfo();
    return {
      logid: generateUniqueId(32),
      logtime: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
      msg: Object.prototype.toString.call(msg) === '[object Object]' ? JSON.stringify(msg) : String(msg),
      desc: desc || '',
      type,
      account_appid: this.accountInfo.appId,
      account_env: this.accountInfo.envVersion,
      account_version: this.accountInfo.version,
      device_brand: this.deviceInfo.brand,
      device_model: this.deviceInfo.model,
      device_system: this.deviceInfo.system,
      device_platform: this.deviceInfo.platform,
      device_memory_size: this.deviceInfo.memorySize,
      base_sdk_version: this.appBaseInfo.SDKVersion,
      base_enable_debug: this.appBaseInfo.enableDebug,
      base_language: this.appBaseInfo.language,
      base_version: this.appBaseInfo.version,
      enter_scene: enterInfo.scene,
      enter_path: enterInfo.path,
      enter_query: enterInfo.query,
      enter_refer_info: enterInfo.referrerInfo,
      state: this.uniAppState,
      device_id: this.deviceId,
      version: '',  // 由 Arms 类填充
      appid: '',    // 由 Arms 类填充
      user: '',  // 由 Arms 类填
    };
  }

  /**
   * 获取设备信息
   */
  private getDeviceInfo(): void {
    try {
      const info = uni.getDeviceInfo();
      this.deviceInfo = {
        brand: String(info.brand || ''),
        model: String(info.model || ''),
        system: String(info.system || ''),
        platform: String(info.platform || ''),
        memorySize: String(info.deviceId || '')
      };
    } catch (error: any) {
      console.error('getDeviceInfo error', error?.stack);
    }
  }

  /**
   * 获取应用账号信息
   */
  private getAccountInfo(): void {
    try {
      const info = uni.getAccountInfoSync();
      if (info && info.miniProgram) {
        this.accountInfo = {
          appId: String(info.miniProgram.appId || ''),
          version: String(info.miniProgram.version || ''),
          envVersion: String(info.miniProgram.envVersion || '')
        };
      }
    } catch (error: any) {
      console.error('getAccountInfo error', error?.stack);
    }
  }

  /**
   * 获取应用基础信息
   */
  private getAppBaseInfo(): void {
    try {
      const info = uni.getAppBaseInfo();
      this.appBaseInfo = {
        SDKVersion: String(info.SDKVersion || ''),
        language: String(info.language || ''),
        version: String(info.version || ''),
        enableDebug: String(info.enableDebug || '')
      };
    } catch (error: any) {
      console.error('getAppBaseInfo error', error?.stack);
    }
  }

  /**
   * 获取应用启动信息
   */
  private getEnterInfo(): any {
    try {
      const options = uni.getEnterOptionsSync();
      const path = String(options.path || '');
      const scene = String(options.scene || '');
      const query = options.query ? JSON.stringify(options.query) : '';
      const referrerInfo = options.referrerInfo ? JSON.stringify(options.referrerInfo) : '';
      return {
        path,
        scene,
        query,
        referrerInfo
      };
    } catch (error: any) {
      console.error('getEnterOptionsSync error', error?.stack);
      return {
        path: '',
        scene: '',
        query: '',
        referrerInfo: ''
      };
    }
  }

  /**
   * 初始化应用状态信息
   */
  private initUniAppState(): void {
    try {
      // 监听应用进入前台
      uni.onAppShow(() => {
        this.uniAppState = 'foreground';
      });

      // 监听应用进入后台
      uni.onAppHide(() => {
        this.uniAppState = 'background';
      });
    } catch (error: any) {
      console.error('initUniAppState error', error?.stack);
    }
  }

  /**
   * 初始化设备ID
   */
  private initDeviceId(): void {
    this.deviceId = this.getDeviceId();
  }
} 