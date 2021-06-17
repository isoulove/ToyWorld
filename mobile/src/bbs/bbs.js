import React from 'react'
// import 'antd-mobile/dist/antd-mobile.css'; 
import { Button, WhiteSpace,WingBlank,SearchBar,InputItem,Carousel,Icon } from 'antd-mobile';
import { Link,withRouter } from 'react-router-dom'

import { inject, observer } from 'mobx-react'
@inject('appStore')
@inject('marketStore')
@observer
class Bbs extends React.Component {
  constructor(props) {
    super(props);
   
  }

  componentDidMount() {
    
  }

  goodClick = (e)=>{
    this.props.history.push({
        pathname: '/detail/'+e
      });
}


  
  render (){
    const {marketStore} = this.props
    return (
      <div style={{padding:'15px 0',background:'url(assets/images/back.png) 100% y-repeat'}}>
      <WingBlank>
      <div className="search-div" style={{marginTop:'20px',width:'100%',borderRadius:'18px',height:'36px',display:'flex',backgroundColor:'white'}}>
      <InputItem
        placeholder="泡泡玛特"
        style={{fontSize:'14px'}}
      >
      </InputItem>
      <div style={{ height: '34px', width: '80px',minWidth:'80px',backgroundColor:'white',borderRadius:'18px',marginTop:'1px',color:'#fff',fontSize:'14px',lineHeight:'34px',display:'flex',justifyContent: 'center',background:'url(assets/images/search.jpg) center center /  80px 34px no-repeat'  }} >
      {/* <Button style={{height:'34px',fontSize:'14px',borderRadius:'18px',backgroundColor:'#ddd'}}  icon={<Icon type="search" size='xxs' />}>搜索</Button> */}
      <Icon type="search" size='xxs' style={{marginTop:'10px'}} /> <span>搜索</span> 
      </div>
      </div>
      <div style={{marginTop:'20px'}}>
        <span className="common-title-style" style={{fontSize:'18px',fontWeight:500,lineHeight:'21px'}}>推荐</span>
        <span className="common-title-style" style={{marginLeft:'20px',fontSize:'16px',color:'rgba(53, 53, 53, 0.8);'}}>排行榜</span>
        <span className="common-title-style" style={{marginLeft:'20px',fontSize:'16px',color:'rgba(53, 53, 53, 0.8);'}}>预售</span>
        <span className="common-title-style" style={{marginLeft:'20px',fontSize:'16px',color:'rgba(53, 53, 53, 0.8);'}}>少女心</span>
      </div>
      </WingBlank>
     
      <div className="list" style={{marginTop:'10px'}}>
            {marketStore.marketItems.map((product,key) => (
            <div className="item" onClick={this.goodClick.bind(this,key%2==0?1:2)}>
            <div className="item-inner">
                <div className="img">
                    <img src="assets/images/test.jpg" />
                </div>
                <div className="title">
                  摩尔庄园：吉比特炒行星星球潮玩
                </div>
                <div style={{marginTop:'10px'}}>
                  <div style={{float:'left',color:'#E94D5E'}}>
                    <span style={{fontSize:'11px'}}>¥</span>  <span style={{fontSize:'16px'}}>100 CB</span>
                   
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
            ))}
      </div>
      {/* 这是首页: 数字{appStore.num}
      <Button type="primary" onClick={this.addNum}>增加</Button> */}
      <WhiteSpace />
  </div>
      
    )
  }
  
}

export default withRouter(Bbs);
