import React from 'react'
import {WhiteSpace,Icon,Modal,Toast,Tag,TextareaItem,InputItem, Stepper } from 'antd-mobile';
import { withRouter } from 'react-router-dom'

import { NFTStorage, Blob,File } from 'nft.storage'
import { inject, observer } from 'mobx-react'
import {storeFiles} from '../utils/IPFSUtil'
import {DAEModel,JSONModel,OBJModel,Tick,MTLModel,GLTFModel,AmbientLight,DirectionLight} from 'react-3d-viewer'
// import 'antd-mobile/dist/antd-mobile.css'; 
import './add.css'; 
@inject('userStore')  
@observer
class Add extends React.Component {
  userInfo = this.props.userStore.userInfo
  state = {
    price:35,
    num:1,
    buy:false,
    modal1:false,
    modal2:false,
    amount:200,
    width: window.innerWidth*1,
    showAdd: this.userInfo.addr!=null,
    item:{},
    desc:'',
    title:'',
    fileType:'',
    cid:''
  }
  


  toWallet = ()=>{
    //连接钱包操作，获取商品列表
    this.props.userStore.tools.logIn()
    //Toast.success('连接成功！', 2);
    this.setState({showAdd:this.props.userStore.userInfo.addr !=null})
  }

  getFile = async(e)=>{
    Toast.loading('加载中...',30)
    const file = e.target.files[0]
    let b = file.name.substr(file.name.lastIndexOf(".") + 1);
    // this.setState({fileType:b.toLowerCase()})
    // const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweERiZTlDNzFhNzcwRjkxMGQ2NzdjRURkMkVjMGZGZGZCZDA1ZWMxZDkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyNTk5MTExNzk0MywibmFtZSI6InRveVdvcmxkIn0.eXn_GY64KAj7uGWiSibpjwxlTh8Rf_dRsudAX_9LkMI"
      try{
        // const client = new NFTStorage({ token: apiKey })
        const r = storeFiles(e.target.files)
        // this.setState({cid:cid,showNext:true})
        r.then((res)=>{
        console.log(res,b)
          this.setState({cid:res,showNext:true,fileType:b.toLowerCase()})
          Toast.hide()
        })
        // const cid = await client.storeBlob(new Blob(e.target.files));
      } catch(err){
        Toast.hide()
        Toast.fail('网络错误：'+err.message)
      }
    // }

}
//发布
toPub = ()=>{
  const {price,desc,cid,title,num,fileType} = this.state
  console.log(price,num)
  if(!cid){
    Toast.fail('请上传文件')
    return;
  }
  if(!desc || !title){
    Toast.fail('请输入名称和描述')
    return;
  }
  if(!price || !num){
    Toast.fail('请选择价格和数量')
    return;
  }
  const _this = this
  this.props.userStore.mintToyItems(
    {price,desc,cid,title,num,fileType},
    this.props.userStore.userInfo.addr,
    function(res){
      _this.props.history.push('/')
    }
    )
}

setDesc = (e)=>{
  this.setState({desc:e})
}

setTitle = (e)=>{
  this.setState({title:e})
}

onChange = (val) => {
  // console.log(val);
  this.setState({ price:parseFloat(val) });
}
onChange1 = (val1) => {
  // console.log(val);
  this.setState({ num:parseInt(val1) });
}

  componentDidMount() {
    
  }

  componentWillReceiveProps(props){
    this.setState({showNext:false,cid:''})
  }
  
