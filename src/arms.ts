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
  /** 用户自定义键值对 */
  protected userKeys: { [key: number]: string } = {};
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
    errorWaitTime: 2000,
    autoCapture: false
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
    
    // 如果开启了自动捕获，则设置错误监听
    if (this.config.autoCapture) {
      this.setupAutoCapture();
    }
    
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
    this.upload(msg, desc, 'point');
  }

  /**
   * 设置用户信息
   */
  public setUser(user: string | object): void {
    this.user = JSON.stringify(user);
  }

  /**
   * 设置用户自定义键值
   * @param index 键索引，范围 1-6
   * @param value 键值
   */
  public setUserKey(index: number, value: string): void {
    if (index < 1 || index > 6) {
      console.warn('setUserKey: index 必须在 1-6 范围内');
      return;
    }
    this.userKeys[index] = value;
  }

  /**
   * 设置自动捕获错误
   */
  private setupAutoCapture(): void {
    try {
      // 捕获未处理的 Promise 错误
      if (typeof window !== 'undefined') {
        window.addEventListener('unhandledrejection', (event) => {
          this.error(event.reason, 'Unhandled Promise Rejection');
        });
        
        // 捕获全局错误
        window.addEventListener('error', (event) => {
          this.error(event.error || event.message, 'Global Error');
        });
      }
    } catch (error) {
      console.error('设置自动捕获失败', error);
    }
  }

  /**
   * 检查是否已初始化
   */
  private async checkInit(): Promise<void> {
    if (!this.initialized) {
      // 使用轮询方式等待初始化完成，避免固定延迟可能导致的问题
      const maxWaitTime = this.config.initDelay + 5000; // 额外等待5秒作为超时保护
      const pollInterval = 100; // 每100ms检查一次
      let waitedTime = 0;
      
      while (!this.initialized && waitedTime < maxWaitTime) {
        await sleep(pollInterval);
        waitedTime += pollInterval;
      }
      
      if (!this.initialized) {
        console.warn('Arms 初始化超时，但仍继续执行');
      }
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

      // 填充用户自定义键值
      for (let i = 1; i <= 6; i++) {
        (data as any)[`user_key_${i}`] = this.userKeys[i] || '';
      }

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
