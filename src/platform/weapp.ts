import dayjs from 'dayjs';
import { IPlatform } from '../types';
import { generateUniqueId } from '../utils';
import { AppBaseInfo, DeviceInfo, WeappAccountInfo, WeappLogData, WeappState } from '@/types/weapp';

/**
 * 小程序平台实现
 */
export class WeappPlatform implements IPlatform<WeappLogData> {

  // 小程序前台还是在后台
  private weappState: WeappState = ''

  // 设备信息
  private deviceInfo: DeviceInfo = {
    brand: '',
    model: '',
    system: '',
    platform: '',
    cpuType: '',
    memorySize: ''
  };

  // 小程序账号信息
  private accountInfo: WeappAccountInfo = {
    appId: '',
    version: '',
    envVersion: ''
  };

  // 应用基础信息
  private appBaseInfo: AppBaseInfo = {
    SDKVersion: '',
    language: '',
    version: '',
    fontSizeScaleFactor: '',
    fontSizeSetting: '',
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
    this.initWeappState();
    this.initDeviceId();
  }

  /**
   * 上传日志
   */
  public async uploadLog(logs: WeappLogData[], slsUrl: string): Promise<void> {
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
   * 获取平台特定的日志数据
   */
  public getLogData(msg: string | Error | object, desc?: string, type: string = 'error'): WeappLogData {
    const enterInfo = this.getEnterInfo();
    return {
      logid: generateUniqueId(32),
      logtime: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
      msg: Object.prototype.toString.call(msg) === '[object Object]' ? JSON.stringify(msg) : String(msg),
      desc: desc || '',
      type,
      weapp_account_appid: this.accountInfo.appId,
      weapp_account_env: this.accountInfo.envVersion,
      weapp_account_version: this.accountInfo.version,
      device_brand: this.deviceInfo.brand,
      device_model: this.deviceInfo.model,
      device_system: this.deviceInfo.system,
      device_platform: this.deviceInfo.platform,
      device_cpu_type: this.deviceInfo.cpuType,
      device_memory_size: this.deviceInfo.memorySize,
      weapp_base_sdk_version: this.appBaseInfo.SDKVersion,
      weapp_base_enable_debug: this.appBaseInfo.enableDebug,
      weapp_base_language: this.appBaseInfo.language,
      weapp_base_version: this.appBaseInfo.version,
      weapp_base_font_size_scale_factor: this.appBaseInfo.fontSizeScaleFactor,
      weapp_base_font_size_setting: this.appBaseInfo.fontSizeSetting,
      weapp_enter_scene: enterInfo.scene,
      weapp_enter_path: enterInfo.path,
      weapp_enter_query: enterInfo.query,
      weapp_enter_refer_info: enterInfo.referrerInfo,
      weapp_state: this.weappState,
      device_id: this.deviceId,
      version: '',  // 由 Arms 类填充
      appid: '',    // 由 Arms 类填充
      user_key_1: '',  // 由 Arms 类填充
      user_key_2: '',  // 由 Arms 类填充
      user_key_3: '',  // 由 Arms 类填充
      user_key_4: '',  // 由 Arms 类填充
      user_key_5: '',  // 由 Arms 类填充
      user_key_6: ''   // 由 Arms 类填充
    };
  }

  /**
   * 获取设备信息
   */
  private getDeviceInfo(): void {
    try {
      const info = uni.getSystemInfoSync();
      this.deviceInfo = {
        brand: String(info.brand || ''),
        model: String(info.model || ''),
        system: String(info.system || ''),
        platform: String(info.platform || ''),
        cpuType: String(info.cpuType || ''),
        memorySize: String(info.memorySize || '')
      };
    } catch (error: any) {
      console.error('getDeviceInfo error', error?.stack);
    }
  }

  /**
   * 获取小程序账号信息
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
      const info = uni.getSystemInfoSync();
      this.appBaseInfo = {
        SDKVersion: String(info.SDKVersion || ''),
        language: String(info.language || ''),
        version: String(info.version || ''),
        fontSizeScaleFactor: String(info.fontSizeScaleFactor || ''),
        fontSizeSetting: String(info.fontSizeSetting || ''),
        enableDebug: String(info.enableDebug || '')
      };
    } catch (error: any) {
      console.error('getAppBaseInfo error', error?.stack);
    }
  }

  /**
   * 获取小程序启动信息
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
   * 初始化小程序状态信息
   */
  private initWeappState(): void {
    try {
      // 监听应用进入前台
      uni.onAppShow(() => {
        this.weappState = 'foreground';
      });

      // 监听应用进入后台
      uni.onAppHide(() => {
        this.weappState = 'background';
      });
    } catch (error: any) {
      console.error('initWeappState error', error?.stack);
    }
  }

  /**
   * 初始化设备ID
   */
  private initDeviceId(): void {
    this.deviceId = this.getDeviceId();
  }
}
