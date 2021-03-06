import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'mobx-react'
import stores from './store/index'
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom'

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

import "./global/config"

import { FlowService } from "./flow/util/flow"

window.fcl = fcl
window.t = t
window.flowSer = new FlowService()
window.auth = window.flowSer.authorizeMinter()

ReactDOM.render(
  <Provider {...stores}>
    <BrowserRouter >
        <App />
    </BrowserRouter>
  </Provider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
