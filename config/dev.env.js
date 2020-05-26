'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://192.168.0.146:8090"', // 测试 吴江
  BASE_API: '"https://patient-manage.naxions.com/ops"',  //测试
  // BASE_API: '"http://47.95.23.151:8130"', // 测试 192.168.1.162
  // BASE_API: '"http://192.168.1.162:8130"', // 陈杰
  // BASE_API: '"http://192.168.1.193:8130"', // 测试 

})