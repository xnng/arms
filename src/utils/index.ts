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