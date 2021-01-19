// .env.js 文件
// 不同环境访问不同的路径
// import store from '@/common/store/index'

//项目接口
const ENV_API_URL = {
    development: 'http://cashwarden-api-pro.yii.work/v1', //开发环境
    production: 'https://api.cashwarden.com/v1', //生产环境
}

// process.env.NODE_ENV
export const API_URL = ENV_API_URL['production']; //后台接口域名