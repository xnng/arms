import dayjs from 'dayjs';
import { H5LogData } from '../types/h5';
import { generateUniqueId } from '../utils';
import { IPlatform } from '@/types';
import axios from 'axios';

/**
 * H5平台实现
 */
export class H5Platform implements IPlatform<H5LogData> {
  // 设备ID
  private deviceId: string = '';

  // 网络状态
  private networkType: string = 'unknown';

  // 浏览器信息
  private browserInfo = {
    name: '',
    version: ''
  };

  // 操作系统信息
  private osInfo = {
    name: '',
    version: ''
  };

  // 屏幕信息
  private screenInfo = {
    width: '',
    height: ''
  };

  /**
   * 初始化平台信息
   */
  public init(): void {
    this.detectBrowser();
    this.detectOS();
    this.getScreenInfo();
    this.getNetworkType();
    this.initDeviceId();
    this.setupErrorListener();
  }

  /**
 * 上传日志
 */
  public async uploadLog(logs: H5LogData[], slsUrl: string): Promise<void> {
    try {
      // 使用 axios 上报日志
      await axios.post(slsUrl, logs, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('上报日志失败', error);
      throw error;
    }
  }

  /**
   * 获取设备ID
   */
  public getDeviceId(): string {
    const storageKey = 'arms_device_id';
    // 尝试从存储中获取设备ID
    let deviceId = '';
    deviceId = localStorage.getItem(storageKey) || '';

    // 如果没有获取到设备ID，则生成一个新的
    if (!deviceId) {
      const newDeviceId = generateUniqueId(32);
      localStorage.setItem(storageKey, newDeviceId);
      return newDeviceId;
    }
    return deviceId;
  }

  /**
   * 获取平台特定的日志数据
   */
  public getLogData(msg: string | Error | object, desc?: string, type: string = 'error'): H5LogData {
    return {
      logid: generateUniqueId(32),
      version: '',  // 由 Arms 类填充
      appid: '',    // 由 Arms 类填充
      logtime: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
      msg: Object.prototype.toString.call(msg) === '[object Object]' ? JSON.stringify(msg) : String(msg),
      desc: desc || '',
      type,
      browser_name: this.browserInfo.name,
      browser_version: this.browserInfo.version,
      os_name: this.osInfo.name,
      os_version: this.osInfo.version,
      screen_width: this.screenInfo.width,
      screen_height: this.screenInfo.height,
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      page_title: typeof document !== 'undefined' ? document.title : '',
      page_referrer: typeof document !== 'undefined' ? document.referrer : '',
      network_type: this.networkType,
      device_id: this.deviceId,
      user_key_1: '',  // 由 Arms 类填充
      user_key_2: '',  // 由 Arms 类填充
      user_key_3: '',  // 由 Arms 类填充
      user_key_4: '',  // 由 Arms 类填充
      user_key_5: '',  // 由 Arms 类填充
      user_key_6: ''   // 由 Arms 类填充
    };
  }

  /**
   * 检测浏览器类型和版本
   */
  private detectBrowser(): void {
    if (typeof navigator === 'undefined') return;

    const userAgent = navigator.userAgent;
    let browserName = '';
    let browserVersion = '';

    // 检测常见浏览器
    if (userAgent.indexOf('Firefox') > -1) {
      browserName = 'Firefox';
      browserVersion = userAgent.match(/Firefox\/([\d.]+)/)?.[1] || '';
    } else if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Edge') === -1 && userAgent.indexOf('Edg') === -1) {
      browserName = 'Chrome';
      browserVersion = userAgent.match(/Chrome\/([\d.]+)/)?.[1] || '';
    } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
      browserName = 'Safari';
      browserVersion = userAgent.match(/Version\/([\d.]+)/)?.[1] || '';
    } else if (userAgent.indexOf('Edge') > -1) {
      browserName = 'Edge Legacy';
      browserVersion = userAgent.match(/Edge\/([\d.]+)/)?.[1] || '';
    } else if (userAgent.indexOf('Edg') > -1) {
      browserName = 'Edge Chromium';
      browserVersion = userAgent.match(/Edg\/([\d.]+)/)?.[1] || '';
    } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
      browserName = 'Internet Explorer';
      const msieRegex = userAgent.match(/MSIE ([\d.]+)/);
      const tridentRegex = userAgent.match(/rv:([\d.]+)/);
      browserVersion = msieRegex?.[1] || tridentRegex?.[1] || '';
    } else {
      browserName = 'Unknown';
      browserVersion = '';
    }

    this.browserInfo = {
      name: browserName,
      version: browserVersion
    };
  }

  /**
   * 检测操作系统类型和版本
   */
  private detectOS(): void {
    if (typeof navigator === 'undefined') return;

    const userAgent = navigator.userAgent;
    let osName = '';
    let osVersion = '';

    // 检测常见操作系统
    if (userAgent.indexOf('Windows') > -1) {
      osName = 'Windows';
      if (userAgent.indexOf('Windows NT 10.0') > -1) osVersion = '10';
      else if (userAgent.indexOf('Windows NT 6.3') > -1) osVersion = '8.1';
      else if (userAgent.indexOf('Windows NT 6.2') > -1) osVersion = '8';
      else if (userAgent.indexOf('Windows NT 6.1') > -1) osVersion = '7';
      else if (userAgent.indexOf('Windows NT 6.0') > -1) osVersion = 'Vista';
      else if (userAgent.indexOf('Windows NT 5.1') > -1) osVersion = 'XP';
      else osVersion = 'Unknown';
    } else if (userAgent.indexOf('Mac') > -1) {
      osName = 'MacOS';
      const macVersionMatch = userAgent.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
      if (macVersionMatch) {
        osVersion = macVersionMatch[1].replace(/_/g, '.');
      } else {
        osVersion = 'Unknown';
      }
    } else if (userAgent.indexOf('Android') > -1) {
      osName = 'Android';
      const androidVersionMatch = userAgent.match(/Android (\d+(\.\d+)+)/);
      osVersion = androidVersionMatch?.[1] || 'Unknown';
    } else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
      osName = 'iOS';
      const iosVersionMatch = userAgent.match(/OS (\d+[._]\d+[._]?\d*)/);
      if (iosVersionMatch) {
        osVersion = iosVersionMatch[1].replace(/_/g, '.');
      } else {
        osVersion = 'Unknown';
      }
    } else if (userAgent.indexOf('Linux') > -1) {
      osName = 'Linux';
      osVersion = 'Unknown';
    } else {
      osName = 'Unknown';
      osVersion = 'Unknown';
    }

    this.osInfo = {
      name: osName,
      version: osVersion
    };
  }

  /**
   * 获取屏幕信息
   */
  private getScreenInfo(): void {
    if (typeof window === 'undefined' || typeof screen === 'undefined') return;

    this.screenInfo = {
      width: String(screen.width || window.innerWidth || 0),
      height: String(screen.height || window.innerHeight || 0)
    };
  }

  /**
   * 获取网络类型
   */
  private getNetworkType(): void {
    if (typeof navigator === 'undefined') return;

    // 使用 Navigator.connection API (如果可用)
    const connection = (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    if (connection) {
      this.networkType = connection.effectiveType || connection.type || 'unknown';
    } else {
      this.networkType = 'unknown';
    }

    // 监听网络状态变化
    if (connection) {
      connection.addEventListener('change', () => {
        this.networkType = connection.effectiveType || connection.type || 'unknown';
      });
    }
  }

  /**
   * 设置全局错误监听
   */
  private setupErrorListener(): void {
    if (typeof window === 'undefined') return;

    // 这里只是预留接口，实际的错误处理会在 H5Arms 类中实现
  }

  /**
   * 初始化设备ID
   */
  private initDeviceId(): void {
    this.deviceId = this.getDeviceId()
  }
}
