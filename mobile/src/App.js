import React from 'react'
import { NavLink, withRouter,Route,Switch,Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'

import './App.css';

import Main from './main/main';
import Detail from './detail/detail'
import MyBuyDetail from './my/detail/detail'
// import 'antd-mobile/dist/antd-mobile.css'; 
import { NavBar, Icon,TabBar } from 'antd-mobile';
@inject('appStore') @withRouter
class App extends React.Component {

  render (){
    return (
      <div id="App" style={{padding:'0 0'}}>
       <Switch>
            <Route path='/' exact component={Main}/>
            <Route path={`/detail/:type/:itemID`} component={Detail}/>
            <Route path={`/my/detail/:type/:itemID`} component={MyBuyDetail}/>
            <Redirect exact from={'/'} to={'/find'}/>
        </Switch>
      </div>
      
    )
  }
  
}

export default App;
