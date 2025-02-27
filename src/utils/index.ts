/**
 * 延迟执行函数
 * @param time 延迟时间（毫秒）
 * @returns Promise
 */
export const sleep = (time: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

/**
 * 生成唯一ID
 * @param length ID长度，默认16
 * @returns 唯一ID字符串
 */
export const generateUniqueId = (length = 16): string => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  let id = characters.charAt(Math.floor(Math.random() * characters.length));
  const timestampPart = Date.now().toString(36);
  const randomLength = Math.max(1, length - 1 - timestampPart.length);
  id += timestampPart;
  const allChars = characters + numbers;
  for (let i = 0; i < randomLength; i++) {
    id += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  return id;
};

/**
 * 获取设备唯一标识
 * @returns 设备唯一标识
 */
export const getDeviceId = (): string => {
  try {
    // 尝试从本地存储获取设备 ID
    const deviceId = uni.getStorageSync('arms_device_id');

    // 如果已存在，直接返回
    if (deviceId) {
      return deviceId;
    }

    // 如果不存在，生成新的设备 ID
    const newDeviceId = generateUniqueId(32);

    // 存储到本地
    uni.setStorageSync('arms_device_id', newDeviceId);

    return newDeviceId;
  } catch (error) {
    console.log('获取设备 ID 出错', error);
    return ''
  }
};
