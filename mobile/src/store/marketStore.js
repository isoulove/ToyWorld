import {observable, action, computed, makeObservable} from 'mobx'
import {getRequest} from '../utils/ajax'
import {Toast} from 'antd-mobile'

import {createSaleOffer} from "../flow/create-sale-offer.tx"
import {buyMarketItem} from "../flow/buy-market-item.tx"

class MarketStore {
    // 市场集合
    @observable marketItems = []

    constructor(){
        makeObservable(this)
        this.fetchMarketItems()
    }

    // 市场NFT集合
    @action
    fetchMarketItems = () => {
        var rs = getRequest('market/collection')
        rs.then(response => {
            this.marketItems = this.filterItems(response.items)
        })
    }

    // 是否在售
    @action
    hasInMarket = (itemID) => {
        const itemArr = this.marketItems.filter((item) => {
            return item.itemID == itemID
        })
        if(itemArr.length==1){
            return true
        }else{
            return false
        }
    }

    // 卖出NFT
    @action
    sell = (itemID, price, cb) => {
        var that = this
        Toast.loading('正在发布...', 0)
        createSaleOffer(
            {itemID: itemID, price: price},
            {
                onStart() {
                    
                },
                async onSuccess() {
                    Toast.hide()
                    that.fetchMarketItems()
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
                    if(cb) cb("success")
                },
                async onComplete() {
                    Toast.success('购买成功！', 1)
                },
                async onError(error) {
                    Toast.fail('发布失败：'+error, 2)
                    if(cb) cb("fail"+error)
                },
            }
        )
    }

    // 一级市场
    @computed
    get priMarketItems() {
        return this.marketItems.filter((item) => {
            return item.owner == item.author
        })
    }

    // 二级市场
    @computed
    get secMarketItems() {
        return this.marketItems.filter((item) => {
            return item.owner != item.author
        })
    }

    filterItems = (items) => {
        return items.filter((item) => {
            return item.itemID >= 19
        })
    }

    @action
    fetchAccountItem = (itemID) => {
        const itemArr = this.marketItems.filter((item) => {
            return item.itemID == itemID
        })
        if(itemArr.length==1){
            return itemArr[0]
        }else{
            return []
        }
    }
}

export default new MarketStore()