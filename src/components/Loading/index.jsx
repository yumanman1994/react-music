/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-11 22:47:42 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-11 23:43:28
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './style.less'
const loadingImg = require('common/image/loading.gif')


class Loading extends Component {
  static defaultProps = {
    title: '正在载入...'
  }

  static propTypes = {
    title: PropTypes.string.isRequired
  }
  render() {
    return (
      <div className="loading">
        <img width="24" height="24" src={loadingImg} alt="加载中" />
        <p className="desc">{this.props.title}</p>



        
      </div>
    )
  }
}

export default Loading
