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
        <img src="/assets/images/tmp.png" width="100%" />
  </div>
      
    )
  }
  
}

export default withRouter(Bbs);
