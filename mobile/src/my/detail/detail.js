import React from 'react'
import {WhiteSpace,Icon,Modal,Toast,Tag } from 'antd-mobile';
import {GLTFModel,AmbientLight,DirectionLight} from 'react-3d-viewer'
// import {withRouter } from 'react-router-dom'
import tmpList from '../../utils/demoData';
import ShowImg from '../../components/showImg';
import { inject, observer } from 'mobx-react'
import './detail.css';
@inject('userStore')  
@inject('marketStore')
@observer
class Detail extends React.Component {

    constructor(props){
      super()
      let itemID = props.match.params.itemID || 0
      this.state = {
        buy:false,
        modal1:false,
        modal2:false,
        itemID:itemID,
        width: window.innerWidth*1,
        item: {}
      }
    }
   
    componentDidMount(){
      // const path = this.props.location.pathname
      // const itemID = path.substring(path.lastIndexOf("/")+1)
      // const item = this.props.userStore.fetchAccountItem(this.state.itemID)
      // console.log(item,'111')
      this.props.userStore.setItemID(this.state.itemID)
    }

    toSell = ()=>{
      const item=this.props.userStore.fetchAccountItem
      const itemID=this.state.itemID
      //tmpList[type].itemID
      this.props.marketStore.sell(itemID, item.price)
    }

  render (){
      const {width} = this.state
      //console.log(item,'333')
      const item = this.props.userStore.fetchAccountItem
      const metadata = this.props.userStore.fetchMetadata
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
                <ShowImg cid={metadata.cid} fileType={metadata.fileType} width={width} />
                </div>
                <div className="bkc-fff" style={{height:'85px',borderBottom:'1px solid #C4C4C4'}}>
                    <div style={{float:'left',width:'70%',marginTop:'10px',paddingLeft:'16px'}}>
                    <div style={{fontSize:'20px',fontWeight:500,lineHeight:'21px'}}>{metadata.title}</div>
                    <div style={{display:'flex',marginTop:'10px',alignItems:'center'}}>
                        <div className="avator-box">
                        <img src="/assets/images/ava.jpg" style={{width:'32px'}} />
                        </div>
                        <div style={{marginLeft:'8px'}}>@{item.author}</div>
                    </div>
                    </div>
                    <div style={{float:'right',verticalAlign:'middle',height:'100%',marginRight:'22px',marginTop:'35px'}}>
                        <span style={{color:'#FFA71C',fontSize:'22px',fontWeight:700}}>{item.price}</span>&nbsp;
                        <span style={{lineHeight:'20px',fontWeight:500,color:'#353535'}}>CB</span>
                    </div>
                </div>

                <div className="bkc-fff" style={{minHeight:'100px',padding:'30px 16px 20px 16px'}}>
                <div className="title-intro">介绍</div>
                      <div className="title-desc">
                        {metadata.desc}
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
