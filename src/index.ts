import arms, { Arms } from './arms';
import { BaseConfig } from './types';

/**
 * 创建 Arms 实例
 * @param config 配置参数
 * @returns Arms 实例
 */
export function createArms(config: BaseConfig): Arms {
  const instance = new Arms();
  instance.init(config);
  return instance;
}

// 导出类型
export type { BaseConfig, LogData } from './types';

// 导出 Arms 类
export { Arms };

// 默认导出单例对象
export default arms;
