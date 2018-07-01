/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-11 22:47:48 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-07-01 18:13:32
 */

import React, { Component } from 'react'
import {Link} from 'react-router-dom'

import './style.less'

class MHeader extends Component {
  render() {
    return (
      <div className="m-header">
        <div className="icon" />
        <h1 className="text">Chiken Music</h1>
        <Link to="/user"  className="mine">
          <i className="icon-mine"></i>
        </Link>
      </div>
    )
  }
}

export default MHeader
