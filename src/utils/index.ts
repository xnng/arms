/**
 * 延迟执行函数
 * @param time 延迟时间（毫秒），默认 100ms
 * @returns Promise
 */
export const sleep = (time?: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time || 1000);
  });
};

/**
 * 生成唯一ID
 * @param length ID长度，默认16
 * @param seed 种子字符串，用于生成确定性的ID
 * @returns 唯一ID字符串
 */
export const generateUniqueId = (length = 16, seed?: string): string => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  
  // 如果提供了种子，使用种子生成确定性的起始字符
  let id = '';
  if (seed) {
    // 使用种子的哈希值作为起始字符
    const seedHash = seed.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    id = characters.charAt(seedHash % characters.length);
  } else {
    id = characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  const timestampPart = Date.now().toString(36);
  const randomLength = Math.max(1, length - 1 - timestampPart.length);
  id += timestampPart;
  const allChars = characters + numbers;
  
  // 如果提供了种子，使用种子生成确定性的随机部分
  if (seed) {
    const seedHash = seed.split('').reduce((acc, char, index) => {
      return acc + char.charCodeAt(0) * (index + 1);
    }, 0);
    
    for (let i = 0; i < randomLength; i++) {
      const charIndex = (seedHash + i) % allChars.length;
      id += allChars.charAt(charIndex);
    }
  } else {
    for (let i = 0; i < randomLength; i++) {
      id += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
  }
  
  return id;
};

/**
 * 获取设备唯一标识
 * @param platformType 平台类型
 * @returns 设备唯一标识
 */
export const getDeviceId = (platformType: 'weapp' | 'h5'): string => {
  // 存储键名
  const storageKey = 'arms_device_id';
  
  // 尝试从存储中获取设备ID
  let deviceId = '';
  
  if (platformType === 'weapp') {
    // 小程序平台使用 uni.getStorageSync
    if (typeof uni !== 'undefined') {
      try {
        deviceId = uni.getStorageSync(storageKey);
      } catch (error) {
        console.error('获取设备ID失败', error);
      }
    }
  } else {
    // H5平台使用 localStorage
    if (typeof localStorage !== 'undefined') {
      try {
        deviceId = localStorage.getItem(storageKey) || '';
      } catch (error) {
        console.error('获取设备ID失败', error);
      }
    }
  }
  
  // 如果没有获取到设备ID，则生成一个新的
  if (!deviceId) {
    const newDeviceId = generateUniqueId(32);
    
    // 保存设备ID到存储
    if (platformType === 'weapp') {
      if (typeof uni !== 'undefined') {
        try {
          uni.setStorageSync(storageKey, newDeviceId);
        } catch (error) {
          console.error('保存设备ID失败', error);
        }
      }
    } else {
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem(storageKey, newDeviceId);
        } catch (error) {
          console.error('保存设备ID失败', error);
        }
      }
    }
    
    return newDeviceId;
  }
  
  return deviceId;
};
