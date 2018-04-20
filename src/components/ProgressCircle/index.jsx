/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-20 15:20:20 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-20 16:23:24
 * @Desc mini播放器圆形进度条
 */

 
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './style.less'



class ProgressCircle extends Component {
  static defaultProps = {
    radius: 100,
    percent:0
  }

  static propTypes = {
    radius: PropTypes.number.isRequired,
    percent:PropTypes.number.isRequired
  }

  constructor(props){
      super(props)

      this.state={
        dashArray:Math.PI *100 
      }
  }

  render() {
    return (
        <div className="progress-circle" >
        <svg width={this.props.radius} height={this.props.radius} viewBox="0 0 100 100" version="1.1"
        xmlns="http://www.w3.org/2000/svg">
    
          <circle className="progress-background" cx="50" cy="50" r="50"
              fill="transparent"
          />
          <circle className="progress-bar" cx="50" cy="50" r="50"
              fill="transparent"
              strokeDasharray={this.state.dashArray}
              strokeDashoffset={ (1-this.props.percent) * this.state.dashArray}
    
          />
    
    
        </svg>
       {
           this.props.children
       }
    
    
     </div>
    )
  }
}

export default ProgressCircle
