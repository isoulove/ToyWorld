import React from 'react'
import {WhiteSpace,Icon,Modal,Toast,Tag } from 'antd-mobile';
import {GLTFModel,AmbientLight,DirectionLight} from 'react-3d-viewer'
// import {withRouter } from 'react-router-dom'

import { inject, observer } from 'mobx-react'
import './detail.css';
import tmpList from '../utils/demoData';

@inject('userStore')
@inject('marketStore')
@observer
class Detail extends React.Component {

    constructor(props){
      super()
      let type = props.match.params.type || 1
      type = parseInt(type)-1
      this.state = {
        buy:false,
        modal1:false,
        modal2:false,
        type:type,
        selectArr:[{amount:100,selected:false},{amount:200,selected:true},{amount:300,selected:false}],
        amount:200,
        width: window.innerWidth*1,
        item:{}
      }
    }
   
    toBuy = ()=>{
      const money = this.props.userStore.cbBalance
      const userInfo = this.props.userStore.userInfo
      if(!userInfo.loggedIn){
        this.props.userStore.tools.logIn()
      }else if(money<100){
        this.setState({modal2:true})
      }else{
        this.setState({modal1:true})
      }
    }

    onClose = ()=>{
        this.setState({modal1:false})
    }

    onClose2 = ()=>{
      this.setState({modal2:false})
    }

    componentDidMount(){
      const type=this.state.type
      const item = this.props.userStore.fetchAccountItem(tmpList[type].itemID)
      console.log(type,tmpList[type].itemID,item)
      this.setState({item: item})
    }

    buyOk = ()=>{
      // 调取接口购买

      var buyItem=this.state.item
      console.log(buyItem)
      const _this = this
      const userInfo = this.props.userStore.userInfo
     
      if(buyItem!=null) {
        this.props.marketStore.buy(buyItem, function(res){
          if(res=='success'){
            Toast.success('购买成功', 2)
            _this.setState({modal1:false})
            _this.props.marketStore.fetchMarketItems()
            _this.props.userStore.fetchAccountItems(userInfo.addr)
            _this.props.userStore.fetchToyCoinBalance(userInfo.addr)
          }else{
            Toast.fail('购买失败'+res, 2)
          }
        })
      }else{
        Toast.fail('购买失败，链上无可购买商品', 2)
      }
    }

    onChangeAmount = (key,v,s)=>{
      let {selectArr,amount} = this.state
      if(s){
        selectArr = selectArr.filter((value,ke)=>{
          if(ke==key){
            value.selected = true
          }else{
            value.selected = false
          }
          return value
        })
        amount = v.amount
      }else{
        selectArr = selectArr.filter((value,ke)=>{
          if(ke==key){
            value.selected = false
          }
          return value
        })
        amount = 0
      }
      this.setState({amount,selectArr})
    }

