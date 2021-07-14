import React from 'react'
import { Modal, WhiteSpace,Icon } from 'antd-mobile';
import {DAEModel,JSONModel,OBJModel,Tick,MTLModel,GLTFModel,AmbientLight,DirectionLight} from 'react-3d-viewer'

class ShowImg extends React.Component {
  constructor(props){
    super();
    console.log(props)
    this.state = {
      cid:props.cid,
      fileType:props.fileType,
      width: (window.innerWidth*1)/2,
    }
    console.log(window.innerWidth*1,'w')
  }
   
  componentDidMount(){
      console.log(this.state)
    }

  componentWillReceiveProps(newProps){
    this.setState ({
      cid:newProps.cid,
      fileType:newProps.fileType,
      width: (window.innerWidth*1)/2,
    })
  }
   

  render (){
    console.log(this.state)
    return (
      <div>
        {
                    this.state.fileType=='gltf'?
                    <GLTFModel
                      src={`https://${this.state.cid}.ipfs.dweb.link`}
                      position={{x:0,y:-160,z:0}}
                      width={this.state.width} 
                      height={this.state.width} 
                      onLoad={()=>{
                        this.props.onLoaded()
                      }}
                    >
                      <AmbientLight color={0xffffff}/>
                      <DirectionLight color={0xffffff} position={{x:100,y:200,z:100}}/>
                      <DirectionLight color={0xff00ff} position={{x:-100,y:100,z:-100}}/>
                    </GLTFModel>
                    :this.state.fileType=='json'?
                    <JSONModel 
                    src={`https://${this.state.cid}.ipfs.dweb.link`} 
                    width={this.state.width} 
                    height={this.state.width} 
                     />
                    :this.state.fileType=='obj'?
                    <OBJModel src={`https://${this.state.cid}.ipfs.dweb.link`}
                     texPath=""
                     width={this.state.width} 
                     height={this.state.width} 
                     />
                    :this.state.fileType=='mtl'?
                    <MTLModel 
                        enableZoom = {false}
                        position={{x:0,y:-100,z:0}}
                        rotation={this.state.rotation}
                        width={this.state.width} 
                        height={this.state.width} 
                        // texPath="./src/lib/model/"
                        mtl="./src/lib/model/freedom.mtl"
                        src={`https://${this.state.cid}.ipfs.dweb.link`}
                    />
                    :this.state.fileType=='dae'?
                    <DAEModel 
                    width={this.state.width} 
                      height={this.state.width} 
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
    )
  }

}

export default ShowImg;
