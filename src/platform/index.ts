import { IPlatform, BaseLogData } from '../types';
import { WeappPlatform } from './weapp';
import { H5Platform } from './h5';

/**
 * 平台类型枚举
 */
export enum PlatformType {
  /** 微信小程序 */
  WEAPP = 'weapp',
  /** H5 */
  H5 = 'h5'
}

/**
 * 平台工厂类
 */
export class PlatformFactory {
  /**
   * 创建平台实例
   * @param type 平台类型
   * @returns 平台实例
   */
  public static createPlatform<T extends BaseLogData>(type: PlatformType): IPlatform<T> {
    switch (type) {
      case PlatformType.WEAPP:
        return new WeappPlatform() as unknown as IPlatform<T>;
      case PlatformType.H5:
        return new H5Platform() as unknown as IPlatform<T>;
      default:
        throw new Error(`不支持的平台类型: ${type}`);
    }
  }
}