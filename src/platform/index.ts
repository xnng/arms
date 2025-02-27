import { WeappConfig, DeviceInfo, AppBaseInfo } from '../types';

// 微信小程序账号信息
export const weappConfig: WeappConfig = {
  appId: '',
  version: '',
  envVersion: ''
};

// 设备信息
export const deviceInfo: DeviceInfo = {
  brand: '',
  model: '',
  system: '',
  platform: '',
  cpuType: '',
  memorySize: ''
};

// 应用基础信息
export const appBaseInfo: AppBaseInfo = {
  SDKVersion: '',
  enableDebug: '',
  language: '',
  version: '',
  fontSizeScaleFactor: '',
  fontSizeSetting: ''
};

// 小程序启动信息
export const launchInfo = {
  scene: '',
  query: '',
  referrerInfo: ''
};

// 应用生命周期信息
export const weappStateInfo = {
  state: 'foreground' // foreground 或 background
};

/**
 * 获取小程序账号信息
 */
export const getAccountInfo = (): void => {
  try {
    const { envVersion, appId, version } = uni.getAccountInfoSync().miniProgram;
    weappConfig.appId = String(appId);
    weappConfig.envVersion = String(envVersion);
    weappConfig.version = String(version);
  } catch (error: any) {
    console.log('getAccountInfoSync error', error?.stack);
  }
};

/**
 * 获取小程序启动信息
 */
export const getLaunchInfo = (): void => {
  try {
    const options = uni.getEnterOptionsSync();
    launchInfo.scene = String(options.scene || '');
    launchInfo.query = options.query ? JSON.stringify(options.query) : '';
    launchInfo.referrerInfo = options.referrerInfo ? JSON.stringify(options.referrerInfo) : '';
  } catch (error: any) {
    console.log('getEnterOptionsSync error', error?.stack);
  }
};

/**
 * 获取设备信息
 */
export const getDeviceInfo = (): void => {
  try {
    const device = wx.getDeviceInfo();
    deviceInfo.brand = String(device.brand);
    deviceInfo.model = String(device.model);
    deviceInfo.system = String(device.system);
    deviceInfo.platform = String(device.platform);
    deviceInfo.cpuType = String(device.cpuType);
    deviceInfo.memorySize = String(device.memorySize);
  } catch (error: any) {
    console.log('getDeviceInfo error', error?.stack);
  }
};

/**
 * 获取应用基础信息
 */
export const getAppBaseInfo = (): void => {
  try {
    const result = wx.getAppBaseInfo();
    appBaseInfo.SDKVersion = String(result.SDKVersion);
    appBaseInfo.enableDebug = String(result.enableDebug);
    appBaseInfo.language = String(result.language);
    appBaseInfo.version = String(result.version);
    appBaseInfo.fontSizeScaleFactor = String(result.fontSizeScaleFactor);
    appBaseInfo.fontSizeSetting = String(result.fontSizeSetting);
  } catch (error: any) {
    console.log('getAppBaseInfo error', error?.stack);
  }
};

/**
 * 初始化应用生命周期信息
 */
export const initWeappState = (): void => {
  try {
    // 监听应用进入前台
    uni.onAppShow(() => {
      weappStateInfo.state = 'foreground';
    });
    
    // 监听应用进入后台
    uni.onAppHide(() => {
      weappStateInfo.state = 'background';
    });
  } catch (error: any) {
    console.log('initWeappState error', error?.stack);
  }
};
