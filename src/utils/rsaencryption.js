export default class RSAEncryption {
  publicKey = null

  constructor() {}

  // 加载公钥 (PEM格式)，返回 CryptoKey 对象
  async importPublicKey(pem) {
    try {
      // 将 PEM 格式的公钥转换为 ArrayBuffer
      const pemHeader = '-----BEGIN PUBLIC KEY-----'
      const pemFooter = '-----END PUBLIC KEY-----'
      const pemContents = pem.replace(pemHeader, '').replace(pemFooter, '').replace(/\s+/g, '')
      const binaryDer = atob(pemContents)
      const binaryDerArray = new Uint8Array(binaryDer.length)

      for (let i = 0; i < binaryDer.length; i++) {
        binaryDerArray[i] = binaryDer.charCodeAt(i)
      }

      // 使用 SubtleCrypto 导入公钥
      this.publicKey = await window.crypto.subtle.importKey(
        'spki', // 公钥格式
        binaryDerArray.buffer,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256' // 使用 SHA-256
        },
        false,
        ['encrypt']
      )
    } catch (error) {
      console.error('导入公钥失败：', error)
    }
  }

  // 使用公钥加密明文并返回 Base64 编码的结果
  async encrypt(plaintext) {
    if (!this.publicKey) {
      console.error('公钥未加载！')
      return ''
    }

    const encoder = new TextEncoder()
    const encodedData = encoder.encode(plaintext)

    try {
      // 使用 RSA-OAEP 算法加密
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP'
        },
        this.publicKey,
        encodedData
      )

      // 将加密数据转为 Base64 编码
      const encryptedArray = new Uint8Array(encryptedData)
      return this.arrayBufferToBase64(encryptedArray)
    } catch (error) {
      console.error('加密失败11：', error)
      return ''
    }
  }

  // 将 ArrayBuffer 转为 Base64 字符串
  arrayBufferToBase64(buffer) {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    const length = bytes.byteLength

    for (let i = 0; i < length; i++) {
      let val = bytes[i] || 0
      binary += String.fromCharCode(val)
    }

    return btoa(binary)
  }
}
