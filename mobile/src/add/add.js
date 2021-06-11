import React from 'react'
// import 'antd-mobile/dist/antd-mobile.css'; 
import './add.css'; 
class Add extends React.Component {
  constructor(props) {
    super(props);
   
  }

  componentDidMount() {
    
  }

  

  
  render (){
    return (
      <div style={{ textAlign:'center',backgroundColor:'white',padding:'10px 40px',height:'100%' }}>
        <img src="/assets/images/upload.jpg" style={{width:'100%'}} />
        <div style={{fontSize:"14px",color:'rgba(0, 0, 0, 0.4)'}}>
            我们支持 FBX、OBJ、STL、GlTF等格式，你也可以上传包含贴图、材质、网格的压缩包。
            请阅读我们的上传指南。
        </div>

        <div style={{marginTop:'20px'}}>
        <div className="choose" style={{background: 'url(/assets/images/button-lg.jpg) center center / 280px 46px no-repeat'}}>
                从本地选择文件...
            </div>
        </div>
         
      </div>
      
    )
  }
  
}

export default Add;
