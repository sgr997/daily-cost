module.exports = {
  productionSourceMap: false,
  publicPath: './', // 署应用包时的基本 URL。 vue-router hash 模式使用
  assetsDir: 'static', //  outputDir的静态资源(js、css、img、fonts)目录
  // 解决实验楼环境启动的 https，服务端接口是 http 造成跨域的问题。
  devServer: {
    port: 8899,
    proxy: {  
      '/api': {
          target: process.env.VUE_APP_TARGET,  // 配置到服务器后端的API头部
          pathRewrite: { 
              '^/api': '/'  // 路径重写，第一个与上面相同，第二个/queue-admin 为server.context-path（服务器的上下文）
          },
          // 以下解决https 访问问题。上面的可以访问http
          changeOrigin: true,
          secure: false
      }
    }
  }
}