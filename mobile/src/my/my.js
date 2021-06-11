import React from 'react'
import './my.css'; 
import { NavBar, Icon,TabBar } from 'antd-mobile';

class My extends React.Component {
  constructor(props) {
    super(props);
   
  }

  componentDidMount() {
    
  }

  

  
  render (){
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
                    <div style={{marginTop:'8px',fontSize:'12px',fontWeight:400,color:'#4f4f4f'}}>ID:19860102</div>
                    </div>
              </div>
              <div style={{float:'right'}}>
                <img src="" />
              </div>
            </div>

            <div style={{padding:'30px 54px 10px 54px'}}>
                <div style={{marginLeft:'15px',float:'left',color:'#FFA71C',fontSize:'14px',fontWeight:400,lineHeight:'22px'}}>我的购买（2）</div>
                <div style={{marginRight:'15px',float:'right',fontSize:'14px',fontWeight:400,lineHeight:'22px'}}>我发布的（0）</div>
            </div>
          </div>
          <div className="goodList">
            <div className="list">
                  <div className="item">
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
                  <div className="item">
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
      </div>
      
    )
  }
  
}

export default My;
