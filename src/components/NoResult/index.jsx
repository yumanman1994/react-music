/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-24 21:21:19 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-24 21:23:25
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './style.less'

class NoResult extends PureComponent {
    static defaultProps = {
        title:''
    }

    static propTypes = {
        title:PropTypes.string.isRequired
    }
  render() {
    return (
        <div className="no-result">
        <div className="no-result-icon"></div>
        <p className="no-result-text">{this.props.title}</p>
      </div>
    )
  }
}

export default NoResult
  