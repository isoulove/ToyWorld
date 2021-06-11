import React from 'react'
import {WhiteSpace,Icon,Modal,Toast } from 'antd-mobile';
import {GLTFModel,AmbientLight,DirectionLight} from 'react-3d-viewer'
// import {withRouter } from 'react-router-dom'

import { inject, observer } from 'mobx-react'
import './detail.css';
@inject('appStore')  
@observer
class Detail extends React.Component {

    constructor(props){
      super()
      let type = props.match.params.type || 0
      type = parseInt(type)
      this.state = {
        buy:false,
        modal1:false,
        type:type,
        width: window.innerWidth*1
      }
    }
   
    toBuy = ()=>{
        this.setState({modal1:true})
    }

    onClose = ()=>{
        this.setState({modal1:false})
    }

    componentDidMount(){
     
    }

    buyOk = ()=>{
        // 调取接口购买
        this.setState({modal1:false})
        Toast.success('购买成功', 2);
    }

   
  render (){
      const {width} = this.state
    return (
      <div style={{padding:'0 0 90px 0'}}>
          <div className="top-nav" onClick={() => this.props.history.goBack()} >
            <Icon type="left"  size="lg" color="#fff" />
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
                    <img src="/assets/images/1.jpg" style={{width:'100%'}} />
                    :this.state.type==2?
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
                    :''

                  }
                    
                </div>
                <div className="bkc-fff" style={{height:'85px',borderBottom:'1px solid #C4C4C4'}}>
                    <div style={{float:'left',width:'70%',marginTop:'10px',paddingLeft:'16px'}}>
                    <div style={{fontSize:'20px',fontWeight:500,lineHeight:'21px'}}>摩尔庄园：吉比特</div>
                    <div style={{display:'flex',marginTop:'10px',alignItems:'center'}}>
                        <div className="avator-box">
                        <img src="/assets/images/ava.jpg" style={{width:'32px'}} />
                        </div>
                        <div style={{marginLeft:'8px'}}>@7onder</div>
                    </div>
                    </div>
                    <div style={{float:'right',verticalAlign:'middle',height:'100%',marginRight:'22px',marginTop:'35px'}}>
                        <span style={{color:'#FFA71C',fontSize:'22px',fontWeight:700}}>1.125</span>&nbsp;
                        <span style={{lineHeight:'20px',fontWeight:500,color:'#353535'}}>ETH</span>
                    </div>
                </div>

                <div className="bkc-fff" style={{minHeight:'100px',padding:'30px 16px 20px 16px'}}>
                    <div className="title-intro">一些介绍</div>
                    <div className="title-desc" style={{}}>
                        该卡可激活一个假日系列的一个卡槽。激活卡永久有效，且可与比他人交换
                        </div>
                    <div className="title-intro" style={{marginTop:'20px'}}>注意事项</div>
                    <div  className="title-desc">
                        该卡可激活一个假日系列的一个卡槽。激活卡永久有效，且可与比他人交换
                        </div>
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
                <div>价格：400CB</div>
                <div className="mt10">价格：400CB</div>
                <div className="mt10">潮玩名称#21</div>
                <div className="mt10">数量：1</div>
                <div style={{marginTop:'32px'}}>
                   <div onClick={this.onClose} className="checkBtn" style={{float:'left'}}>取消</div>
                   <div onClick={this.buyOk} className="checkBtn" style={{float:'right',background:'url(/assets/images/button-lg.jpg) center center / 96px 32px no-repeat'}}>确认购买</div>
                </div>
                
          </div>
        </Modal>
      </div>
    )
  }

}

export default Detail;
