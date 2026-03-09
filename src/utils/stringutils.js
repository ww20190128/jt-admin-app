/**
 * 字符串工具类 - JavaScript 版本
 */
export const StringUtils = {
  /**
   * 限制字符串的长度，超出部分显示为省略号（区分中英文，中文算2个字符）
   * @param {string} str - 要处理的字符串
   * @param {number} limitLen - 限制的字符长度
   * @returns {string} 处理后的字符串
   */
  limitString: function (str, limitLen) {
    // 容错处理：非字符串转为空字符串，长度非数字设为0
    str = typeof str === "string" ? str : "";
    let b = typeof limitLen === "number" ? limitLen : 0;
    let init = 0;
    let newVal = "";

    // 计算字符串总长度（中文2个字符，英文1个字符）
    let totalLen = 0;
    for (let i = 0; i < str.length; i++) {
      totalLen += str.charCodeAt(i) > 255 ? 2 : 1;
    }

    // 截取指定长度的字符串
    for (let i = 0; i < str.length; i++) {
      if (init <= b) {
        newVal += str[i];
        init += str.charCodeAt(i) > 255 ? 2 : 1;
      } else {
        break; // 超出长度后终止循环，优化性能
      }
    }

    return newVal + (totalLen > b ? "..." : "");
  },

  /**
   * 秒数转为分秒格式字符串（HH:MM）
   * @param {number} second - 总秒数
   * @returns {string} 格式化后的分秒字符串
   */
  secondToHMString: function (second) {
    // 容错处理：非数字设为0
    const sec = typeof second === "number" ? second : 0;
    const h = Math.floor(sec / 60);
    const s = sec % 60;
    // 补零处理，确保两位数
    return h.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0");
  },

  /**
   * 判断传入值是否为字符串类型
   * @param {any} postData - 要判断的值
   * @returns {boolean} 是否为字符串
   */
  isString: function (postData) {
    return typeof postData === "string";
  },

  /**
   * 生成指定长度的随机字符串
   * @param {number} len - 随机字符串长度
   * @returns {string} 随机字符串
   */
  randomNonce: function (len) {
    // 容错处理：长度小于1时设为8
    const length = typeof len === "number" && len > 0 ? len : 8;
    const CHARS = "1234567890-)(*&^%$#@!+qwertyuioplkjhgfdsazxcvbnm";
    let out = "";

    for (let i = 0; i < length; i++) {
      const idx = Math.floor(Math.random() * CHARS.length);
      out += CHARS.charAt(idx);
    }
    return out;
  },

  buildQuery: function (params) {
    const qs = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (Array.isArray(value)) {
        // 每个数组元素单独 append，key 带 [] 符号
        value.forEach((v) => qs.append(`${key}[]`, String(v)));
      } else {
        qs.append(key, String(value));
      }
    });

    return qs.toString().replace(/%5B%5D/g, "[]");
  },
};
