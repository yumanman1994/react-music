/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-11 22:47:58 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-11 23:32:56
 */

import React, { Component } from 'react'
import BScroll from 'better-scroll'
import { autobind } from 'core-decorators'
import PropTypes from 'prop-types'

class Scroll extends Component {
  static defaultProps = {
    probeType: 1,
    click: true,
    className: '',
    listenScroll: false
  }

  static propTypes = {
    probeType: PropTypes.number.isRequired,
    click: PropTypes.bool.isRequired,
    className: PropTypes.string.isRequired,
    listenScroll: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={this.props.className} ref="wrapper">
        {this.props.children}
      </div>
    )
  }

  componentDidMount() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  }
  @autobind
  _initScroll() {
    let wrapper = this.refs.wrapper
    if (!wrapper) {
      return
    }

    this.scroll = new BScroll(wrapper, {
      probeType: this.props.probeType,
      click: this.props.click
    })

    if (this.props.listenScroll) {
      this.scroll.on('scroll', (pos) => {
        if (!this.props.onScroll) {
          return
        }
        

        this.props.onScroll(pos)
      })
    }

    this.scroll.on('scrollEnd',() =>{
      console.log('end')
    })
  }

  // 启用 better-scroll, 默认 开启。
  @autobind
  enable() {
    this.scroll && this.scroll.enable()
  }
  // 作用：禁用 better-scroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应。
  @autobind
  disable() {
    this.scroll && this.scroll.disable()
  }
  // 高宽变化的时候去刷新scroll
  @autobind
  refresh() {
    this.scroll && this.scroll.refresh()
  }
  @autobind
  stop(){
    // alert('stop')
    this.scroll && this.scroll.stop()
  }
  
  @autobind
  destroy(){
    this.scroll && this.scroll.destroy()
  }
  // @autobind
  // enable(){
  //   this.scroll && this.scroll.enable()
  // }


  @autobind
  scrollTo() {
    this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
  }

  @autobind
  scrollToElement() {
    this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
  }
}

export default Scroll
