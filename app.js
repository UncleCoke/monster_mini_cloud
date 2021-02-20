App({
  onLaunch: function () {
    this.update();
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
    //云开发调用
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'poker-yggrd',
        traceUser: true,
      })
    }
  },

  globalData: {
  },

  //版本更新
  update: function () {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {})
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '发现新版本，请重启应用。',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      console.log('新版本下载失败');
    })
  },

  request: async function({url,rData = {}} = {}){
    return await wx.cloud.callFunction({
      name: 'todos',
      data: {
          $url: url,
          data: rData
      }
    });
  }
})