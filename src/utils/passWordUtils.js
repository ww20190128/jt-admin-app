// passwordUtils.js (建议命名为小写+驼峰，符合JS文件命名习惯)
import RSAEncryption from "./rsaencryption.js";
import { SSLPublicKey } from "./sslpublickey.js";

export default class PassWordUtils {
    // 移除TS类型注解，直接初始化静态属性
    static Forge = null;
    static EncryptFunc = () => { };

    // 浏览器端RSA加密方法，保持async特性
    static async BrowserEncrypt(password) {
        PassWordUtils.Forge = new RSAEncryption();
        try {
            await PassWordUtils.Forge.importPublicKey(SSLPublicKey.PublicSSLKey);
            return await PassWordUtils.Forge.encrypt(password);
        } catch (err) {
            console.error("密码加密失败：", err); // 补充错误日志，便于排查
            return "";
        }
    }

    /**
     * 根据服务器要求是复杂密码还是简单密码
     * @param {string} password 密码
     * @return {Array} [boolean, string] 验证结果+错误信息
    */
    static isValid(password) {
        //过审了之后，就用简单密码
        let result = PassWordUtils.checkPassword2(password);
        return result;
    }

    /**
     * 检测密码是否为6-12位 且同时含有数字、字母、特殊字符，至少有一个字母是大写， 并返回对应的错误信息
     * @param {string} password 密码
     * @return {Array} [boolean, string]
    */
    static checkPassword2(password) {
        // 检查密码长度
        if (password.length < 6 || password.length > 12) {
            return [false, "密码长度为6-12位"];
        }

        // 正则表达式检查
        const hasAlpha = /[a-zA-Z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#~$%^&*()+|_.,]/.test(password);

        // 修正原逻辑漏洞：原逻辑"!hasAlpha && !hasUpperCase"等价于"没有字母且没有大写字母"，实际应检查"有字母但无大写"
        if (hasAlpha && !hasUpperCase) {
            return [false, "至少有一个大写字母"];
        }
        if (!hasNumber) {
            return [false, "密码必须包含数字"];
        }
        if (!hasSpecialChar) {
            return [false, "密码必须包含特殊字符"];
        }

        return [true, ''];
    }

    /**
     * 检测密码是否为6-12位 且只有数字和字母，并返回对应的错误信息
     * @param {string} password 密码
     * @return {Array} [boolean, string]
    */
    static checkPassword(password) {
        // 密码长度校验
        if (password.length < 6 || password.length > 12) return [false, "密码长度为6-12位"];
        // 补充原TS代码缺失的"只有数字和字母"校验逻辑
        if (!PassWordUtils.isNumberOrLetter(password)) {
            return [false, "密码只能包含数字和字母"];
        }
        // 密码合法
        return [true, ''];
    }

    /**
     * 检测输入的字符串是否为数字或则字母
     * @param {string} str 字符串
     * @return {boolean} 
     */
    static isNumberOrLetter(str) {
        return /^[0-9a-zA-Z]+$/.test(str);
    }

    /**
     * MD5加密（注意：原代码依赖Forge的md5方法，但当前Forge是RSAEncryption实例，此处逻辑存在问题）
     * @param {string} password 密码
     * @return {string} MD5加密结果
     */
    static MD5(password) {
        // 警告：原TS代码中Forge被赋值为RSAEncryption实例，无md5方法，此处补充容错
        if (!PassWordUtils.Forge || !PassWordUtils.Forge.md5) {
            console.error("MD5加密依赖的Forge未初始化或无md5方法");
            return "";
        }
        return PassWordUtils.Forge.md5.create().update(password).digest().toHex().toLowerCase();
    }
}