  render (){
    const {width,showAdd} = this.state
    return (
      <div style={{height:'100%'}}>
        <div className={!this.state.showNext?'show':'hidden'} style={{ textAlign:'center',backgroundColor:'white',padding:'10px 40px',height:'100%' }}>
          <img src="/assets/images/upload.jpg" style={{width:'100%'}} />
          <div style={{fontSize:"14px",color:'rgba(0, 0, 0, 0.4)'}}>
              我们支持 DAE、OBJ、JSON、GlTF等格式，你也可以上传包含贴图、材质、网格的压缩包。
              请阅读我们的上传指南。
          </div>

          <div style={{marginTop:'20px'}}>
            {
              showAdd?
              <label for="chooseFile">
              <div className="choose" style={{background: 'url(/assets/images/button-lg.jpg) center center / 280px 46px no-repeat'}}>
                  从本地选择文件...
              </div>
            <input type="file" id="chooseFile" style={{display:'none'}} onChange={this.getFile} />

            </label>
            :
            <div onClick={this.toWallet} className="choose" style={{background: 'url(/assets/images/button-lg.jpg) center center / 280px 46px no-repeat'}}>
              从本地选择文件...
            </div>
            }
           
          </div>
        </div>
        <div className={this.state.showNext?'show':'hidden'} style={{padding:'0 0 90px 0'}}>
          {/* <div className="top-nav" onClick={() => this.props.history.goBack()} >
            <Icon type="left"  size="lg" color="#ddd" />
          </div> */}
          {/* <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => console.log('onLeftClick')}
            >
                
            </NavBar> */}
            <div className="detail-box" >
                <div style={{minHeight:'239px'}}>
                  {
                    this.state.fileType=='gltf'?
                    <GLTFModel
                      src={`https://bafkreifzv53zjerzgtzanw4otohu6h3p7rjgh7fbsll2w4dlpigxk5qmbe.ipfs.dweb.link`}
                      position={{x:0,y:-160,z:0}}
                      width={width} 
                      height={width}
                      onLoad={()=>{
                        this.props.onLoaded()
                      }}
                    >
                      <AmbientLight color={0xffffff}/>
                      <DirectionLight color={0xffffff} position={{x:100,y:200,z:100}}/>
                      <DirectionLight color={0xff00ff} position={{x:-100,y:100,z:-100}}/>
                    </GLTFModel>
                    :this.state.fileType=='json'?
                    <JSONModel src={`https://${this.state.cid}.ipfs.dweb.link`}  />
                    :this.state.fileType=='obj'?
                    <OBJModel src={`https://${this.state.cid}.ipfs.dweb.link`} texPath=""/>
                    :this.state.fileType=='mtl'?
                    <MTLModel 
                        enableZoom = {false}
                        position={{x:0,y:-100,z:0}}
                        rotation={this.state.rotation}
                        // texPath="./src/lib/model/"
                        mtl="./src/lib/model/freedom.mtl"
                        src={`https://${this.state.cid}.ipfs.dweb.link`}
                    />
                    :this.state.fileType=='dae'?
                    <DAEModel 
                    width={width} 
                    height={width}
                      src={`https://${this.state.cid}.ipfs.dweb.link`}
                      onLoad={()=>{
                        // ...
                      }}
                    >
                      <DirectionLight color={0xff00ff}/>
                    </DAEModel>
                    :<img src={`https://${this.state.cid}.ipfs.dweb.link`} style={{width:'100%'}} />

                  }
                    
                </div>
                <div className="bkc-fff" style={{minHeight:'80px',borderBottom:'1px solid #C4C4C4',paddingTop:'5px'}}>
                <InputItem
                  placeholder="输入NFT名称..."
                  onChange={this.setTitle}
                />
                <TextareaItem
                  rows={2}
                  placeholder="描述一下这款NFT..."
                  onChange={this.setDesc}
                />
                </div>

                <div className="bkc-fff" style={{minHeight:'100px',padding:'20px 16px 20px 16px'}}>
                  <div style={{width:'100%',clear:'both',height:'32px'}}>
                    <div style={{float:'left',fontSize:'16px',lineHeight:'32px',fontWeight:700}}>挂单价格(cb)</div>
                    <Stepper
                          style={{  minWidth: '100px',float:'right',height:'32px' }}
                          showNumber
                          min={1}
                          value={this.state.price}
                          onChange={this.onChange}
                        />

                  </div>
                  <div style={{width:'100%',clear:'both',marginTop:'20px',height:'32px'}}>
                    <div style={{float:'left',fontSize:'16px',lineHeight:'32px',fontWeight:700}}>数量</div>
                    <Stepper
                          style={{  minWidth: '100px',float:'right',height:'32px',maxWidth:'300px' }}
                          showNumber
                          min={1}
                          value={this.state.num}
                          onChange={this.onChange1}
                        />
                  </div>
                    
                </div>
            </div>
          {/* 这是首页: 数字{appStore.num}
          <Button type="primary" onClick={this.addNum}>增加</Button> */}
          <div className="bottom-item-home">
            <div onClick={this.toPub} className="buy-now" style={{background: 'url(/assets/images/button-lg.jpg) center center / 260px 46px no-repeat'}}>
                立即发布
            </div>
          </div>

         
        
      </div>
      </div>
    )
  }
  
}

export default withRouter(Add);
