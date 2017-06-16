//index.js
var httpUtil = require('../../utils/httpUtil')
var app = getApp()
Page({
	data: {
		qrcode: '',
		tickets: []
	},
	onLoad: function () {
		wx.setNavigationBarTitle({
  		title: '优惠券验证'
		})
	},
	quanInput: function (e) {
		console.log(e.detail.value)
		this.setData({
			qrcode: e.detail.value
		})
	},
	searchTickets: function() {
		console.log('search')
		var orderNo = 'ZHDDF'+this.data.qrcode
		var that = this
		var tickets = that.data.tickets
		httpUtil.request({
			url: app.globalData.proxyUrl+'/ticket/getTicket?orderNo='+orderNo
		}).then(resp => {
			if (resp.returnCode === 0) {
				var tempTicket = resp.ticket
				var isIdx = that.isExitTicket(tempTicket.id)
				if(that.isExitTicket(tempTicket.id) < 0) {
					tickets.push(tempTicket)
					that.setData({
						tickets: tickets
					})
				}
			} else {
				httpUtil.msgInfo(resp.errMsg)
			}
		}, err => {
			httpUtil.msgInfo('网络异常:>>'+err)
		})
	},
	httpTicket: function(id, type, idx) {
		var that = this
		httpUtil.request({
			url: app.globalData.proxyUrl+'/ticket/useDf',
			method: 'POST',
			data: {
				tid: id
			}
		}).then(resp => {
			if (resp.returnCode === 0) {
				var tickets = that.data.tickets
				if (type == 'input') {
					tickets[idx] = resp.ticket
				} else {
					tickets.push(resp.ticket)
				}
				that.setData({
					tickets: tickets
				})
				httpUtil.msgInfo('验证成功')
			} else {
				httpUtil.msgInfo(resp.errMsg)
			}
		}, err => {
			httpUtil.msgInfo('网络异常:>'+err)
		})
	},
	scanQuan: function(e) {
		var that = this
		wx.scanCode({
			success: function(res) {
				if (res.result.startsWith('ticketid')) {
					var id = res.result.split('*')[1]
					that.httpTicket(id, 'scan')
				} else {
					httpUtil.msgInfo('无效二维码')
				}

			}
		})
	},
	validateQuan: function (e) {
		var idx = e.currentTarget.dataset.index
		console.log(idx)
		var tickets = this.data.tickets
		this.httpTicket(tickets[idx].id, 'input', idx)
	},
	isExitTicket: function (ticketid) {
		var tickets = this.data.tickets
		return tickets.findIndex(item => item.id == ticketid)
	},
	onShareAppMessage: function () {
    return {
      title: '欢迎您使用型云',
      desc: '专注型钢20年，专业品牌',
      path: 'pages/index/index'
    }
  }
})
/*
// 请别再ES5模式下写ES6代码, uglify压缩不支持
function pro(msg) {
	return new Promise((resolve,reject) => {
		setTimeout(() => {
			resolve(msg)
		},1000)
	})
}*/
