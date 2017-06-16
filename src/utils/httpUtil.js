var Promise = require('es6-promise').Promise;

var httpUtil = {
  request: function(params) {
    var body = {
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      url: 'http://127.0.0.1:8090/api/testJson'
    }
    for(var k in params) {
      body[k] = params[k]
    }
    wx.showLoading({title: '加载中...', mask: true})
    return new Promise(function(resolve,reject) {
      body.success = function(resp) {
        wx.hideLoading()
        if (resp.statusCode === 200) {
          resolve(resp.data)
        } else {
          reject(resp.errMsg)
        }
      }
      body.error = function(err) {
        wx.hideLoading()
        reject(err)
      }
      wx.request(body)
    })
  },
  msgInfo: function(msg) {
    var config = {
      title: '友情提示',
      content: msg,
      showCancel: false,
      confirmColor: '#0289fb'
    }
    return httpUtil.wxShowModal(config)
  },
  wxShowModal: function(config) {
    return new Promise(function(resolve, reject){
      config.success = function(resp) {
        resolve(resp)
      }
      wx.showModal(config)
    })
  }
}

module.exports = httpUtil;