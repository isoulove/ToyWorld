import React from 'react'
import { Modal, WhiteSpace,Icon } from 'antd-mobile';

class Check extends React.Component {
    state ={
        modal1:this.props.show
    }

    componentDidMount(newProps){
        console.log(newProps)
    }
    onClose = ()=>{
        this.setState({modal1:false})
    }

  render (){
    return (
      <div>
        
      </div>
    )
  }

}

export default Check;
