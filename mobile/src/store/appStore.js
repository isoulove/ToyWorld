import {observable, action, computed, makeObservable} from 'mobx'
import {getRequest} from '../utils/ajax'
import {Toast} from 'antd-mobile'
class AppStore {
    @observable userInfo = null //用户信息
    @observable num = 0

    constructor(){
        makeObservable(this)
    }

    @action 
    addNum = () => {
        console.log(22)
        this.num += 1;
      };
}

export default new AppStore()