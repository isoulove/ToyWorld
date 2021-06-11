import React from 'react'
import { NavLink, withRouter,Route,Switch,Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'

import './main.css';
import Home from '../home/home';
import Add from '../add/add';
import My from '../my/my';
import Message from '../message/message';
import Bbs from '../bbs/bbs';
// import 'antd-mobile/dist/antd-mobile.css'; 
import { NavBar, Icon,TabBar } from 'antd-mobile';
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          selectedTab: 'blueTab',
          hidden: false,
        };
      }
    
  
  render (){
      const {appStore} = this.props
    return (
      <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
      <TabBar
        unselectedTintColor="#949494"
        tintColor="#33A3F4"
        barTintColor="white"
        tabBarPosition="bottom"
        hidden={this.state.hidden}
        prerenderingSiblingsNumber={0}
      >
        <TabBar.Item
          title="商店"
          key="home"
          class="dddd"
          icon={<div style={{
            width: '22px',
            height: '22px',
            background: 'url(assets/images/shop.png) center center /  26px 26px no-repeat' }}
          />
          }
          selectedIcon={<div style={{
            width: '22px',
            height: '22px',
            background: 'url(assets/images/shop1.png) center center /  26px 26px no-repeat' }}
          />
          }
          selected={this.state.selectedTab === 'blueTab'}
          // badge={1}
          onPress={() => {
            this.setState({
              selectedTab: 'blueTab',
            });
          }}
          data-seed="logId"
        >
          <Home />
        </TabBar.Item>
        <TabBar.Item
          icon={
            <div style={{
              width: '22px',
              height: '22px',
              background: 'url(assets/images/bbs.png) center center /  26px 26px no-repeat' }}
            />
          }
          selectedIcon={
            <div style={{
              width: '22px',
              height: '22px',
              background: 'url(assets/images/bbs1.png) center center /  26px 26px no-repeat' }}
            />
          }
          title="社区"
          key="bbs"
          dot
          selected={this.state.selectedTab === 'greenTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'greenTab',
            });
          }}
        >
          <Bbs />
        </TabBar.Item>
        <TabBar.Item
          icon={
            <div style={{
              width: '50px',
              height: '50px',
              marginTop:'-28px',
              zIndex:1000,
              background: 'url(assets/images/add.png) center center /  59px 59px no-repeat' }}
            />
          }
          selectedIcon={
            <div style={{
              width: '50px',
              height: '50px',
              marginTop:'-28px',
              zIndex:1000,
              background: 'url(assets/images/add.png) center center /  59px 59px no-repeat' }}
            />
          }
          title="发布"
          key="add"
          selected={this.state.selectedTab === 'redTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'redTab',
            });
          }}
        >
          <Add />
          {/* {this.renderContent('My')} */}
        </TabBar.Item>
        <TabBar.Item
          icon={
            <div style={{
              width: '22px',
              height: '22px',
              background: 'url(assets/images/message.png) center center /  26px 26px no-repeat' }}
            />
          }
          selectedIcon={
            <div style={{
              width: '22px',
              height: '22px',
              background: 'url(assets/images/message1.png) center center /  26px 26px no-repeat' }}
            />
          }
          title="消息"
          key="message"
          selected={this.state.selectedTab === 'blackTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'blackTab',
            });
          }}
        >
          <Message />
          {/* {this.renderContent('My')} */}
        </TabBar.Item>
        <TabBar.Item
         icon={
          <div style={{
            width: '22px',
            height: '22px',
            background: 'url(assets/images/my.png) center center /  26px 26px no-repeat' }}
          />
        }
        selectedIcon={
          <div style={{
            width: '22px',
            height: '22px',
            background: 'url(assets/images/my1.png) center center /  26px 26px no-repeat' }}
          />
        }
          title="我的"
          key="my"
          selected={this.state.selectedTab === 'yellowTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'yellowTab',
            });
          }}
        >
          <My />
          {/* {this.renderContent('My')} */}
        </TabBar.Item>
      </TabBar>
    </div>
    )
  }

}

export default Main;
