import React from 'react'
import './my.css'; 
import { Toast } from 'antd-mobile';
import { withRouter } from 'react-router-dom'

import { inject, observer } from 'mobx-react'
import tmpList from '../utils/demoData';
import ShowImg from '../components/showImg';
import * as fcl from "@onflow/fcl"

@inject('userStore')  
@inject('marketStore') 
@observer
class My extends React.Component {
  userInfo = this.props.userStore.userInfo
  state = {
    showList: this.userInfo.addr!=null,
    userInfo: this.userInfo, 
    buyNum: this.props.userStore.toyItems.length,
    show:0,
  }

  changeShow = (e)=>{
    this.setState({show:e})
  }

  componentDidMount(){
    const _this=this
    fcl.currentUser().subscribe((user)=>{
      if(user.addr!=null){
        this.setState({showList:true, userInfo: _this.userInfo})
      }
    })
  }

  goDetail = (e,e2)=>{
    this.props.history.push({
      pathname: '/my/detail/'+e+"/"+e2
    });
  }

  toWallet = ()=>{
    //连接钱包操作，获取商品列表
    this.props.userStore.tools.logIn()
    //Toast.success('连接成功！', 2);
    // this.setState({showList:true,buyNum:2})
  }

  
  render (){
  	const {userStore, marketStore} = this.props
    return (
      <div style={{ background: 'url(assets/images/back.png) center center / 100%  repeat-y',height:'100%'}}>
          <div style={{height:'160px',borderBottom:'1px solid #ddd'}}>
            <div style={{height:'100px'}}>
              <div style={{float:'left',display:'flex',alignItems:'center',marginTop:'30px',marginLeft:'29px'}}>
                  <div className="avator-box-my">
                        <img src="assets/images/ava.jpg" style={{width:'72px'}} />
                  </div>
                  <div style={{marginLeft:'8px',fontSize:'16px',fontWeight:600,color:'#333'}}>
                    @7onder
                    <div style={{marginTop:'8px',fontSize:'12px',fontWeight:400,color:'#4f4f4f'}}>ID:{userStore.userInfo.addr}</div>
                    <div style={{marginTop:'8px',fontSize:'12px',fontWeight:400,color:'#4f4f4f'}}>潮币余额：{userStore.cbBalance}</div>
                    <div style={{marginTop:'8px',fontSize:'12px',fontWeight:400,color:'#4f4f4f'}}>Flow余额：{userStore.flowBalance}</div>
                    </div>
              </div>
              <div style={{float:'right',marginRight:'10px',marginTop:'10px',padding:'5px',width:'30px',height:'30px',borderRadius:'15px',backgroundColor:'white'}}>
                <img src="/assets/images/setting.png" style={{width:'20px'}} />
              </div>
            </div>

            <div style={{padding:'30px 54px 10px 54px'}}>
                <div onClick={this.changeShow.bind(this,0)} style={{marginLeft:'15px',float:'left',color:this.state.show==0?'#FFA71C':'',fontSize:'14px',fontWeight:400,lineHeight:'22px'}}>我的购买（{userStore.myBuyItems.length}）</div>
                <div onClick={this.changeShow.bind(this,1)} style={{marginRight:'15px',float:'right',color:this.state.show==1?'#FFA71C':'',fontSize:'14px',fontWeight:400,lineHeight:'22px'}}>我发布的（{userStore.myPubItems.length}）</div>
            </div>
          </div>
          {
            !this.state.showList?
            <div style={{margin:'0 auto',marginTop:'20px'}}>
              <div onClick={this.toWallet} className="buy-now" style={{background: 'url(assets/images/button-lg.jpg) center center / 260px 46px no-repeat'}}>
                连接钱包
            </div>
            </div>
            :
            <div className="goodList">
            <div className="list">
                  {
                    this.state.show==0?
                  userStore.myBuyItems.map((product,key) => (
                  // <div className="item" onClick={this.goDetail.bind(this,key%2==0?1:2)}>
                  <div className="item" key={key} onClick={this.goDetail.bind(this,product.typeID,product.itemID)}>
                      <div className="item-inner">
                          <div className="img">
                          <ShowImg cid={product.metadata.cid} fileType={product.metadata.fileType} />
                          </div>
                          <div className="title">
                            {product.metadata.title}
                          </div>
                          <div style={{marginTop:'10px'}}>
                            <div style={{float:'left',color:'#E94D5E'}}>
                              <span style={{fontSize:'11px'}}>¥</span>  <span style={{fontSize:'16px'}}>{product.price} CB</span>
                              <span style={{fontSize:'16px', color: 'blue'}}>{
                                marketStore.hasInMarket(product.itemID)?" 在售":""
                              }</span>
                            </div>
                            <div style={{display:'flex',alignItems:'center',float:'right'}}>
                              <div className="avator-box1">
                                <img src="assets/images/ava.jpg" style={{width:'20px'}} />
                              </div>
                              <div style={{marginLeft:'2px',fontSize:'10px'}}>@{tmpList[product.typeID-1].author}</div>
                            </div>
                          </div>
                        </div>
                    </div>
                  ))
                  :
                  userStore.myPubItems.map((product,key) => (
                    // <div className="item" onClick={this.goDetail.bind(this,key%2==0?1:2)}>
                    <div className="item" key={key} onClick={this.goDetail.bind(this,product.typeID,product.itemID)}>
                        <div className="item-inner">
                            <div className="img">
                            <ShowImg cid={product.metadata.cid} fileType={product.metadata.fileType} />
                            </div>
                            <div className="title">
                              {product.metadata.title}
                            </div>
                            <div style={{marginTop:'10px'}}>
                              <div style={{float:'left',color:'#E94D5E'}}>
                                <span style={{fontSize:'11px'}}>¥</span>  <span style={{fontSize:'16px'}}>{product.price} CB</span>
                                <span style={{fontSize:'16px', color: 'blue'}}>{
                                  marketStore.hasInMarket(product.itemID)?" 在售":""
                                }</span>
                              </div>
                              <div style={{display:'flex',alignItems:'center',float:'right'}}>
                                <div className="avator-box1">
                                  <img src="assets/images/ava.jpg" style={{width:'20px'}} />
                                </div>
                                <div style={{marginLeft:'2px',fontSize:'10px'}}>@{tmpList[product.typeID-1].author}</div>
                              </div>
                            </div>
                          </div>
                      </div>
                  ))
                  }
                  <div className="clear"></div>
              </div>
          </div>
          }
         
      </div>
      
    )
  }
  
}

export default withRouter(My);
