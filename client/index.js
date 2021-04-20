import './index.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from "react-router-dom";
import 'bootstrap'
import Root from './components/Root'

if (document.getElementById("root")) {
    ReactDOM.render(
        <BrowserRouter>
          <Root/>
        </BrowserRouter>,
      document.getElementById("root")
    );
  }
  