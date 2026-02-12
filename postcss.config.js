module.exports = {
  plugins: {
    'postcss-pxtorem': {
      // rootValue: ({ file }) => file.indexOf('vant') !== -1 ? 37.5 : 75, // 设置PC端的基准为37.5*2 移动端为37.5
       rootValue: 37.5, // 基准像素值，1rem = 16px
      //rootValue: 37.5 * 2, // 基准像素值，1rem = 16px
      propList: ['*'], // 可以从 px 转换为 rem 的属性列表, '*' 表示所有属性
      selectorBlackList: ['.ignore', '.hairlines'], // 忽略的选择器列表
      minPixelValue: 1, // 最小的转换单位
      mediaQuery: true // 允许在媒体查询中转换px
    },
  }
}
