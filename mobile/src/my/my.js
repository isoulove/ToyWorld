import React from 'react'
// import 'antd-mobile/dist/antd-mobile.css'; 
import { NavBar, Icon,TabBar } from 'antd-mobile';

class My extends React.Component {
  constructor(props) {
    super(props);
   
  }

  componentDidMount() {
    
  }

  

  
  render (){
    return (
      <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
          这是我的模块
      </div>
      
    )
  }
  
}

export default My;