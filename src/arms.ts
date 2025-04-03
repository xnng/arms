import { BaseConfig, LogData } from './types';
import { Platform } from './platform';
import { sleep } from './utils';

/**
 * Arms 类
 */
export class Arms {
  /** 配置 */
  protected config: Required<BaseConfig>;
  /** 上报队列 */
  protected queue: LogData[];
  /** 用户信息 */
  protected user: string;
  /** 平台实现 */
  protected platform: Platform;
  /** 是否正在上报 */
  private isUploading: boolean;
  /** 默认配置 */
  private defaultConfig: Partial<BaseConfig> = {
    maxUploadNum: 10,
    initDelay: 3000,
    emptyQueueWaitTime: 500,
    uploadWaitTime: 1000,
    errorWaitTime: 2000
  };
  /** 是否已初始化 */
  private initialized: boolean;

  /**
   * 构造函数
   */
  constructor() {
    // 创建平台实现
    this.platform = new Platform();
    this.queue = [];
    this.isUploading = false;
    this.user = '';
    this.initialized = false;
    
    // 初始化默认配置
    this.config = this.defaultConfig as Required<BaseConfig>;
  }

  /**
   * 初始化方法
   * @param config 配置
   */
  public init(config: BaseConfig): void {
    if (this.initialized) {
      console.warn('Arms 已经初始化过，请勿重复初始化');
      return;
    }
    
    // 合并默认配置和用户配置
    this.config = { ...this.defaultConfig, ...config } as Required<BaseConfig>;
    this.platform.init();
    
    // 初始化上报队列
    setTimeout(() => {
      this.initialized = true;
      this.runQueue();
    }, this.config.initDelay);
  }

  /**
   * 上报错误
   * @param msg 错误信息
   * @param desc 错误描述
   */
  public async error(msg: string | Error | object, desc?: string): Promise<void> {
    await this.checkInit();
    this.upload(msg, desc, 'error');
  }

  /**
   * 上报信息
   * @param msg 错误信息
   * @param desc 错误描述
   */
  public async info(msg: string | Error | object, desc?: string): Promise<void> {
    await this.checkInit();
    this.upload(msg, desc, 'info');
  }

  /**
   * 上报警告
   * @param msg 错误信息
   * @param desc 错误描述
   */
  public async warn(msg: string | Error | object, desc?: string): Promise<void> {
    await this.checkInit();
    this.upload(msg, desc, 'warn');
  }

  /**
   * 上报埋点
   * @param msg 错误信息
   * @param desc 错误描述
   */
  public async point(msg: string | Error | object, desc?: string): Promise<void> {
    await this.checkInit();
    console.log("point arms")
    this.upload(msg, desc, 'point');
  }

  /**
   * 设置用户信息
   */
  public setUser(user: string | object): void {
    this.user = JSON.stringify(user);
  }

  /**
   * 检查是否已初始化
   */
  private async checkInit(): Promise<void> {
    if (!this.initialized) {
      await sleep(this.config.initDelay)
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
      data.user = this.user;

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

// 默认单例
const arms = new Arms();

// 默认导出单例对象
export default arms;
