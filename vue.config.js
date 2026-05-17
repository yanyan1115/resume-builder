const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        fs: false,
      },
    },
  },
  devServer: {
    client: {
      overlay: {
        warnings: false,
        errors: false,
      },
    },
  },
})
