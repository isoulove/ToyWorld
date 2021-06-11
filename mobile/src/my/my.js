import React from 'react'
import './my.css'; 
import { Toast } from 'antd-mobile';
import { withRouter } from 'react-router-dom'

import { inject, observer } from 'mobx-react'

@inject('userStore')  
@observer
class My extends React.Component {
  state = {showList:false,userInfo:null,buyNum:0}

  goDetail = ()=>{
    this.props.history.push({
      pathname: '/detail'
    });
  }

  toWallet = ()=>{
    //连接钱包操作，获取商品列表
    this.props.userStore.tools.logIn()
    //Toast.success('连接成功！', 2);
    this.setState({showList:true,buyNum:2})
  }

  
  render (){
  	const {userStore} = this.props
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
              <div style={{float:'right'}}>
                <img src="" />
              </div>
            </div>

            <div style={{padding:'30px 54px 10px 54px'}}>
                <div style={{marginLeft:'15px',float:'left',color:'#FFA71C',fontSize:'14px',fontWeight:400,lineHeight:'22px'}}>我的购买（{this.state.buyNum}）</div>
                <div style={{marginRight:'15px',float:'right',fontSize:'14px',fontWeight:400,lineHeight:'22px'}}>我发布的（0）</div>
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
                  <div className="item" onClick={this.goDetail}>
                      <div className="item-inner">
                          <div className="img">
                              <img src="assets/images/test.jpg" />
                          </div>
                          <div className="title">
                            摩尔庄园：吉比特炒行星星球潮玩
                          </div>
                          <div style={{marginTop:'10px'}}>
                            <div style={{float:'left',color:'#E94D5E'}}>
                              <span style={{fontSize:'11px'}}>¥</span>  <span style={{fontSize:'16px'}}>35</span>
                            </div>
                            <div style={{display:'flex',alignItems:'center',float:'right'}}>
                              <div className="avator-box1">
                                <img src="assets/images/ava.jpg" style={{width:'20px'}} />
                              </div>
                              <div style={{marginLeft:'2px',fontSize:'10px'}}>@7onder</div>
                            </div>
                          </div>
                      </div>
                  </div>
                  <div className="item" onClick={this.goDetail}>
                      <div className="item-inner">
                          <div className="img">
                              <img src="assets/images/test.jpg" />
                          </div>
                          <div className="title">
                            摩尔庄园：吉比特炒行星星球潮玩
                          </div>
                          <div style={{marginTop:'10px'}}>
                            <div style={{float:'left',color:'#E94D5E'}}>
                              <span style={{fontSize:'11px'}}>¥</span>  <span style={{fontSize:'16px'}}>35</span>
                            </div>
                            <div style={{display:'flex',alignItems:'center',float:'right'}}>
                              <div className="avator-box1">
                                <img src="assets/images/ava.jpg" style={{width:'20px'}} />
                              </div>
                              <div style={{marginLeft:'2px',fontSize:'10px'}}>@7onder</div>
                            </div>
                          </div>
                      </div>
                  </div>
                  <div className="clear"></div>
              </div>
          </div>
          }
         
      </div>
      
    )
  }
  
}

export default withRouter(My);
