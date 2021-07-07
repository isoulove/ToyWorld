import React from 'react'
import { Button, WhiteSpace,WingBlank,SearchBar,InputItem,Carousel,Icon } from 'antd-mobile';
import { Link,withRouter } from 'react-router-dom'

import { inject, observer } from 'mobx-react'
import './home.css';

import tmpList from '../utils/demoData';
@inject('appStore')
@inject('marketStore')
@observer
class Home extends React.Component {

  addNum = ()=>{
    this.props.appStore.addNum()
  }

  state = {
    imgHeight: 176,
    data: ['1', '2', '3'],
  }

  goodClick = (e,e2)=>{
    this.props.history.push({
        pathname: '/detail/'+e+'/'+e2
      });
}

  
  render (){
      const {appStore} = this.props
      const {marketStore} = this.props
    return (
      <div style={{padding:'15px 0',background:'url(assets/images/back.png) 100% y-repeat'}}>
          <WingBlank>
          <div style={{marginTop:'58 px'}}>
            <span className="common-title-style" style={{fontSize:'22px',fontWeight:600,lineHeight:'21px'}}>推荐</span>
            <span className="common-title-style" style={{marginLeft:'20px'}}>排行榜</span>
            <span className="common-title-style" style={{marginLeft:'20px'}}>分类</span>
          </div>
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
          {/* 轮播图 */}
          <Carousel
          style={{marginTop:'10px',borderRadius:'16px'}}
          autoplay={false}
          infinite
          dots={false}
          beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
          afterChange={index => console.log('slide to', index)}
        >
          {this.state.data.map(val => (
            <a
              key={val}
              href=""
              style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
            >
              <img
                src="assets/images/banner1.png"
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  this.setState({ imgHeight: 'auto' });
                }}
              />
            </a>
          ))}
        </Carousel>
          <div style={{marginTop:'24px',lineHeight:'21px'}}>
            <span style={{fontSize:'18px',fontWeight:500}}>最新</span>
            <span style={{float:'right',fontSize:'14px',fontWeight:400,color:'#353535'}}>更多</span>
          </div>
          <div className="newList">
                {/* <div className="good-box" onClick={this.goodClick.bind(this,1)}>
                    <div style={{height:'239px',overflow:'hidden'}}>
                      <img src="assets/images/1.jpg" style={{width:'100%'}} />
                    </div>
                    <div style={{height:'99px',backgroundColor:'#fff'}}>
                      <div style={{float:'left',width:'70%',marginTop:'10px',paddingLeft:'16px'}}>
                        <div style={{fontSize:'20px',fontWeight:500,lineHeight:'21px'}}>摩尔庄园：吉比特</div>
                        <div style={{display:'flex',marginTop:'10px',alignItems:'center'}}>
                          <div className="avator-box">
                            <img src="assets/images/ava.jpg" style={{width:'32px'}} />
                          </div>
                          <div style={{marginLeft:'8px'}}>@7onder</div>
                        </div>
                      </div>
                      <div style={{float:'right',verticalAlign:'middle',height:'100%',marginRight:'22px'}}>
                        <div className="buy-button"> <Link to='/detail' style={{color:'#FFA71C'}}>购买</Link> </div>
                        <div style={{marginTop:'5px',fontSize:'11px',lineHeight:'20px',fontWeight:400,color:'rgba(53, 53, 53, 0.5)'}}>100 CB</div>
                      </div>
                    </div>
                </div> */}
                {marketStore.priMarketItems.map((product,key) => (
                <div className="good-box" onClick={this.goodClick.bind(this,product.typeID,product.itemID)}>
                    <div className="home-good-img-size" style={{}}>
                      <img src={tmpList[product.typeID-1]['face']} style={{width:'100%'}} />
                    </div>
                    <div style={{height:'99px',backgroundColor:'#fff'}}>
                      <div style={{float:'left',width:'70%',marginTop:'10px',paddingLeft:'16px'}}>
                        <div style={{fontSize:'20px',fontWeight:500,lineHeight:'21px'}}>{tmpList[product.typeID-1]['title']}</div>
                        <div style={{display:'flex',marginTop:'10px',alignItems:'center'}}>
                          <div className="avator-box">
                            <img src="/assets/images/test.jpg" style={{width:'32px'}} />
                          </div>
                          <div style={{marginLeft:'8px'}}>{tmpList[product.typeID-1]['author']}</div>
                        </div>
                      </div>
                      <div style={{float:'right',verticalAlign:'middle',height:'100%',marginRight:'22px'}}>
                        <div className="buy-button"> <Link to='/detail' style={{color:'#FFA71C'}}>购买</Link> </div>
                        <div style={{marginTop:'5px',fontSize:'11px',lineHeight:'20px',fontWeight:400,color:'rgba(53, 53, 53, 0.5)'}}>{tmpList[product.typeID-1]['price']} CB</div>
                      </div>
                    </div>
                </div>
                ))}
          </div>
          {/* 这是首页: 数字{appStore.num}
          <Button type="primary" onClick={this.addNum}>增加</Button> */}
          <WhiteSpace />
          </WingBlank>
      </div>
    )
  }

}

export default withRouter(Home);
