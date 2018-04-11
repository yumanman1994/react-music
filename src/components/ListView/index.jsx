/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-04 01:02:13 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-10 01:25:13
 * @desc 滚动列表组件
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import Scroll from 'components/Scroll'
import Loading from 'components/Loading'
import { getData } from 'common/js/dom'
import LazyLoad, { forceCheck } from 'react-lazyload'

import './style.less'
const defaultImg = require('common/image/default.png')
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 20

class ListView extends Component {
  static defaultProps = {
    listData: []
  }

  static propTypes = {
    listData: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      //   侧边栏导航数据
      shortcutList: [],
      currentIndex: 0,
      fxiedShow: false

      // shortcutList:this.pro
    }
    // 滑动侧边栏的时候保存滑动开始是滑动过程中的滑动距离 和滑动到相对应的锚点
    this.shortcutTouch = {}
    this.diff = -1
    // 每个group距离滑动区域顶部的高度
    // this.listHeight = []
  }
  render() {
    let { listData } = this.props
    let { shortcutList, currentIndex, fxiedShow } = this.state
    let fxiedTitle = ''
    if (listData.length) {
      fxiedTitle = listData[currentIndex].title
    }
    this.groupList = []

    return (
      <Scroll
        className="listview"
        probeType={3}
        listenScroll={true}
        onScroll={this.handleBScroll}
        ref={listview => {
          this.listview = listview
        }}
      >
        <ul>
          {listData.map((group, i) => (
            <li
              className="list-group"
              key={i}
              ref={group => {
                if (group) {
                  this.groupList.push(group)
                }
              }}
            >
              <h2 className="list-group-title">{group.title}</h2>
              <ul>
                {group.items.map((item, index) => (
                  <li
                    key={index}
                    className="list-group-item"
                    onClick={() => {
                      // console.log(group)
                      // console.log(index)
                      this.handleClick(item)
                    }}
                  >
                    <LazyLoad
                      height={50}
                      offset={0}
                      once={true}
                      key={index}
                      placeholder={
                        <img
                          width="50"
                          height="50"
                          src={defaultImg}
                          alt="default"
                        />
                      }
                    >
                      <img className="avatar" src={item.avatar} alt="" />
                    </LazyLoad>
                    <span className="name">{item.name}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div
          className="list-shortcut"
          onTouchStart={this.onShortcutTouchStart}
          onTouchMove={this.onShortcutTouchMove}
          onTouchEnd={this.onShortcutTouchEnd}
        >
          <ul>
            {shortcutList.map((item, index) => (
              <li
                key={index}
                className={`item ${currentIndex === index ? 'current' : ''}`}
                data-index={index}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* {fxiedShow ? ( */}
        <div
          className="list-fixed"
          ref={fixed => {
            this.fixed = fixed
          }}
          style={fxiedShow ? {} : { display: 'none' }}
        >
          <div className="fixed-title">{fxiedTitle} </div>
        </div>
        {/* ) : null} */}

        {listData.length ? null : (
          <div className="loading-container">
            <Loading />
          </div>
        )}
      </Scroll>
    )
  }

  // 接收新的props时候调用
  componentWillReceiveProps(nextProps) {
    // this.setState((prevState,nextProps) => ({
    //     shortcutList:nextProps.listData

    // }))
    let listDataStr = JSON.stringify(this.props.listData)
    let preListDataStr = JSON.stringify(nextProps.listData)
    if (listDataStr !== preListDataStr) {
      this.setState({
        shortcutList: nextProps.listData.map(group => {
          return group.title.substr(0, 1)
        })
      })
    }
  }

  // 更新之前调用
  componentWillUpdate(nextProps, nextState) {
    // console.log(nextProps, nextState, 'componentWillUpdate')
  }

  // 更新之后
  componentDidUpdate(prevProps, prevState) {
    // console.log(prevProps, prevState, 'componentDifdUpdate')

    let prevListDataStr = JSON.stringify(prevProps.listData)
    let listDataStr = JSON.stringify(this.props.listData)
    // console.log(JSON.stringify(listData))
    // setTimeout(() => {
    //   this._calcullateHeight()
    // }, 20)
    if (prevListDataStr !== listDataStr) {
      // setTimeout(() => {
      this._calcullateHeight()
      // }, 1000)
    }
  }

  componentWillUnmount() {
    this.listview.disable()
    this.listview.destroy()
  }

  @autobind
  onShortcutTouchStart(e) {
    let anchorIndex = parseInt(getData(e.target, 'index'))
    // 记录手指的位置 和当前点击点几个 group
    let firstTouch = e.touches[0]
    this.shortcutTouch.y1 = firstTouch.pageY
    this.shortcutTouch.anchorIndex = anchorIndex

    // setTimeout(() => {
    this._scrollTo(anchorIndex)
    // }, 300);
  }

  @autobind
  handleClick(item) {
    this.props.handleClick(item)
    // console.log(this.props.listData)
  }

  @autobind
  onShortcutTouchMove(e) {
    let lasyTouch = e.touches[0]
    this.shortcutTouch.y2 = lasyTouch.pageY
    // console.log(this.shortcutTouch)

    let delta = Math.floor(
      (this.shortcutTouch.y2 - this.shortcutTouch.y1) / ANCHOR_HEIGHT
    )
    // console.log(delta)
    let anchorIndex = parseInt(this.shortcutTouch.anchorIndex) + delta

    // setTimeout(() => {
    this._scrollTo(anchorIndex)
    // }, 300);
  }

  @autobind
  onShortcutTouchEnd(e) {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  @autobind
  handleBScroll(pos) {
    // console.log(arguments)
    forceCheck()
    if (pos) {
      this._calcullateCurrentIndex(pos.y)
      if (pos.y > 0) {
        if (this.state.fxiedShow) {
          this.setState({
            fxiedShow: false
          })
        }
      } else {
        if (!this.state.fxiedShow) {
          this.setState({
            fxiedShow: true
          })
        }
      }
    }
  }

  _calcullateCurrentIndex(newScrollY) {
    const listHeight = this.listHeight
    // 当滚动到顶部
    if (newScrollY > 0) {
      // this.currentIndex = 0;
      this._updataCurrentIndex(0)

      return false
    }
    for (let i = 0; i < listHeight.length; i++) {
      const height1 = listHeight[i]
      const height2 = listHeight[i + 1]

      // 在中间滚动
      if (-newScrollY >= height1 && -newScrollY < height2) {
        this._updataCurrentIndex(i)
        this.diff = height2 + newScrollY
        this._calcullateDiff(this.diff)
        return false
      }
    }
    this._updataCurrentIndex(listHeight.length - 2)
  }

  _calcullateDiff(diff) {
    let fxiedTop = diff > 0 && diff < TITLE_HEIGHT ? diff - TITLE_HEIGHT : 0

    if (this.fxiedTop === fxiedTop) {
      return
    }
    this.fxiedTop = fxiedTop
    this.fixed.style.transform = `translate3d(0,${fxiedTop}px,0)`
  }

  @autobind
  _updataCurrentIndex(newCurrentIndex) {
    if (newCurrentIndex === this.state.currentIndex) {
      return
    }
    this.setState({
      currentIndex: newCurrentIndex
    })
  }

  @autobind
  _scrollTo(index) {
    // console.log(index)
    if (!index && index !== 0) {
      return
    }

    if (index < 0) {
      index = 0
    } else if (index > this.listHeight.length - 2) {
      index = this.listHeight.length - 2
    }

    this._calcullateCurrentIndex(-this.listHeight[index])
    // this._updataCurrentIndex(index)
    // console.log(this.groupList)
    this.listview.scrollToElement(this.groupList[index], 0)
    this.listview.enable()
    forceCheck()
  }

  @autobind
  _calcullateHeight() {
    this.listHeight = []
    const list = this.groupList
    let height = 0
    this.listHeight.push(height)
    for (let index = 0; index < list.length; index++) {
      const item = list[index]
      height += item.clientHeight
      this.listHeight.push(height)
    }

    // console.log(this.listHeight)
  }
}

export default ListView