    checkPay = ()=>{
       const {amount} = this.state
       if(amount<=0){
          Toast.fail('请选择金额',2)
          return;
       }
       const _this = this
       this.props.userStore.mintToyCoin(this.props.userStore.userInfo.addr,amount,function(res){
         if(res=='success'){
           Toast.success('充值成功',2)
           _this.onClose2()
           _this.props.userStore.fetchToyCoinBalance(_this.props.userStore.userInfo.addr)
         }
       })
    }

   
  render (){
      const {width,type} = this.state
    return (
      <div style={{padding:'0 0 90px 0'}}>
          <div className="top-nav" onClick={() => this.props.history.goBack()} >
            <Icon type="left"  size="lg" color="#ddd" />
          </div>
          {/* <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => console.log('onLeftClick')}
            >
                
            </NavBar> */}
            <div className="detail-box" >
                <div style={{minHeight:'239px'}}>
                  {
                    this.state.type==1?
                    <GLTFModel
                      src="/assets/scene.gltf"
                      position={{x:0,y:-160,z:0}}
                      width={width} 
                      height={width}
                      onLoad={()=>{
                        this.props.onLoaded()
                      }}
                    >
                      <AmbientLight color={0xffffff}/>
                      <DirectionLight color={0xffffff} position={{x:100,y:200,z:100}}/>
                      <DirectionLight color={0xff00ff} position={{x:-100,y:100,z:-100}}/>
                    </GLTFModel>
                    :<img src={tmpList[type].img} style={{width:'100%'}} />

                  }
                    
                </div>
                <div className="bkc-fff" style={{height:'85px',borderBottom:'1px solid #C4C4C4'}}>
                    <div style={{float:'left',width:'70%',marginTop:'10px',paddingLeft:'16px'}}>
                    <div style={{fontSize:'20px',fontWeight:500,lineHeight:'21px'}}>{tmpList[type].title}</div>
                    <div style={{display:'flex',marginTop:'10px',alignItems:'center'}}>
                        <div className="avator-box">
                        <img src="/assets/images/ava.jpg" style={{width:'32px'}} />
                        </div>
                        <div style={{marginLeft:'8px'}}>@{tmpList[type].author}</div>
                    </div>
                    </div>
                    <div style={{float:'right',verticalAlign:'middle',height:'100%',marginRight:'22px',marginTop:'35px'}}>
                        <span style={{color:'#FFA71C',fontSize:'22px',fontWeight:700}}>{tmpList[type].price}</span>&nbsp;
                        <span style={{lineHeight:'20px',fontWeight:500,color:'#353535'}}>CB</span>
                    </div>
                </div>

                <div className="bkc-fff" style={{minHeight:'100px',padding:'30px 16px 20px 16px'}}>
                  {
                    tmpList[type].desc.map((v,k)=>(
                      <div>
                        <div className="title-intro">{v.title}</div>
                        {
                          v.content.map(v=>(
                            <div className="title-desc">
                              {v}
                            </div>
                          ))
                        }
                      </div>
                    ))
                  }
                    
                </div>
            </div>
          {/* 这是首页: 数字{appStore.num}
          <Button type="primary" onClick={this.addNum}>增加</Button> */}
          <WhiteSpace />
          <div className="bottom-item">
  
            <div onClick={this.toBuy} className="buy-now" style={{background: 'url(/assets/images/button-lg.jpg) center center / 260px 46px no-repeat'}}>
                立即购买
            </div>
          </div>

          <Modal
          visible={this.state.modal1}
          transparent
          maskClosable={true}
          onClose={this.onClose}
          title="确认订单"
        //   footer={[{ text: 'Ok', onPress: () => { console.log('ok'); this.onClose('modal1')(); } }]}
        //   wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        //   afterClose={() => { alert('afterClose'); }}
        >
          <div style={{ minHeight: 100}}>
                <div className="mt10">价格：{tmpList[type].price}CB</div>
                <div className="mt10">潮玩名称：{tmpList[type].title}</div>
                <div className="mt10">数量：1</div>
                <div style={{marginTop:'32px'}}>
                   <div onClick={this.onClose} className="checkBtn" style={{float:'left'}}>取消</div>
                   <div onClick={this.buyOk} className="checkBtn" style={{float:'right',background:'url(/assets/images/button-lg.jpg) center center / 96px 32px no-repeat'}}>确认购买</div>
                </div>
                
          </div>
        </Modal>
        <Modal
          visible={this.state.modal2}
          transparent
          maskClosable={true}
          onClose={this.onClose2}
          title="余额不足"
        //   footer={[{ text: 'Ok', onPress: () => { console.log('ok'); this.onClose('modal1')(); } }]}
        //   wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        //   afterClose={() => { alert('afterClose'); }}
        >
          <div style={{ minHeight: 100}}>
                <div style={{textAlign:'left',marginLeft:'10px'}}>充值金额</div>
                <div style={{textAlign:'left',marginLeft:'10px'}} className="mt10">
                  {
                    this.state.selectArr.map((v,key)=>{
                      return <Tag style={{marginRight:'10px'}} onChange={this.onChangeAmount.bind(this,key,v)} selected={v.selected}>{v.amount}</Tag>
                    })
                  }
                  {/* <Tag selected>100</Tag> &nbsp;&nbsp;
                  <Tag >200</Tag>&nbsp;&nbsp;
                  <Tag >300</Tag> */}
                  </div>
                <div style={{textAlign:'left',marginLeft:'10px'}} className="mt10">合计：¥{this.state.amount}</div>
                <div style={{marginTop:'32px'}}>
                   <div onClick={this.onClose2} className="checkBtn" style={{float:'left'}}>取消</div>
                   <div onClick={this.checkPay} className="checkBtn" style={{float:'right',background:'url(/assets/images/button-lg.jpg) center center / 96px 32px no-repeat'}}>确认充值</div>
                </div>
                
          </div>
        </Modal>
      </div>
    )
  }

}

export default Detail;
