import dayjs from 'dayjs';
import { ArmsConfig, LogData } from './types';
import { sleep, generateUniqueId, getDeviceId } from './utils';
import {
  weappConfig,
  deviceInfo,
  appBaseInfo,
  launchInfo,
  getAccountInfo,
  getDeviceInfo,
  getAppBaseInfo,
  getLaunchInfo
} from './platform';

/**
 * Arms 监控上报类
 */
export class Arms {
  private config: Required<ArmsConfig>;
  private tasks: LogData[] = [];
  private running: boolean = false;

  // 用户自定义键值
  private user_key_1: string = '';
  private user_key_2: string = '';
  private user_key_3: string = '';
  private user_key_4: string = '';
  private user_key_5: string = '';
  private user_key_6: string = '';

  /**
   * 构造函数
   * @param config 配置项
   */
  constructor(config: ArmsConfig) {
    // 默认配置
    const defaultConfig: Omit<Required<ArmsConfig>, keyof ArmsConfig> = {
      // 单次最大上传数量
      maxUploadNum: 10,
      // 初始化延迟时间（毫秒）
      initDelay: 2000,
      // 无任务等待时间（毫秒）
      emptyQueueWaitTime: 1000,
      // 上传后等待时间（毫秒）
      uploadWaitTime: 1000,
      // 错误后等待时间（毫秒）
      errorWaitTime: 3000
    };

    // 合并默认配置和用户配置
    this.config = { ...defaultConfig, ...config } as Required<ArmsConfig>;

    // 初始化上报队列
    setTimeout(() => {
      this.runQueue();
    }, this.config.initDelay);
  }

  /**
   * 上报错误信息
   * @param stack 错误堆栈
   * @param desc 错误描述
   */
  public error(stack: string, desc?: string): void {
    this.upload('error', stack, desc);
  }

  /**
   * 设置用户自定义键值
   * @param key 键名，支持 user_key_1 到 user_key_6
   * @param value 键值，会被转换为字符串
   */
  public setUserKey(key: string, value: any): void {
    try {
      // 检查键名是否合法
      if (!/^user_key_[1-6]$/.test(key)) {
        console.log('无效的键名，应为 user_key_1 到 user_key_6');
        return;
      }

      // 将值转换为字符串
      const strValue = Object.prototype.toString.call(value) === '[object Object]' ?
        JSON.stringify(value) : String(value);

      // 使用类型断言安全地设置属性
      (this as any)[key] = strValue;
    } catch (error) {
      console.log('设置用户自定义键值出错', error);
    }
  }

  /**
   * 上报日志信息
   * @param type 日志类型
   * @param stack 错误堆栈
   * @param desc 错误描述
   * @private 私有方法，不对外暴露
   */
  private upload(type: string, msg: any, desc?: string): void {
    try {
      // 确保获取到小程序账号信息
      if (!weappConfig.appId) {
        getAccountInfo();
      }

      // 确保获取到设备信息
      if (!deviceInfo.brand || !deviceInfo.model) {
        getDeviceInfo();
      }

      // 确保获取到应用基础信息
      if (!appBaseInfo.SDKVersion || !appBaseInfo.language) {
        getAppBaseInfo();
      }

      // 确保获取到小程序启动信息
      if (!launchInfo.scene) {
        getLaunchInfo();
      }

      // 获取当前页面路径
      let pagePath = '';
      try {
        const pages = uni.getCurrentPages();
        if (pages && pages.length > 0) {
          // 获取当前页面（数组最后一个元素）
          const currentPage = pages[pages.length - 1];
          pagePath = currentPage.route || currentPage.__route__ || '';
        }
      } catch (error) {
        console.log('获取当前页面路径出错', error);
      }

      // 构建日志数据
      const data: LogData = {
        logid: generateUniqueId(32),
        version: this.config.appVersion,
        appid: this.config.appId,
        logtime: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
        msg: Object.prototype.toString.call(msg) === '[object Object]' ? JSON.stringify(msg) : String(msg),
        desc: desc || '',
        page_path: pagePath,
        type,
        weapp_account_appid: weappConfig.appId,
        weapp_account_env: weappConfig.envVersion,
        weapp_account_version: weappConfig.version,
        weapp_device_brand: deviceInfo.brand,
        weapp_device_model: deviceInfo.model,
        weapp_device_system: deviceInfo.system,
        weapp_device_platform: deviceInfo.platform,
        weapp_device_cpu_type: deviceInfo.cpuType,
        weapp_device_memory_size: deviceInfo.memorySize,
        weapp_base_sdk_version: appBaseInfo.SDKVersion,
        weapp_base_enable_debug: appBaseInfo.enableDebug,
        weapp_base_language: appBaseInfo.language,
        weapp_base_version: appBaseInfo.version,
        weapp_base_font_size_scale_factor: appBaseInfo.fontSizeScaleFactor,
        weapp_base_font_size_setting: appBaseInfo.fontSizeSetting,
        weapp_scene: launchInfo.scene,
        weapp_query: launchInfo.query,
        weapp_refer_info: launchInfo.referrerInfo,
        device_id: getDeviceId(),
        user_key_1: this.user_key_1,
        user_key_2: this.user_key_2,
        user_key_3: this.user_key_3,
        user_key_4: this.user_key_4,
        user_key_5: this.user_key_5,
        user_key_6: this.user_key_6,
      };

      // 添加到上报队列
      this.tasks.push(data);
    } catch (error) {
      console.log('日志方法出错');
    }
  }

  /**
   * 运行上报队列
   */
  private async runQueue(): Promise<void> {
    // 防止重复运行
    if (this.running) return;
    this.running = true;

    while (true) {
      try {
        // 没有任务时等待
        if (this.tasks.length === 0) {
          await sleep(this.config.emptyQueueWaitTime);
          continue;
        }

        // 从队列中取出任务，最多取 maxUploadNum 个
        const tasksToUpload = this.tasks.splice(0, this.config.maxUploadNum);

        if (tasksToUpload.length > 0) {
          await uni.request({
            url: this.config.slsUrl,
            method: 'POST',
            header: {
              'x-log-apiversion': '0.6.0'
            },
            data: {
              '__logs__': tasksToUpload
            }
          });
        }

        // 每次上传后等待一段时间
        await sleep(this.config.uploadWaitTime);
      } catch (error) {
        console.log('日志上传出错', error);
        // 出错后等待一段时间再重试
        await sleep(this.config.errorWaitTime);
      }
    }
  }
}
