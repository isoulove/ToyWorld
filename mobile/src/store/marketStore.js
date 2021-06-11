import {observable, action, computed, makeObservable} from 'mobx'
import {getRequest} from '../utils/ajax'
import {Toast} from 'antd-mobile'

import {createSaleOffer} from "../flow/create-sale-offer.tx"
import {buyMarketItem} from "../flow/buy-market-item.tx"

class MarketStore {
    // 市场集合
    @observable marketItems = null

    constructor(){
        makeObservable(this)
        this.fetchMarketItems()
    }

    // 市场NFT集合
    @action
    fetchMarketItems = () => {
        var rs = getRequest('market/collection')
        rs.then(response => {
            this.marketItems = response.items
        })
    }

    // 是否在售
    @action
    hasInMarket = (item) => {
        if(item!=null){
            return this.marketItems.has(item.itemID)
        }else{
            return false
        }
    }

    // 卖出NFT
    @action
    sell = (itemID, price, cb) => {
        //测试
        // itemID = 3
        // price = "10.0"
        var that = this
        Toast.loading('正在发布...', 0)
        createSaleOffer(
            {itemID: itemID, price: price},
            {
                onStart() {
                    
                },
                async onSuccess() {
                    that.fetchMarketItems()
                    Toast.hide()
                    Toast.success('发布成功！', 1)
                    if(cb) cb("success")
                },
                async onComplete() {
                    
                },
                async onError(error) {
                    Toast.fail('发布失败：'+error, 2)
                    if(cb) cb("fail"+error)
                },
            }
        )
    }

    // 买入NFT
    @action
    buy = (item, cb) => {
        // 测试
        // item = {
        //     owner: "0xf92eed27ae86ad18",
        //     itemID: 0,
        //     typeID: 2,
        //     author: "0xf92eed27ae86ad18",
        //     metadata: {
        //         itemName: "沉思",
        //         itemDesc: "1",
        //         totalNum: 1,
        //         ipfs:"/static/images/products/p1623329015809.png"
        //     },
        //     price: "10.00000000"
        // }
        var that = this
        Toast.loading('正在购买...', 0)
        buyMarketItem(
            {itemID: item.itemID, ownerAddress: item.owner},
            {
                onStart() {
                    
                },
                async onSuccess() {
                    that.fetchMarketItems()
                    Toast.hide()
                    Toast.success('购买成功！', 1)
                    if(cb) cb("success")
                },
                async onComplete() {
                },
                async onError(error) {
                    Toast.fail('发布失败：'+error, 2)
                    if(cb) cb("fail"+error)
                },
            }
        )
    }
}

export default new MarketStore()