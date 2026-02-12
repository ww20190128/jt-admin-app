// passWordUtils.js
import RSAEncryption from "./rsaencryption.js";
import { SSLPublicKey } from "./sslpublickey.js";

export default class PassWordUtils {
  static Forge = null;
  static EncryptFunc = () => {};

  static async BrowserEncrypt(password) {
    // 空值容错
    if (!password) return "";
    PassWordUtils.Forge = new RSAEncryption();

    try {
      await PassWordUtils.Forge.importPublicKey(SSLPublicKey.PublicSSLKey);
      return await PassWordUtils.Forge.encrypt(password);
    } catch (err) {
      console.error("密码加密失败：", err); // 补充错误日志
      return "";
    }
  }

  /**
   * 根据服务器要求校验密码（复杂规则）
   * @param {string} password 密码
   * @return {boolean} 校验结果
   */
  static isValid(password) {
    let result = PassWordUtils.checkPassword2(password);
    return result[0];
  }

  /**
   * 复杂密码校验：6-12位，含数字、大写字母、特殊字符
   * @param {string} password 密码
   * @return {[boolean, string]} [校验结果, 错误信息]
   */
  static checkPassword2(password) {
    // 空值处理
    if (!password) return [false, "密码不能为空"];

    // 长度校验
    if (password.length < 6 || password.length > 12) {
      return [false, "密码长度为6-12位"];
    }

    // 正则校验
    const hasUpperCase = /[A-Z]/.test(password); // 必须有大写字母
    const hasNumber = /[0-9]/.test(password); // 必须有数字
    const hasSpecialChar = /[!@#~$%^&*()+|_.,]/.test(password); // 必须有特殊字符

    // 修复大写字母校验逻辑
    if (!hasUpperCase) {
      return [false, "至少有一个大写字母"];
    }
    if (!hasNumber) {
      return [false, "密码必须包含数字"];
    }
    if (!hasSpecialChar) {
      return [false, "密码必须包含特殊字符"];
    }

    return [true, ""];
  }

  /**
   * 简单密码校验：6-12位，仅数字和字母
   * @param {string} password 密码
   * @return {[boolean, string]} [校验结果, 错误信息]
   */
  static checkPassword(password) {
    if (!password) return [false, "密码不能为空"];

    if (password.length < 6 || password.length > 12) {
      return [false, "密码长度为6-12位"];
    }

    // 补充「仅数字和字母」的校验（和注释匹配）
    if (!PassWordUtils.isNumberOrLetter(password)) {
      return [false, "密码只能包含数字和字母"];
    }

    return [true, ""];
  }

  /**
   * 检测字符串是否仅含数字和字母
   * @param {string} str 字符串
   * @return {boolean}
   */
  static isNumberOrLetter(str) {
    return /^[0-9a-zA-Z]+$/.test(str);
  }

  /**
   * 【注意】此方法暂不可用（Forge无md5方法），需补充md5依赖
   * @param {string} password 密码
   * @return {string}
   */
  static MD5(password) {
    console.error("MD5方法暂未实现：Forge实例无md5方法");
    // 如需使用MD5，需引入md5库（如crypto-js），示例：
    // import md5 from 'crypto-js/md5';
    // return md5(password).toString().toLowerCase();
    return "";
  }
}
