import React from 'react'
import { inject, observer } from 'mobx-react'
import { Button, WhiteSpace,WingBlank } from 'antd-mobile';

@inject('appStore')  
@observer
class Home extends React.Component {

  addNum = ()=>{
    this.props.appStore.addNum()
  }
  
  render (){
      const {appStore} = this.props
    return (
      <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
          这是首页: 数字{appStore.num}
          <WingBlank>
          <Button type="primary" onClick={this.addNum}>增加</Button><WhiteSpace />
          </WingBlank>
      </div>
    )
  }

}

export default Home;
