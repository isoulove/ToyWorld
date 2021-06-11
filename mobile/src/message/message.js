import React from 'react'
// import 'antd-mobile/dist/antd-mobile.css'; 
import { NavBar, Icon,TabBar } from 'antd-mobile';

class Message extends React.Component {
  constructor(props) {
    super(props);
   
  }

  componentDidMount() {
    
  }

  

  
  render (){
    return (
      <div style={{ textAlign:'center',marginTop:'50px',color:'red' }}>
          尽请期待！
      </div>
      
    )
  }
  
}

export default Message;
