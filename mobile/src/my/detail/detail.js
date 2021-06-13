import React from 'react'
import {WhiteSpace,Icon,Modal,Toast,Tag } from 'antd-mobile';
import {GLTFModel,AmbientLight,DirectionLight} from 'react-3d-viewer'
// import {withRouter } from 'react-router-dom'

import { inject, observer } from 'mobx-react'
import './detail.css';
@inject('userStore')  
@inject('marketStore')
@observer
class Detail extends React.Component {

    constructor(props){
      super()
      let type = props.match.params.type || 0
      type = parseInt(type)
      this.state = {
        buy:false,
        modal1:false,
        modal2:false,
        type:type,
        width: window.innerWidth*1,
        item: {}
      }
    }
   
    componentDidMount(){
      const path = this.props.location.pathname
      const itemID = path.substring(path.lastIndexOf("/")+1)
      const item = this.props.userStore.fetchAccountItem(itemID)
      this.setState({item: item})
    }

    toSell = ()=>{
      const item=this.state.item
      this.props.marketStore.sell(item.itemID, "100.0")
    }

  render (){
      const {width} = this.state
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
                        <span style={{color:'#FFA71C',fontSize:'22px',fontWeight:700}}>100</span>&nbsp;
                        <span style={{lineHeight:'20px',fontWeight:500,color:'#353535'}}>CB</span>
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
          <div className="bottom-item1">
            <div style={{float:'left',marginLeft:'24px',marginTop:'13px'}}>
              <div>
                <img src="/assets/images/share.png" style={{width:'24px'}} />
              </div>
              <div style={{marginTop:'3px',fontSize:'10px',color:'#A4A5A6'}}>
                分享
              </div>
            </div>
            <div  onClick={this.toSell} className="buy-now1" style={{background: 'url(/assets/images/search.jpg) center center / 130px 46px no-repeat',float:'right',marginRight:'21px'}}>
                转卖
            </div>
          </div>
      </div>
    )
  }

}

export default Detail;
