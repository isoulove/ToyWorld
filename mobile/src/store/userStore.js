import { observable, action, computed, makeObservable } from 'mobx'
import { getRequest, postRequest } from '../utils/ajax'
import { Toast } from 'antd-mobile'

import { fetchFlowBalance } from "../flow/fetch-flow-balance.script"
import { isAccountInitialized } from "../flow/is-account-initialized.script"
import { initializeAccount } from "../flow/initialize-account.tx"

import { fmtFlow } from "../utils/fmt-flow"
import { storeFiles } from '../utils/IPFSUtil'

import * as fcl from "@onflow/fcl"

class UserStore {
  // 账户信息
  @observable userInfo = { addr: null, loggedIn: null, cid: null }
  // 账户潮币余额
  @observable cbBalance = 0
  // 账户flow余额
  @observable flowBalance = 0
  // 账户NFT集合
  @observable toyItems = []

  tools = {
    // 登陆
    logIn: () => {
      fcl.unauthenticate()
      fcl.logIn()
    },
    // 注销
    logOut: fcl.unauthenticate,
    // 签名
    signUp: fcl.signUp,
    changeUser: fcl.reauthenticate,
  }

  constructor() {
    makeObservable(this)
    fcl.currentUser().subscribe(this.setUser)
  }

  // 账户潮币余额
  @action
  fetchToyCoinBalance = (address) => {
    console.log("fetchToyCoinBalance");

    if (!address) Promise(null)
    var rs = getRequest("toycoin/balance/" + address)
    rs.then((res) => {
      this.cbBalance = res.balance
    })
  }

  // 账户FLOW余额
  @action
  fetchFlowBalance = (address) => {
    console.log("fetchFlowBalance");

    if (!address) Promise(null)
    fetchFlowBalance(address).then((res) => {
      this.flowBalance = fmtFlow(res)
    })
  }

  // 领取潮币
  @action
  mintToyCoin = (address, amount, cb) => {
    console.log("mintToyCoin");

    if (!address) Promise(null)
    var rs = postRequest("toycoin/mint", {
      recipient: address,
      amount: amount,
    })
    Toast.loading('正在充值...', 0)
    rs.then(() => {
      this.fetchToyCoinBalance(address)
      Toast.hide()
      if (cb != undefined) cb("success")
    }).catch((err) => {
      Toast.fail('失败：' + err, 2)
      if (cb != undefined) cb("fail" + err)
    })
    return rs
  }

  // 账户NFT集合
  @action
  fetchAccountItems = (address) => {
    console.log("fetchAccountItems");

    if (!address) return Promise.resolve(null)
    var rs = getRequest('toy-items/items/' + address)
    Toast.loading('正在查询...', 0)
    rs.then(response => {
      this.toyItems = this.filterItems(response.items)
      Toast.hide()
    }).catch((err) => {
      Toast.fail('失败：' + err, 2)
    })
  }

  // 铸造NFT
  @action
  mintToyItems = (metadata, address, cb) => {
    if (!address) {
      Toast.fail('失败：请先登陆！', 2)
      return
    }
    // NFT的元数据信息存储在FLOW链上；NFT的图像、3D模型、视频等存储在IPFS上
    // NFT的元数据格式举例
    // 展示：https://{cid}.ipfs.dweb.link/filename
    // 例子：https://bafybeicvx2rnobrnxzdqdimoqiwhdptqw6osq3b6qgynt4jvj6gfv3yhb4.ipfs.dweb.link/333.txt
    metadata = {
      name: 'my nft',
      description: 'my nft base on flow and ipfs',
      files: [
        new File(["First Line Text1"],'111.txt',{type: "text/plain"}),
        new File(["First Line Text2"],'222.txt',{type: "text/plain"}),
        new File(["First Line Text3"],'333.txt',{type: "text/plain"})
      ],
      ipfs: ''  //nft模型存储到ipfs上后，将cid回填到该属性，存储到flow链
    }

    if(metadata.files && metadata.files.length>0) {
      Toast.loading('正在铸造...', 0)
      storeFiles(metadata.files).then(cid => {
        const nftMeta = Object.assign({}, metadata, {
          files: metadata.files.map(item => {
            return item.name
          }),
          ipfs: cid
        })

        console.log(nftMeta)
        var rs = postRequest("toy-items/mint", {
          recipient: address,
          metadata: nftMeta,
          // Random typeID between 1 - 5
          typeID: Math.floor(Math.random() * (5 - 1)) + 1,
        })
        rs.then((res) => {
          Toast.hide()
          this.fetchAccountItems(address)
          if (cb != undefined) cb("success")
        }).catch((err) => {
          Toast.fail('失败：' + err, 2)
          if (cb != undefined) cb("fail" + err)
        })
      }).catch((err) => {
        Toast.fail('IPFS存储失败：' + err, 2)
      })
    } else {
      Toast.fail('失败：需上传NFT模型！', 2)
    }
  }

  @action
  setUser = (user) => {
    var preLoggedIn = this.userInfo.loggedIn
    this.userInfo = user
    var that = this
    if (preLoggedIn == null && user.loggedIn) {
      Toast.success('登陆成功！', 1)
      isAccountInitialized(user.addr).then((res) => {
        var all = res

        // 判断账户资源是否初始化
        if (!(all.ToyCoin && all.ToyItems && all.ToyItemsMarket)) {
          // 执行账户资源初始化
          Toast.loading('正在初始化账户资源...', 0)
          initializeAccount(user.addr, {
            onStart() {

            },
            async onSuccess() {
              that.fetchAccountItems(user.addr)
              Toast.hide()
              that.fetchToyCoinBalance(user.addr)
              that.fetchFlowBalance(user.addr)
              Toast.success('初始化成功！', 1)
            },
            onError(error) {
              Toast.fail('失败！' + error, 1)
            },
            async onComplete() {

            },
          })
        } else {
          this.fetchToyCoinBalance(user.addr)
          this.fetchFlowBalance(user.addr)
          this.fetchAccountItems(user.addr)
        }
      })
    }

    if (preLoggedIn && user.loggedIn == null) {
      Toast.success('注销成功', 1)
      this.cbBalance = 0
      this.flowBalance = 0
    }
  }

  @action
  fetchAccountItem = (itemID) => {
    const itemArr = this.toyItems.filter((item) => {
      return item.itemID == itemID
    })
    if (itemArr.length == 1) {
      return itemArr[0]
    } else {
      return []
    }
  }

  filterItems = (items) => {
    return items.filter((item) => {
      return item.itemID >= 19
    })
  }
}

export default new UserStore()