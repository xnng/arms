import dayjs from 'dayjs';
import { LogData, UniAppState } from './types';
import { generateUniqueId } from './utils';

// 声明全局wx对象
declare const wx: any;

/**
 * 平台功能实现
 */
export class Platform {
  // uni-app 前台还是在后台
  private uniAppState: UniAppState = ''

  // 设备信息
  private deviceInfo: any = {}

  // 账号信息
  private accountInfo: any = {}

  // 应用基础信息
  private appBaseInfo: any = {}

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
      const newDeviceId = generateUniqueId();
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
      logid: generateUniqueId(),
      logtime: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
      msg: Object.prototype.toString.call(msg) === '[object Object]' ? JSON.stringify(msg) : String(msg),
      desc: desc || '',
      type,
      user: '', 
      version: '',
      appid: '',
      state: this.uniAppState,
      device_id: this.deviceId,
      info_account: JSON.stringify(this.accountInfo),
      info_device: JSON.stringify(this.deviceInfo),
      info_enter: JSON.stringify(enterInfo || {})
    };
  }

  /**
   * 获取设备信息
   */
  private getDeviceInfo(): void {
    try {
      let info =  uni.getDeviceInfo();
      // 检查info是否为Promise对象
      if (info instanceof Promise) {
        // 如果是Promise，那么就代表 uniapp 版本过低还没有这个 api
        info = wx.getDeviceInfo();
      }
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
      let info = uni.getAccountInfoSync();
      // 检查info是否为Promise对象
      if (info instanceof Promise) {
        // 如果是Promise，那么就代表 uniapp 版本过低还没有这个 api
        info = wx.getAccountInfoSync();
      }
      if (info && info.miniProgram) {
        this.accountInfo = info.miniProgram
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
      let info = uni.getAppBaseInfo();
      // 检查info是否为Promise对象
      if (info instanceof Promise) {
        // 如果是Promise，那么就代表 uniapp 版本过低还没有这个 api
        info = wx.getAppBaseInfo();
      }
      this.appBaseInfo = info
    } catch (error: any) {
      console.error('getAppBaseInfo error', error?.stack);
    }
  }

  /**
   * 获取应用启动信息
   */
  private getEnterInfo(): any {
    try {
      let options = uni.getEnterOptionsSync();
      // 检查options是否为Promise对象
      if (options instanceof Promise) {
        // 如果是Promise，那么就代表 uniapp 版本过低还没有这个 api
        options = wx.getEnterOptionsSync();
      }
      return options
    } catch (error: any) {
      console.error('getEnterOptionsSync error', error?.stack);
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