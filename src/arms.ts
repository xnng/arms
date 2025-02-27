import { BaseConfig, IPlatform, LogData } from './types';
import { PlatformType, PlatformFactory } from './platform';
import { sleep } from './utils';

/**
 * Arms 类
 */
export class Arms {
  /** 配置 */
  protected config: Required<BaseConfig>;
  /** 上报队列 */
  protected queue: LogData[];
  /** 用户自定义键1 */
  protected user_key_1: string;
  /** 用户自定义键2 */
  protected user_key_2: string;
  /** 用户自定义键3 */
  protected user_key_3: string;
  /** 用户自定义键4 */
  protected user_key_4: string;
  /** 用户自定义键5 */
  protected user_key_5: string;
  /** 用户自定义键6 */
  protected user_key_6: string;
  /** 平台实现 */
  protected platform: IPlatform<LogData>;
  /** 是否正在上报 */
  private isUploading: boolean;
  /** 默认配置 */
  private defaultConfig: Partial<BaseConfig> = {
    maxUploadNum: 10,
    initDelay: 2000,
    emptyQueueWaitTime: 1000,
    uploadWaitTime: 1000,
    errorWaitTime: 3000
  };

  /**
   * 构造函数
   * @param config 配置
   * @param platformType 平台类型
   */
  constructor(config: BaseConfig, platformType: PlatformType) {
    // 创建对应平台的实现
    this.platform = PlatformFactory.createPlatform(platformType) as IPlatform<LogData>;

    // 合并默认配置和用户配置
    this.config = { ...this.defaultConfig, ...config } as Required<BaseConfig>;
    this.platform.init();
    this.queue = [];
    this.isUploading = false;
    this.user_key_1 = '';
    this.user_key_2 = '';
    this.user_key_3 = '';
    this.user_key_4 = '';
    this.user_key_5 = '';
    this.user_key_6 = '';

    // 初始化上报队列
    setTimeout(() => {
      this.runQueue();
    }, this.config.initDelay);
  }

  /**
   * 上报错误
   * @param msg 错误信息
   * @param desc 错误描述
   */
  public error(msg: string | Error | object, desc?: string): void {
    this.upload(msg, desc, 'error');
  }

  /**
   * 设置用户自定义键
   * @param index 键索引
   * @param value 键值
   */
  public setUserKey(index: number, value: string): void {
    if (index < 1 || index > 6) {
      console.error('用户自定义键索引必须在1-6之间');
      return;
    }

    switch (index) {
      case 1:
        this.user_key_1 = value;
        break;
      case 2:
        this.user_key_2 = value;
        break;
      case 3:
        this.user_key_3 = value;
        break;
      case 4:
        this.user_key_4 = value;
        break;
      case 5:
        this.user_key_5 = value;
        break;
      case 6:
        this.user_key_6 = value;
        break;
    }
  }

  /**
   * 上传日志
   * @param msg 日志信息
   * @param desc 日志描述
   * @param type 日志类型
   */
  protected upload(msg: string | Error | object, desc?: string, type: string = 'error'): void {
    try {
      // 处理 Error 对象
      if (msg instanceof Error) {
        const error = msg;
        msg = error.stack || error.message
      }

      // 获取平台特定的日志数据
      const data = this.platform.getLogData(msg, desc, type);

      // 填充通用字段
      data.version = this.config.appVersion;
      data.appid = this.config.appId;
      data.user_key_1 = this.user_key_1;
      data.user_key_2 = this.user_key_2;
      data.user_key_3 = this.user_key_3;
      data.user_key_4 = this.user_key_4;
      data.user_key_5 = this.user_key_5;
      data.user_key_6 = this.user_key_6;

      // 添加到上报队列
      this.queue.push(data);
    } catch (error) {
      console.error('构建日志数据出错', error);
    }
  }

  /**
   * 运行上报队列
   */
  private async runQueue(): Promise<void> {
    while (true) {
      try {
        // 队列为空，等待一段时间
        if (this.queue.length === 0) {
          await sleep(this.config.emptyQueueWaitTime);
          continue;
        }

        // 已经在上报中，等待下一次循环
        if (this.isUploading) {
          await sleep(100);
          continue;
        }

        // 开始上报
        this.isUploading = true;

        // 从队列中取出指定数量的日志
        const logs = this.queue.splice(0, this.config.maxUploadNum);

        // 上报日志
        try {
          await this.platform.uploadLog(logs, this.config.slsUrl);
          // 上报成功后等待一段时间
          await sleep(this.config.uploadWaitTime);
        } catch (error) {
          console.error('上报日志出错', error);
          // 上报失败后等待一段时间
          await sleep(this.config.errorWaitTime);
        } finally {
          // 结束上报
          this.isUploading = false;
        }
      } catch (error) {
        console.error('运行上报队列出错', error);
        await sleep(this.config.errorWaitTime);
      }
    }
  }
}

/**
 * 创建 Arms 实例
 * @param config 配置
 * @param platformType 平台类型
 * @returns Arms 实例
 */
export function createArms(config: BaseConfig, platformType: PlatformType) {
  return new Arms(config, platformType);
}
